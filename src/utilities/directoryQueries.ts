import { cache } from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'

import type { BusinessType } from '@/utilities/getBusinessUrl'

const languageOptions = ['English', 'Thai', 'Chinese', 'Japanese', 'German'] as const

export type DirectorySearchParams = { [key: string]: string | string[] | undefined }
export type ServiceCategory =
  | 'legal'
  | 'accounting'
  | 'visa-services'
  | 'company-registration'
  | 'tax'
  | 'audit'

const getPayloadClient = cache(async () => getPayload({ config }))

const normalizeSort = (value: string) => {
  switch (value) {
    case 'fee-asc':
      return 'feeRangeMin'
    case 'newest':
    case '-createdAt':
      return '-createdAt'
    case 'name-asc':
    case 'name':
      return 'name'
    case '-name':
      return '-name'
    default:
      return '-featured'
  }
}

const normalizeSortParamValue = (value: string) => {
  if (value === '-createdAt') return 'newest'
  if (value === 'name') return 'name-asc'
  if (value === '-name') return 'name-asc'
  if (value === 'rating-desc') return '-featured'
  return value
}

const parseListParam = (value: string | string[] | undefined) =>
  String(value || '')
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)

const appendAndCondition = (where: Record<string, unknown>, condition: Record<string, unknown>) => {
  const existing = (where.and as Record<string, unknown>[] | undefined) || []
  where.and = [...existing, condition]
}

const normalizeLocale = (locale?: string): 'en' | 'th' | 'zh' => {
  if (locale === 'en' || locale === 'th' || locale === 'zh') {
    return locale
  }

  return 'en'
}

export async function getPracticeAreaBySlug(slug: string, locale?: string) {
  try {
    const payload = await getPayloadClient()
    const queryLocale = normalizeLocale(locale)
    const { docs } = await payload.find({
      collection: 'practice-areas',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
      locale: queryLocale,
    })

    return docs[0] || null
  } catch (error) {
    console.error(`Error fetching practice area by slug "${slug}":`, error)
    return null
  }
}

export async function getLocationBySlug(slug: string, locale?: string) {
  try {
    const payload = await getPayloadClient()
    const queryLocale = normalizeLocale(locale)
    const { docs } = await payload.find({
      collection: 'locations',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
      locale: queryLocale,
    })

    return docs[0] || null
  } catch (error) {
    console.error(`Error fetching location by slug "${slug}":`, error)
    return null
  }
}

export async function getBusinessBySlug(
  slug: string,
  options: { businessTypes?: BusinessType[]; locale?: string } = {},
) {
  try {
    const payload = await getPayloadClient()
    const queryLocale = normalizeLocale(options.locale)
    const where: Record<string, unknown> = {}

    appendAndCondition(where, { slug: { equals: slug } })
    appendAndCondition(where, { _status: { equals: 'published' } })

    if (options.businessTypes?.length) {
      appendAndCondition(where, { businessType: { in: options.businessTypes } })
    }

    const { docs } = await payload.find({
      collection: 'businesses',
      where: where as any,
      limit: 1,
      depth: 1,
      locale: queryLocale,
    })

    return docs[0] || null
  } catch (error) {
    console.error(`Error fetching business by slug "${slug}":`, error)
    return null
  }
}

export async function getFilterOptions(locale?: string) {
  try {
    const payload = await getPayloadClient()
    const queryLocale = normalizeLocale(locale)

    const [practiceAreas, locations] = await Promise.all([
      payload.find({ collection: 'practice-areas', limit: 200, sort: 'name', locale: queryLocale }),
      payload.find({ collection: 'locations', limit: 200, sort: 'name', locale: queryLocale }),
    ])

    return {
      practiceAreas: practiceAreas.docs.map((pa) => ({ id: pa.id, name: pa.name, slug: pa.slug })),
      locations: locations.docs.map((l) => ({ id: l.id, name: l.name, slug: l.slug })),
    }
  } catch (error) {
    console.error('Error fetching filter options:', error)
    return {
      practiceAreas: [],
      locations: [],
    }
  }
}

export async function getBusinesses({
  practiceAreaId,
  locationId,
  keyword,
  searchParams,
  businessTypes,
  serviceCategory,
  locale,
}: {
  practiceAreaId?: number
  locationId?: number
  keyword?: string
  searchParams: DirectorySearchParams
  businessTypes?: BusinessType[]
  serviceCategory?: ServiceCategory
  locale?: string
}) {
  const payload = await getPayloadClient()
  const queryLocale = normalizeLocale(locale)

  const page = Number(searchParams.page) || 1
  const limit = 12
  const sortParam = normalizeSortParamValue(String(searchParams.sort || '-featured'))
  const sort = normalizeSort(sortParam)
  const selectedPracticeAreaSlugs = parseListParam(searchParams.practiceAreas)
  const selectedLocationSlugs = parseListParam(searchParams.locations)
  const selectedSizes = parseListParam(searchParams.size)
  const selectedLanguages = parseListParam(searchParams.languages)
  const selectedFeeRanges = parseListParam(searchParams.feeRange)
  const verifiedOnly = String(searchParams.verified || '') === 'true'
  const hasPricing = String(searchParams.hasPricing || '') === 'true'

  const [practiceAreaDocs, locationDocs] = await Promise.all([
    selectedPracticeAreaSlugs.length
      ? payload.find({
          collection: 'practice-areas',
          where: { slug: { in: selectedPracticeAreaSlugs } },
          limit: selectedPracticeAreaSlugs.length,
          depth: 0,
          locale: queryLocale,
        })
      : Promise.resolve({ docs: [] as Array<{ id: number }> }),
    selectedLocationSlugs.length
      ? payload.find({
          collection: 'locations',
          where: { slug: { in: selectedLocationSlugs } },
          limit: selectedLocationSlugs.length,
          depth: 0,
          locale: queryLocale,
        })
      : Promise.resolve({ docs: [] as Array<{ id: number }> }),
  ])

  const whereBase: Record<string, unknown> = {}

  appendAndCondition(whereBase, { _status: { equals: 'published' } })

  if (businessTypes?.length) {
    appendAndCondition(whereBase, { businessType: { in: businessTypes } })
  }

  if (serviceCategory) {
    appendAndCondition(whereBase, { serviceCategories: { contains: serviceCategory } })
  }

  if (practiceAreaId) {
    appendAndCondition(whereBase, { practiceAreas: { contains: practiceAreaId } })
  }

  if (locationId) {
    appendAndCondition(whereBase, {
      or: [{ locations: { contains: locationId } }, { primaryLocation: { equals: locationId } }],
    })
  }

  if (practiceAreaDocs.docs.length) {
    appendAndCondition(whereBase, {
      practiceAreas: { in: practiceAreaDocs.docs.map((doc) => doc.id) },
    })
  }

  if (locationDocs.docs.length) {
    const locationIds = locationDocs.docs.map((doc) => doc.id)
    appendAndCondition(whereBase, {
      or: [{ locations: { in: locationIds } }, { primaryLocation: { in: locationIds } }],
    })
  }

  if (selectedSizes.length) {
    appendAndCondition(whereBase, { companySize: { in: selectedSizes } })
  }

  if (selectedFeeRanges.length) {
    const feeConditions = selectedFeeRanges
      .map((value) => {
        if (value === 'under-2000') {
          return {
            or: [
              { feeRangeMin: { less_than_equal: 2000 } },
              { feeRangeMax: { less_than_equal: 2000 } },
            ],
          }
        }

        if (value === '2000-5000') {
          return {
            and: [
              { feeRangeMin: { less_than_equal: 5000 } },
              { feeRangeMax: { greater_than_equal: 2000 } },
            ],
          }
        }

        if (value === '5000-10000') {
          return {
            and: [
              { feeRangeMin: { less_than_equal: 10000 } },
              { feeRangeMax: { greater_than_equal: 5000 } },
            ],
          }
        }

        if (value === '10000-25000') {
          return {
            and: [
              { feeRangeMin: { less_than_equal: 25000 } },
              { feeRangeMax: { greater_than_equal: 10000 } },
            ],
          }
        }

        if (value === '25000-plus') {
          return {
            or: [
              { feeRangeMin: { greater_than_equal: 25000 } },
              { feeRangeMax: { greater_than_equal: 25000 } },
            ],
          }
        }

        return null
      })
      .filter(Boolean) as Record<string, unknown>[]

    if (feeConditions.length) {
      appendAndCondition(whereBase, { or: feeConditions })
    }
  }

  if (verifiedOnly) {
    appendAndCondition(whereBase, { verified: { equals: true } })
  }

  if (hasPricing) {
    appendAndCondition(whereBase, {
      or: [
        { feeRangeMin: { exists: true } },
        { feeRangeMax: { exists: true } },
        { hourlyFeeMin: { exists: true } },
        { hourlyFeeMax: { exists: true } },
        { practiceAreaDetails: { exists: true } },
      ],
    })
  }

  if (keyword?.trim()) {
    appendAndCondition(whereBase, {
      or: [{ name: { contains: keyword } }, { shortDescription: { contains: keyword } }],
    })
  }

  const languageCountsResult = await payload.find({
    collection: 'businesses',
    where: whereBase as any,
    limit: 500,
    page: 1,
    depth: 0,
    sort: '-featured',
    locale: queryLocale,
    select: {
      languages: true,
    } as any,
  })

  const languageCounts = languageOptions.reduce(
    (acc, language) => ({ ...acc, [language]: 0 }),
    {} as Record<string, number>,
  )

  languageCountsResult.docs.forEach((doc: any) => {
    const firmLanguages = Array.isArray(doc.languages) ? doc.languages : []
    firmLanguages.forEach((language: string) => {
      languageCounts[language] = (languageCounts[language] || 0) + 1
    })
  })

  const where: Record<string, unknown> = {
    ...whereBase,
  }

  if (selectedLanguages.length) {
    appendAndCondition(where, {
      or: selectedLanguages.map((language) => ({
        languages: { contains: language },
      })),
    })
  }

  const result = await payload.find({
    collection: 'businesses',
    where: where as any,
    limit,
    page,
    depth: 1,
    sort,
    locale: queryLocale,
  })

  return {
    firms: result.docs,
    totalPages: result.totalPages,
    currentPage: result.page || 1,
    totalDocs: result.totalDocs,
    languageCounts,
    sortParam,
  }
}
