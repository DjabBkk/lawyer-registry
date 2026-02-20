export type CountrySeed = {
  name: string
  slug: string
  active: boolean
  defaultCurrencyCode: string
  defaultLanguageCode: string
  flagEmoji?: string
  seoTitleTemplate?: string
  seoDescriptionTemplate?: string
  shortDescription?: string
}

export const countries: CountrySeed[] = [
  {
    name: 'Thailand',
    slug: 'thailand',
    active: true,
    defaultCurrencyCode: 'THB',
    defaultLanguageCode: 'th',
    flagEmoji: '🇹🇭',
    seoTitleTemplate: 'Lawyers in {country} | Find Legal Help',
    seoDescriptionTemplate:
      'Browse trusted lawyers and law firms in {country}. Find legal help by city and practice area.',
    shortDescription: 'The leading legal directory for law firms and legal services in Thailand.',
  },
  {
    name: 'Hong Kong',
    slug: 'hongkong',
    active: false,
    defaultCurrencyCode: 'HKD',
    defaultLanguageCode: 'yue',
    flagEmoji: '🇭🇰',
    seoTitleTemplate: 'Lawyers in {country} | Find Legal Help',
    seoDescriptionTemplate:
      'Browse trusted lawyers and law firms in {country}. Find legal help by city and practice area.',
    shortDescription: 'Legal directory foundation for law firms and legal services in Hong Kong.',
  },
  {
    name: 'Singapore',
    slug: 'singapore',
    active: false,
    defaultCurrencyCode: 'SGD',
    defaultLanguageCode: 'en',
    flagEmoji: '🇸🇬',
    seoTitleTemplate: 'Lawyers in {country} | Find Legal Help',
    seoDescriptionTemplate:
      'Browse trusted lawyers and law firms in {country}. Find legal help by city and practice area.',
    shortDescription: 'Legal directory foundation for law firms and legal services in Singapore.',
  },
]
