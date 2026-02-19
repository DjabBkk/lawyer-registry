import type { Business } from '@/payload-types'

export type BusinessType = NonNullable<Business['businessType']>
export type BusinessNamespace = 'lawyers' | 'accounting'

const DEFAULT_BUSINESS_TYPE: BusinessType = 'law-firm'

export function getBusinessNamespace(businessType?: BusinessType | null): BusinessNamespace {
  if (businessType === 'accounting-firm' || businessType === 'accountant') {
    return 'accounting'
  }

  return 'lawyers'
}

export function getBusinessTypeLabel(businessType?: BusinessType | null): string {
  switch (businessType || DEFAULT_BUSINESS_TYPE) {
    case 'law-firm':
      return 'Law Firm'
    case 'lawyer':
      return 'Lawyer'
    case 'accounting-firm':
      return 'Accounting Firm'
    case 'accountant':
      return 'Accountant'
    default:
      return 'Business'
  }
}

export function getBusinessUrl(
  business: Pick<Business, 'slug' | 'businessType'>,
  countrySlug: string,
): string {
  const namespace = getBusinessNamespace(business.businessType || DEFAULT_BUSINESS_TYPE)
  return `/${countrySlug}/${namespace}/${business.slug}`
}
