'use server'

import { redirect } from 'next/navigation'

import { createSupabaseServerClient } from '@/lib/supabase/server'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const INVALID_CREDENTIALS_PATTERN = /(invalid login credentials|invalid email or password)/i
const UNCONFIRMED_EMAIL_PATTERN = /(email not confirmed|confirm your email)/i

export type DashboardLoginActionState = {
  error: string | null
}

export const signInDashboardUserAction = async (
  _: DashboardLoginActionState,
  formData: FormData,
): Promise<DashboardLoginActionState> => {
  const emailValue = formData.get('email')
  const passwordValue = formData.get('password')

  const email = typeof emailValue === 'string' ? emailValue.trim().toLowerCase() : ''
  const password = typeof passwordValue === 'string' ? passwordValue : ''

  if (!EMAIL_PATTERN.test(email)) {
    return { error: 'Please enter a valid email address.' }
  }

  if (!password) {
    return { error: 'Please enter your password.' }
  }

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    const message = error.message || ''

    if (UNCONFIRMED_EMAIL_PATTERN.test(message)) {
      return {
        error:
          'Your email is not confirmed yet. Please check your inbox and confirm your email before signing in.',
      }
    }

    if (INVALID_CREDENTIALS_PATTERN.test(message)) {
      return { error: 'Invalid email or password. Please try again.' }
    }

    return { error: 'Unable to sign in right now. Please try again shortly.' }
  }

  redirect('/dashboard/profile')
}
