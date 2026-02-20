import type { MetadataRoute } from 'next'
import { cache } from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'

import type { Business, PracticeArea } from '@/payload-types'
import { getActiveCountries } from '@/utilities/countries'
import { getBusinessUrl } from '@/utilities/getBusinessUrl'
import { getServerSideURL } from '@/utilities/getURL'
import { getAlternateUrls } from '@/utilities/locales'

type ServiceCategoryValue = NonNullable<NonNullable<Business['serviceCategories']>[number]>

const SERVICE_CATEGORY_SLUG_BY_VALUE: Record<ServiceCategoryValue, string> = {
  legal: 'legal',
  accounting: 'accounting-services',
  'visa-services': 'visa-services',
  'company-registration': 'company-registration',
  tax: 'tax',
  audit: 'audit',
}

const getPayloadClient = cache(async () => getPayload({ config }))

async function getPublishedBusinesses(): Promise<Business[]> {
  const payload = await getPayloadClient()
  const businesses: Business[] = []
  let page = 1

  while (true) {
    const result = await payload.find({
      collection: 'businesses',
      where: {
        _status: {
          equals: 'published',
        },
      },
      depth: 0,
      limit: 200,
      page,
      sort: '-updatedAt',
      locale: 'en',
    })

    businesses.push(...(result.docs as Business[]))

    if (page >= result.totalPages) {
      break
    }

    page += 1
  }

  return businesses
}

async function getPracticeAreas(): Promise<PracticeArea[]> {
  const payload = await getPayloadClient()
  const practiceAreas: PracticeArea[] = []
  let page = 1

  while (true) {
    const result = await payload.find({
      collection: 'practice-areas',
      depth: 0,
      limit: 200,
      page,
      sort: '-updatedAt',
      locale: 'en',
    })

    practiceAreas.push(...(result.docs as PracticeArea[]))

    if (page >= result.totalPages) {
      break
    }

    page += 1
  }

  return practiceAreas
}

type EntryConfig = {
  path: string
  lastModified: Date
  changeFrequency: 'weekly' | 'monthly'
  priority: number
}

const withTrailingSlash = (path: string): string => {
  if (!path) return '/'
  if (path === '/') return path
  return path.endsWith('/') ? path : `${path}/`
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || getServerSideURL()).replace(/\/$/, '')
  const now = new Date()
  const countries = await getActiveCountries()
  const [businesses, practiceAreas] = await Promise.all([getPublishedBusinesses(), getPracticeAreas()])

  const entries: MetadataRoute.Sitemap = []
  const seenUrls = new Set<string>()
  const serviceCategoryLatestByValue = new Map<ServiceCategoryValue, Date>()

  const addLocalizedEntries = ({ path, lastModified, changeFrequency, priority }: EntryConfig) => {
    const alternateUrls = getAlternateUrls(withTrailingSlash(path))

    for (const alternateUrl of alternateUrls) {
      const url = `${siteUrl}${alternateUrl.href}`
      if (seenUrls.has(url)) {
        continue
      }

      seenUrls.add(url)
      entries.push({
        url,
        lastModified,
        changeFrequency,
        priority,
      })
    }
  }

  addLocalizedEntries({
    path: '/',
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 1,
  })

  for (const country of countries) {
    addLocalizedEntries({
      path: `/${country.slug}/lawyers`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    })

    addLocalizedEntries({
      path: `/${country.slug}/accounting`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    })
  }

  for (const practiceArea of practiceAreas) {
    if (!practiceArea.slug) continue

    const updatedAt = new Date(practiceArea.updatedAt)

    for (const country of countries) {
      addLocalizedEntries({
        path: `/${country.slug}/lawyers/${practiceArea.slug}`,
        lastModified: updatedAt,
        changeFrequency: 'monthly',
        priority: 0.8,
      })

      addLocalizedEntries({
        path: `/${country.slug}/accounting/${practiceArea.slug}`,
        lastModified: updatedAt,
        changeFrequency: 'monthly',
        priority: 0.8,
      })
    }
  }

  for (const business of businesses) {
    if (!business.slug) continue

    const updatedAt = new Date(business.updatedAt)

    for (const country of countries) {
      addLocalizedEntries({
        path: getBusinessUrl(business, country.slug),
        lastModified: updatedAt,
        changeFrequency: 'weekly',
        priority: 0.6,
      })
    }

    for (const category of business.serviceCategories || []) {
      const previous = serviceCategoryLatestByValue.get(category)
      if (!previous || updatedAt > previous) {
        serviceCategoryLatestByValue.set(category, updatedAt)
      }
    }
  }

  for (const country of countries) {
    for (const [categoryValue, categorySlug] of Object.entries(
      SERVICE_CATEGORY_SLUG_BY_VALUE,
    ) as Array<[ServiceCategoryValue, string]>) {
      addLocalizedEntries({
        path: `/${country.slug}/${categorySlug}`,
        lastModified: serviceCategoryLatestByValue.get(categoryValue) || now,
        changeFrequency: 'monthly',
        priority: 0.7,
      })
    }
  }

  return entries
}
