import type { MetadataRoute } from 'next'
import { cache } from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'

import type { Business } from '@/payload-types'
import { SUPPORTED_COUNTRIES } from '@/utilities/countries'
import { getBusinessUrl } from '@/utilities/getBusinessUrl'
import { getServerSideURL } from '@/utilities/getURL'

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
    })

    businesses.push(...(result.docs as Business[]))

    if (page >= result.totalPages) {
      break
    }

    page += 1
  }

  return businesses
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getServerSideURL().replace(/\/$/, '')
  const countries = Object.values(SUPPORTED_COUNTRIES)
  const businesses = await getPublishedBusinesses()

  const sitemapEntries: MetadataRoute.Sitemap = []
  const seenUrls = new Set<string>()
  const serviceCategoryLatestByValue = new Map<ServiceCategoryValue, Date>()

  for (const business of businesses) {
    if (!business.slug) continue

    const updatedAt = new Date(business.updatedAt)

    for (const country of countries) {
      const url = `${siteUrl}${getBusinessUrl(business, country.slug)}`

      if (!seenUrls.has(url)) {
        seenUrls.add(url)
        sitemapEntries.push({
          url,
          lastModified: updatedAt,
        })
      }
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
      const latestUpdatedAt = serviceCategoryLatestByValue.get(categoryValue)
      if (!latestUpdatedAt) continue

      const url = `${siteUrl}/${country.slug}/${categorySlug}`

      if (!seenUrls.has(url)) {
        seenUrls.add(url)
        sitemapEntries.push({
          url,
          lastModified: latestUpdatedAt,
        })
      }
    }
  }

  return sitemapEntries
}
