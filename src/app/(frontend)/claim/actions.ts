'use server'

import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'

import { createSupabaseServiceRoleClient } from '@/lib/supabase/server'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const DUPLICATE_EMAIL_PATTERN = /(already exists|already registered|email.*exists|duplicate)/i

type BusinessClaimLookup = {
  id: number
  claimTokenUsedAt?: string | null
  supabaseUserId?: string | null
  listingTier?: 'free' | 'bronze' | 'silver' | 'gold' | 'platinum' | null
  verified?: boolean | null
  email?: string | null
}

export type ClaimActionState = {
  error: string | null
}

const isDuplicateEmailError = (error: unknown) => {
  if (!error || typeof error !== 'object') {
    return false
  }

  const code = 'code' in error && typeof error.code === 'string' ? error.code : ''
  const message = 'message' in error && typeof error.message === 'string' ? error.message : ''

  return code.toLowerCase() === 'email_exists' || DUPLICATE_EMAIL_PATTERN.test(message)
}

export const submitClaimAction = async (
  _: ClaimActionState,
  formData: FormData,
): Promise<ClaimActionState> => {
  const tokenValue = formData.get('token')
  const emailValue = formData.get('email')
  const passwordValue = formData.get('password')
  const confirmPasswordValue = formData.get('confirmPassword')

  const token = typeof tokenValue === 'string' ? tokenValue.trim() : ''
  const email = typeof emailValue === 'string' ? emailValue.trim().toLowerCase() : ''
  const password = typeof passwordValue === 'string' ? passwordValue : ''
  const confirmPassword = typeof confirmPasswordValue === 'string' ? confirmPasswordValue : ''

  if (!token) {
    return { error: 'This claim link is invalid or expired.' }
  }

  if (!EMAIL_PATTERN.test(email)) {
    return { error: 'Please enter a valid email address.' }
  }

  if (password !== confirmPassword) {
    return { error: 'Passwords do not match.' }
  }

  if (password.length < 8) {
    return { error: 'Password must be at least 8 characters.' }
  }

  const payload = await getPayload({ config })

  const businessLookup = await payload.find({
    collection: 'businesses',
    where: {
      claimToken: {
        equals: token,
      },
    },
    depth: 0,
    limit: 1,
    overrideAccess: true,
    select: {
      id: true,
      claimTokenUsedAt: true,
      supabaseUserId: true,
      listingTier: true,
      verified: true,
      email: true,
    },
  })

  const business = businessLookup.docs[0] as BusinessClaimLookup | undefined

  if (!business || business.claimTokenUsedAt) {
    return { error: 'This claim link is invalid or has already been used.' }
  }

  const previousBusinessState = {
    supabaseUserId: business.supabaseUserId ?? null,
    claimTokenUsedAt: business.claimTokenUsedAt ?? null,
    listingTier: business.listingTier ?? 'free',
    verified: business.verified ?? false,
    email: typeof business.email === 'string' ? business.email : email,
  }

  const supabase = createSupabaseServiceRoleClient()

  const { data: createdUserData, error: createUserError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: false,
  })

  if (createUserError) {
    if (isDuplicateEmailError(createUserError)) {
      return {
        error:
          'An account with this email already exists. Please log in at /dashboard/login instead.',
      }
    }

    return { error: 'Unable to create your account right now. Please try again shortly.' }
  }

  const supabaseUserId = createdUserData.user?.id
  if (!supabaseUserId) {
    return { error: 'Unable to create your account right now. Please try again shortly.' }
  }

  const cleanupSupabaseUser = async () => {
    const { error } = await supabase.auth.admin.deleteUser(supabaseUserId)

    if (error) {
      console.error('Failed to delete Supabase user during claim rollback:', error)
    }
  }

  try {
    await payload.update({
      collection: 'businesses',
      id: business.id,
      depth: 0,
      overrideAccess: true,
      data: {
        supabaseUserId,
        claimTokenUsedAt: new Date().toISOString(),
        listingTier: 'bronze',
        verified: true,
        email,
      },
    })
  } catch (error) {
    await cleanupSupabaseUser()
    console.error('Business update failed during claim flow:', error)
    return { error: 'Unable to complete your claim right now. Please try again shortly.' }
  }

  const { error: firmUsersInsertError } = await supabase.from('firm_users').insert({
    supabase_user_id: supabaseUserId,
    payload_business_id: business.id,
  })

  if (firmUsersInsertError) {
    await cleanupSupabaseUser()

    try {
      await payload.update({
        collection: 'businesses',
        id: business.id,
        depth: 0,
        overrideAccess: true,
        data: previousBusinessState,
      })
    } catch (rollbackError) {
      console.error('Failed to rollback business after firm_users insert failure:', rollbackError)
    }

    console.error('firm_users insert failed during claim flow:', firmUsersInsertError)
    return { error: 'Unable to complete your claim right now. Please try again shortly.' }
  }

  redirect('/claim/confirm')
}
