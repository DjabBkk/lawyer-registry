export type SupportedCurrencyCode = 'THB' | 'USD' | 'EUR'

export type DashboardPracticeAreaOption = {
  id: number
  name: string
}

export type DashboardMediaValue = {
  id: number
  url: string | null
} | null

export type DashboardPracticeAreaDetail = {
  practiceArea: number
  description: string
  priceMin: number | null
}

export type DashboardServicePricingItem = {
  serviceName: string
  price: number | null
  currency: SupportedCurrencyCode
}

export type DashboardBusinessProfileData = {
  id: number
  name: string
  logo: DashboardMediaValue
  coverImage: DashboardMediaValue
  description: string
  address: string
  phone: string
  email: string
  website: string
  practiceAreas: number[]
  practiceAreaDetails: DashboardPracticeAreaDetail[]
  servicePricing: DashboardServicePricingItem[]
  feeRangeMin: number | null
  feeRangeMax: number | null
  feeCurrency: SupportedCurrencyCode | null
}

export type DashboardProfileActionState = {
  success: boolean
  error: string | null
  message: string | null
}

export const initialDashboardProfileActionState: DashboardProfileActionState = {
  success: false,
  error: null,
  message: null,
}
