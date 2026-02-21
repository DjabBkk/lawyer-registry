'use server'

import { getPayload } from 'payload'
import config from '@payload-config'

import { createSupabaseServerClient, createSupabaseServiceRoleClient } from '@/lib/supabase/server'
import type { Business } from '@/payload-types'

import type {
  DashboardProfileActionState,
  SupportedCurrencyCode,
} from './types'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const SUPPORTED_CURRENCIES: SupportedCurrencyCode[] = ['THB', 'USD', 'EUR']

const readString = (value: FormDataEntryValue | null) => (typeof value === 'string' ? value.trim() : '')

const parseNullableInteger = (value: string): number | null => {
  if (!value) return null
  const parsed = Number.parseInt(value, 10)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null
}

const parseNullableNumber = (value: string): number | null => {
  if (!value) return null
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

const isValidUrl = (value: string) => {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

const toLexicalRichText = (value: string): Business['description'] => {
  const lines = value
    .split('\n')
    .map((line) => line.trimEnd())
    .filter((line) => line.length > 0)

  return {
    root: {
      type: 'root',
      children: lines.map((line) => ({
        type: 'paragraph',
        children: [
          {
            type: 'text',
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text: line,
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      })),
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  }
}

type FirmUserRow = {
  payload_business_id: number
}

export const saveDashboardProfileAction = async (
  _: DashboardProfileActionState,
  formData: FormData,
): Promise<DashboardProfileActionState> => {
  const supabase = await createSupabaseServerClient()
  const { data: authData, error: authError } = await supabase.auth.getUser()

  if (authError || !authData.user) {
    return { success: false, error: 'Your session expired. Please sign in again.', message: null }
  }

  const serviceRoleClient = createSupabaseServiceRoleClient()
  const { data: firmUser, error: firmUserError } = await serviceRoleClient
    .from('firm_users')
    .select('payload_business_id')
    .eq('supabase_user_id', authData.user.id)
    .maybeSingle<FirmUserRow>()

  if (firmUserError || !firmUser?.payload_business_id) {
    return { success: false, error: 'We could not find your firm profile.', message: null }
  }

  const logo = parseNullableInteger(readString(formData.get('logoId')))
  const coverImage = parseNullableInteger(readString(formData.get('coverImageId')))
  const description = readString(formData.get('description'))
  const address = readString(formData.get('address'))
  const phone = readString(formData.get('phone'))
  const email = readString(formData.get('email')).toLowerCase()
  const website = readString(formData.get('website'))

  if (!EMAIL_PATTERN.test(email)) {
    return { success: false, error: 'Please enter a valid email address.', message: null }
  }

  if (website && !isValidUrl(website)) {
    return {
      success: false,
      error: 'Please provide a valid website URL including http:// or https://.',
      message: null,
    }
  }

  if (description.length > 800) {
    return { success: false, error: 'Introduction must be 800 characters or fewer.', message: null }
  }

  const practiceAreaIds = Array.from(
    new Set(
      formData
        .getAll('practiceAreaIds')
        .map((entry) => parseNullableInteger(readString(entry)))
        .filter((value): value is number => typeof value === 'number'),
    ),
  )

  const practiceAreaDetails: Array<{
    practiceArea: number
    description: string
    priceMin: number
  }> = []

  for (const practiceAreaId of practiceAreaIds) {
    const detailDescription = readString(formData.get(`practiceAreaDescription-${practiceAreaId}`))
    const detailPrice = parseNullableNumber(readString(formData.get(`practiceAreaPriceMin-${practiceAreaId}`)))

    if (!detailDescription) {
      return {
        success: false,
        error: 'Please describe what you offer for each selected practice area.',
        message: null,
      }
    }

    if (typeof detailPrice !== 'number' || detailPrice < 0) {
      return {
        success: false,
        error: 'Please provide a valid non-negative starting price for each selected practice area.',
        message: null,
      }
    }

    practiceAreaDetails.push({
      practiceArea: practiceAreaId,
      description: detailDescription,
      priceMin: detailPrice,
    })
  }

  const serviceRowIds = Array.from(
    new Set(formData.getAll('serviceRowIds').map((entry) => readString(entry)).filter(Boolean)),
  )

  const pendingServicePricing: Array<{
    serviceName: string
    price: number
    currency: SupportedCurrencyCode
  }> = []

  for (const rowId of serviceRowIds) {
    const serviceName = readString(formData.get(`serviceName-${rowId}`))
    const servicePrice = parseNullableNumber(readString(formData.get(`servicePrice-${rowId}`)))
    const rawCurrency = readString(formData.get(`serviceCurrency-${rowId}`)).toUpperCase()
    const currency =
      SUPPORTED_CURRENCIES.find((value) => value === rawCurrency) || ('THB' as SupportedCurrencyCode)

    // Ignore fully empty rows.
    if (!serviceName && servicePrice === null) {
      continue
    }

    if (!serviceName) {
      return { success: false, error: 'Each service row needs a service name.', message: null }
    }

    if (servicePrice === null || servicePrice < 0) {
      return {
        success: false,
        error: 'Each service row needs a valid non-negative price.',
        message: null,
      }
    }

    pendingServicePricing.push({
      serviceName,
      price: servicePrice,
      currency,
    })
  }

  const feeRangeMin = parseNullableNumber(readString(formData.get('feeRangeMin')))
  const feeRangeMax = parseNullableNumber(readString(formData.get('feeRangeMax')))
  const rawFeeCurrency = readString(formData.get('feeCurrency')).toUpperCase()
  const feeCurrency =
    SUPPORTED_CURRENCIES.find((value) => value === rawFeeCurrency) || null
  const normalizedFeeCurrency =
    feeRangeMin === null && feeRangeMax === null ? null : feeCurrency

  if (feeRangeMin !== null && feeRangeMin < 0) {
    return { success: false, error: 'Minimum fee must be zero or greater.', message: null }
  }

  if (feeRangeMax !== null && feeRangeMax < 0) {
    return { success: false, error: 'Maximum fee must be zero or greater.', message: null }
  }

  if (feeRangeMin !== null && feeRangeMax !== null && feeRangeMin > feeRangeMax) {
    return {
      success: false,
      error: 'Minimum fee cannot be greater than maximum fee.',
      message: null,
    }
  }

  try {
    const payload = await getPayload({ config })
    const currenciesResult = await payload.find({
      collection: 'currencies',
      depth: 0,
      limit: 20,
      where: {
        code: {
          in: SUPPORTED_CURRENCIES,
        },
      },
      overrideAccess: true,
    })

    const currencyIdByCode = new Map<SupportedCurrencyCode, number>()
    currenciesResult.docs.forEach((currency) => {
      const code = currency.code?.toUpperCase()
      if (SUPPORTED_CURRENCIES.includes(code as SupportedCurrencyCode)) {
        currencyIdByCode.set(code as SupportedCurrencyCode, currency.id)
      }
    })

    const servicePricing = pendingServicePricing.map((item) => ({
      serviceName: item.serviceName,
      priceMin: item.price,
      priceMax: item.price,
      currency: currencyIdByCode.get(item.currency) || null,
    }))

    const descriptionValue = description ? toLexicalRichText(description) : null

    const updateData = {
      logo,
      coverImage,
      description: descriptionValue,
      address,
      phone,
      email,
      website,
      practiceAreas: practiceAreaIds,
      practiceAreaDetails,
      servicePricing,
      feeRangeMin,
      feeRangeMax,
      feeCurrency: normalizedFeeCurrency
        ? (currencyIdByCode.get(normalizedFeeCurrency) ?? null)
        : null,
    }

    await payload.update({
      collection: 'businesses',
      id: firmUser.payload_business_id,
      depth: 0,
      overrideAccess: true,
      data: updateData,
    })

    return {
      success: true,
      error: null,
      message: 'Profile updated successfully.',
    }
  } catch (error) {
    console.error('Dashboard profile save failed:', error)
    return {
      success: false,
      error: 'Unable to save your profile right now. Please try again.',
      message: null,
    }
  }
}
