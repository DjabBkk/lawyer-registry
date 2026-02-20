import { cache } from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'

import type { Country } from '@/payload-types'

export type SupportedCountry = {
  id: number
  slug: string
  name: string
  active: boolean
  flagEmoji?: string | null
  seoTitleTemplate?: string | null
  seoDescriptionTemplate?: string | null
  shortDescription?: string | null
  defaultCurrency?: Country['defaultCurrency']
  defaultLanguage?: Country['defaultLanguage']
}

const ACTIVE_COUNTRIES_CACHE_TTL_MS = 60_000

let activeCountriesCache:
  | {
      expiresAt: number
      countries: SupportedCountry[]
    }
  | undefined

const getPayloadClient = cache(async () => getPayload({ config }))

const toSupportedCountry = (country: Country): SupportedCountry => ({
  id: country.id,
  slug: country.slug,
  name: country.name,
  active: Boolean(country.active),
  flagEmoji: country.flagEmoji,
  seoTitleTemplate: country.seoTitleTemplate,
  seoDescriptionTemplate: country.seoDescriptionTemplate,
  shortDescription: country.shortDescription,
  defaultCurrency: country.defaultCurrency,
  defaultLanguage: country.defaultLanguage,
})

const fetchActiveCountries = async (): Promise<SupportedCountry[]> => {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'countries',
    where: {
      active: {
        equals: true,
      },
    },
    depth: 1,
    limit: 200,
    locale: 'en',
    sort: 'name',
  })

  return result.docs.map((country) => toSupportedCountry(country as Country))
}

export const getActiveCountries = async (): Promise<SupportedCountry[]> => {
  if (activeCountriesCache && activeCountriesCache.expiresAt > Date.now()) {
    return activeCountriesCache.countries
  }

  const countries = await fetchActiveCountries()
  activeCountriesCache = {
    expiresAt: Date.now() + ACTIVE_COUNTRIES_CACHE_TTL_MS,
    countries,
  }

  return countries
}

export async function getSupportedCountry(slug: string): Promise<SupportedCountry | null> {
  if (!slug) {
    return null
  }

  const countries = await getActiveCountries()
  return countries.find((country) => country.slug === slug) || null
}
