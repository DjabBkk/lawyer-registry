import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { ChevronRight } from 'lucide-react'
import type { Metadata } from 'next'

import { Container } from '@/components/layout/Container'
import { DarkHero } from '@/components/layout/DarkHero'
import { LawFirmGrid, FilterSidebar, Pagination, ResultsToolbar } from '@/components/law-firms'
import {
  ProfileHero,
  AboutSection,
  ServicesAndFeesSection,
  CaseHighlightsSection,
  TestimonialsSection,
  FAQSection,
  ProfileSidebar,
  MobileContactBar,
  TeamSection,
  ContactMapSection,
  AtAGlanceSection,
} from '@/components/profile'
import { LawFirmCard } from '@/components/law-firms/LawFirmCard'
import { getSupportedCountry } from '@/utilities/countries'
import type { LawFirm, Media, PracticeArea } from '@/payload-types'

type SearchParams = { [key: string]: string | string[] | undefined }

interface PageProps {
  params: Promise<{ slug: string; segments?: string[] }>
  searchParams: Promise<SearchParams>
}

const languageOptions = ['English', 'Thai', 'Chinese', 'Japanese', 'German'] as const

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

async function getPracticeAreaBySlug(slug: string) {
  try {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: 'practice-areas',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
    })
    return docs[0] || null
  } catch (error) {
    console.error(`Error fetching practice area by slug "${slug}":`, error)
    return null
  }
}

async function getLocationBySlug(slug: string) {
  try {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: 'locations',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
    })
    return docs[0] || null
  } catch (error) {
    console.error(`Error fetching location by slug "${slug}":`, error)
    return null
  }
}

async function getLawFirmBySlug(slug: string) {
  try {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: 'law-firms',
      where: {
        slug: { equals: slug },
        _status: { equals: 'published' },
      },
      limit: 1,
      depth: 2,
    })
    return docs[0] || null
  } catch (error) {
    console.error(`Error fetching law firm by slug "${slug}":`, error)
    return null
  }
}

async function getFilterOptions() {
  try {
    const payload = await getPayload({ config })

    const [practiceAreas, locations] = await Promise.all([
      payload.find({ collection: 'practice-areas', limit: 200, sort: 'name' }),
      payload.find({ collection: 'locations', limit: 200, sort: 'name' }),
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

async function getLawFirms({
  practiceAreaId,
  locationId,
  keyword,
  searchParams,
}: {
  practiceAreaId?: number
  locationId?: number
  keyword?: string
  searchParams: SearchParams
}) {
  const payload = await getPayload({ config })

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
        })
      : Promise.resolve({ docs: [] as Array<{ id: number }> }),
    selectedLocationSlugs.length
      ? payload.find({
          collection: 'locations',
          where: { slug: { in: selectedLocationSlugs } },
          limit: selectedLocationSlugs.length,
          depth: 0,
        })
      : Promise.resolve({ docs: [] as Array<{ id: number }> }),
  ])

  const whereBase: Record<string, unknown> = {}

  // Always add _status condition first
  appendAndCondition(whereBase, { _status: { equals: 'published' } })

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
            or: [{ feeRangeMin: { less_than_equal: 2000 } }, { feeRangeMax: { less_than_equal: 2000 } }],
          }
        }
        if (value === '2000-5000') {
          return {
            and: [{ feeRangeMin: { less_than_equal: 5000 } }, { feeRangeMax: { greater_than_equal: 2000 } }],
          }
        }
        if (value === '5000-10000') {
          return {
            and: [{ feeRangeMin: { less_than_equal: 10000 } }, { feeRangeMax: { greater_than_equal: 5000 } }],
          }
        }
        if (value === '10000-25000') {
          return {
            and: [{ feeRangeMin: { less_than_equal: 25000 } }, { feeRangeMax: { greater_than_equal: 10000 } }],
          }
        }
        if (value === '25000-plus') {
          return {
            or: [{ feeRangeMin: { greater_than_equal: 25000 } }, { feeRangeMax: { greater_than_equal: 25000 } }],
          }
        }
        return null
      })
      .filter(Boolean) as Record<string, unknown>[]

    if (feeConditions.length) {
      // Flatten the conditions: if we have multiple fee ranges, we want OR between them
      // Each condition is already a complete object with 'or' or 'and' keys
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
    collection: 'law-firms',
    where: whereBase as any,
    limit: 500,
    page: 1,
    depth: 0,
    sort: '-featured',
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
    collection: 'law-firms',
    where: where as any,
    limit,
    page,
    depth: 2,
    sort,
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

async function getRelatedFirms(firm: LawFirm) {
  const payload = await getPayload({ config })

  const practiceAreaIds =
    (firm.practiceAreas as PracticeArea[])
      ?.map((pa) => (typeof pa === 'object' ? pa.id : pa))
      .filter(Boolean) || []

  const locationId =
    typeof firm.primaryLocation === 'object' ? firm.primaryLocation?.id : firm.primaryLocation

  const relatedConditions: Array<Record<string, unknown>> = []

  if (locationId) {
    relatedConditions.push({ primaryLocation: { equals: locationId } })
  }
  if (practiceAreaIds.length) {
    relatedConditions.push({ practiceAreas: { in: practiceAreaIds.slice(0, 3) } })
  }
  if (!relatedConditions.length) return []

  const { docs } = await payload.find({
    collection: 'law-firms',
    where: {
      _status: { equals: 'published' },
      id: { not_equals: firm.id },
      or: relatedConditions as any,
    },
    limit: 3,
    depth: 2,
  })

  return docs
}

function slugToQuery(slug: string) {
  return slug.replace(/-lawyers?$/i, '').replace(/-/g, ' ').trim()
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug: countrySlug, segments = [] } = await params
  const country = getSupportedCountry(countrySlug)
  if (!country) return { title: 'Not Found' }

  if (segments.length === 0) {
    return {
      title: `Lawyers in ${country.name}`,
      description: `Browse law firms and lawyers in ${country.name}. Filter by location and practice area.`,
    }
  }

  if (segments.length === 1) {
    const [s1] = segments
    const [location, practiceArea, firm] = await Promise.all([
      getLocationBySlug(s1),
      getPracticeAreaBySlug(s1),
      getLawFirmBySlug(s1),
    ])

    if (location) {
      return {
        title: `Lawyers in ${location.name}, ${country.name}`,
        description: `Find law firms and lawyers in ${location.name}, ${country.name}.`,
      }
    }
    if (practiceArea) {
      return {
        title: `${practiceArea.name} Lawyers in ${country.name}`,
        description: `Find experienced ${practiceArea.name.toLowerCase()} lawyers in ${country.name}.`,
      }
    }
    if (firm) {
      const loc = typeof firm.primaryLocation === 'object' ? firm.primaryLocation : null
      const areaNames = ((firm.practiceAreas as PracticeArea[]) || [])
        .filter((area): area is PracticeArea => typeof area === 'object')
        .slice(0, 3)
        .map((area) => area.name)
      const areaSummary = areaNames.length ? `Specialties include ${areaNames.join(', ')}.` : ''
      return {
        title: firm.meta?.title || `${firm.name} | Law Firm in ${loc?.name || country.name}`,
        description:
          firm.meta?.description ||
          firm.shortDescription ||
          `${firm.name} is a law firm based in ${loc?.name || country.name}. ${areaSummary} Learn more about their services, team, fees, and client FAQs.`,
      }
    }
  }

  if (segments.length === 2) {
    const [s1, s2] = segments
    const [location, practiceArea] = await Promise.all([
      getLocationBySlug(s1),
      getPracticeAreaBySlug(s1),
    ])

    if (location) {
      const pa = await getPracticeAreaBySlug(s2)
      if (!pa) return { title: 'Not Found' }
      return {
        title: `${pa.name} Lawyers in ${location.name} | ${country.name}`,
        description: `Find ${pa.name.toLowerCase()} lawyers in ${location.name}, ${country.name}.`,
      }
    }

    if (practiceArea) {
      const q = slugToQuery(s2)
      return {
        title: `${q} | ${practiceArea.name} Lawyers in ${country.name}`,
        description: `Browse ${practiceArea.name.toLowerCase()} lawyers in ${country.name} focused on ${q}.`,
      }
    }
  }

  if (segments.length === 3) {
    const [citySlug, practiceAreaSlug, specSlug] = segments
    const [location, practiceArea] = await Promise.all([
      getLocationBySlug(citySlug),
      getPracticeAreaBySlug(practiceAreaSlug),
    ])
    if (!location || !practiceArea) return { title: 'Not Found' }

    const q = slugToQuery(specSlug)
    return {
      title: `${q} | ${practiceArea.name} Lawyers in ${location.name}`,
      description: `Browse ${practiceArea.name.toLowerCase()} lawyers in ${location.name}, ${country.name} focused on ${q}.`,
    }
  }

  return { title: 'Not Found' }
}

export default async function CountryLawyersPage({ params, searchParams }: PageProps) {
  const { slug: countrySlug, segments = [] } = await params
  const resolvedSearchParams = await searchParams

  const country = getSupportedCountry(countrySlug)
  if (!country) notFound()

  if (segments.length > 3) notFound()

  const [s1, s2, s3] = segments

  if (segments.length === 0) {
    const [{ firms, totalPages, currentPage, totalDocs, languageCounts, sortParam }, filterOptions] = await Promise.all([
      getLawFirms({ searchParams: resolvedSearchParams }),
      getFilterOptions(),
    ])

    return (
      <>
        <DarkHero
          title={`Lawyers in ${country.name}`}
          description="Browse our directory of law firms. Filter by practice area, location, and more."
          meta={`${totalDocs} law firm${totalDocs !== 1 ? 's' : ''} found`}
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Lawyers', href: '/lawyers' },
            { label: country.name },
          ]}
          className="py-16 lg:py-20"
        />

        <section className="bg-cream-100 py-12">
          <Container>
            <div className="flex flex-col gap-8 lg:flex-row">
              <div className="lg:w-72 lg:shrink-0">
                <FilterSidebar
                  practiceAreas={filterOptions.practiceAreas}
                  locations={filterOptions.locations}
                  languageCounts={languageCounts}
                  showPracticeAreas={true}
                  showLocations={true}
                />
              </div>

              <div className="flex-1">
                <ResultsToolbar
                  shown={firms.length}
                  total={totalDocs}
                  sortValue={sortParam}
                  practiceAreas={filterOptions.practiceAreas}
                  locations={filterOptions.locations}
                />

                <LawFirmGrid firms={firms as any} emptyMessage="No law firms found matching your criteria." />

                {totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination currentPage={currentPage} totalPages={totalPages} basePath={`/${country.slug}/lawyers`} />
                  </div>
                )}
              </div>
            </div>
          </Container>
        </section>
      </>
    )
  }

  if (segments.length === 1) {
    const [location, practiceArea, firm] = await Promise.all([
      getLocationBySlug(s1),
      getPracticeAreaBySlug(s1),
      getLawFirmBySlug(s1),
    ])

    if (location) {
      const [{ firms, totalPages, currentPage, totalDocs, languageCounts, sortParam }, filterOptions] = await Promise.all([
        getLawFirms({ locationId: location.id, searchParams: resolvedSearchParams }),
        getFilterOptions(),
      ])

      return (
        <>
          <DarkHero
            title={`Lawyers in ${location.name}`}
            description={`Browse law firms in ${location.name}, ${country.name}. Filter by practice area and more.`}
            meta={`${totalDocs} law firm${totalDocs !== 1 ? 's' : ''} found`}
            breadcrumbs={[
              { label: 'Home', href: '/' },
              { label: 'Lawyers', href: '/lawyers' },
              { label: country.name, href: `/${country.slug}/lawyers` },
              { label: location.name },
            ]}
          />

          <section className="py-12">
            <Container>
              <div className="flex flex-col gap-8 lg:flex-row">
                <div className="lg:w-72 lg:shrink-0">
                  <FilterSidebar
                    practiceAreas={filterOptions.practiceAreas}
                    locations={filterOptions.locations}
                    languageCounts={languageCounts}
                    showPracticeAreas={true}
                    showLocations={false}
                  />
                </div>

                <div className="flex-1">
                  <ResultsToolbar
                    shown={firms.length}
                    total={totalDocs}
                    sortValue={sortParam}
                    practiceAreas={filterOptions.practiceAreas}
                    locations={filterOptions.locations}
                  />

                  <LawFirmGrid firms={firms as any} emptyMessage={`No law firms found in ${location.name} matching your criteria.`} />

                  {totalPages > 1 && (
                    <div className="mt-8">
                      <Pagination currentPage={currentPage} totalPages={totalPages} basePath={`/${country.slug}/lawyers/${location.slug}`} />
                    </div>
                  )}
                </div>
              </div>
            </Container>
          </section>
        </>
      )
    }

    if (practiceArea) {
      const [{ firms, totalPages, currentPage, totalDocs, languageCounts, sortParam }, filterOptions] = await Promise.all([
        getLawFirms({ practiceAreaId: practiceArea.id, searchParams: resolvedSearchParams }),
        getFilterOptions(),
      ])

      return (
        <>
          <DarkHero
            title={`${practiceArea.name} Lawyers in ${country.name}`}
            description={
              practiceArea.shortDescription ||
              `Find qualified ${practiceArea.name.toLowerCase()} lawyers across ${country.name}.`
            }
            meta={`${totalDocs} law firm${totalDocs !== 1 ? 's' : ''} found`}
            breadcrumbs={[
              { label: 'Home', href: '/' },
              { label: 'Lawyers', href: '/lawyers' },
              { label: country.name, href: `/${country.slug}/lawyers` },
              { label: practiceArea.name },
            ]}
          />

          <section className="py-12">
            <Container>
              <div className="flex flex-col gap-8 lg:flex-row">
                <div className="lg:w-72 lg:shrink-0">
                  <FilterSidebar
                    practiceAreas={filterOptions.practiceAreas}
                    locations={filterOptions.locations}
                    languageCounts={languageCounts}
                    showPracticeAreas={false}
                    showLocations={true}
                  />
                </div>

                <div className="flex-1">
                  <ResultsToolbar
                    shown={firms.length}
                    total={totalDocs}
                    sortValue={sortParam}
                    practiceAreas={filterOptions.practiceAreas}
                    locations={filterOptions.locations}
                  />

                  <LawFirmGrid firms={firms as any} emptyMessage={`No ${practiceArea.name.toLowerCase()} lawyers found matching your criteria.`} />

                  {totalPages > 1 && (
                    <div className="mt-8">
                      <Pagination currentPage={currentPage} totalPages={totalPages} basePath={`/${country.slug}/lawyers/${practiceArea.slug}`} />
                    </div>
                  )}
                </div>
              </div>
            </Container>
          </section>
        </>
      )
    }

    // profile page
    if (firm) {
      const relatedFirms = await getRelatedFirms(firm)
      const practiceAreas =
        (firm.practiceAreas as PracticeArea[])?.filter((pa): pa is PracticeArea => typeof pa === 'object') || []
      const location = typeof firm.primaryLocation === 'object' ? firm.primaryLocation : null
      const coverImage = typeof firm.coverImage === 'object' ? firm.coverImage : null
      const profileImages = (firm.profileImages || []).filter(
        (item): item is Media => typeof item === 'object' && Boolean(item),
      )
      const galleryImages = [
        ...(coverImage?.url
          ? [
              {
                id: `cover-${coverImage.id || 'image'}`,
                url: coverImage.url,
                alt: `${firm.name} cover image`,
              },
            ]
          : []),
        ...profileImages
          .filter((item) => item?.url)
          .map((item, index) => ({
            id: `gallery-${item.id || index}`,
            url: item.url as string,
            alt: item.alt || `${firm.name} gallery image ${index + 1}`,
          })),
      ].filter((item, index, list) => list.findIndex((candidate) => candidate.url === item.url) === index)

      // Build breadcrumbs
      const breadcrumbs = [
        { label: 'Home', href: '/' },
        { label: 'Lawyers', href: '/lawyers' },
        { label: country.name, href: `/${country.slug}/lawyers` },
        ...(location ? [{ label: location.name, href: `/${country.slug}/lawyers/${location.slug}` }] : []),
        { label: firm.name },
      ]

      const testimonialRatings = (firm.testimonials || [])
        .map((item: any) => item?.rating)
        .filter((rating: unknown): rating is number => typeof rating === 'number' && rating >= 1 && rating <= 5)

      const aggregateRating =
        testimonialRatings.length > 0
          ? {
              '@type': 'AggregateRating',
              ratingValue:
                Math.round(
                  (testimonialRatings.reduce((sum, rating) => sum + rating, 0) /
                    testimonialRatings.length) *
                    10,
                ) / 10,
              reviewCount: testimonialRatings.length,
              bestRating: 5,
              worstRating: 1,
            }
          : undefined

      const currency = firm.feeCurrency || 'THB'
      const priceRange =
        typeof firm.feeRangeMin === 'number' && typeof firm.feeRangeMax === 'number'
          ? `${currency} ${firm.feeRangeMin}-${firm.feeRangeMax}`
          : typeof firm.feeRangeMin === 'number'
            ? `${currency} ${firm.feeRangeMin}+`
            : typeof firm.feeRangeMax === 'number'
              ? `Up to ${currency} ${firm.feeRangeMax}`
              : undefined

      const legalServiceSchema: Record<string, unknown> = {
        '@context': 'https://schema.org',
        '@type': 'LegalService',
        name: firm.name,
        description: firm.shortDescription || '',
        areaServed: country.name,
        address: {
          '@type': 'PostalAddress',
          streetAddress: firm.address || undefined,
          addressLocality: location?.name || undefined,
          addressCountry: country.name,
        },
        telephone: firm.phone,
        email: firm.email,
        url: firm.website || `/${country.slug}/lawyers/${firm.slug}`,
        knowsAbout: practiceAreas.map((area) => area.name),
      }

      if (aggregateRating) {
        legalServiceSchema.aggregateRating = aggregateRating
      }
      if (priceRange) {
        legalServiceSchema.priceRange = priceRange
      }

      const structuredData = [legalServiceSchema]

      return (
        <>
          {structuredData.map((schema, index) => (
            <script
              key={`profile-schema-${index}`}
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
            />
          ))}

          <ProfileHero firm={firm as any} breadcrumbs={breadcrumbs} practiceAreas={practiceAreas} countrySlug={country.slug} />

          <div className="bg-cream-100 pt-12 pb-12 lg:pt-14">
            <Container>
              <div className="flex flex-col gap-8 lg:flex-row">
                <div className="flex-1 min-w-0 space-y-12">
                  <AboutSection
                    firmName={firm.name}
                    description={firm.description}
                    galleryImages={galleryImages}
                  />
                  <ServicesAndFeesSection
                    practiceAreaDetails={firm.practiceAreaDetails}
                    countrySlug={country.slug}
                    practiceAreas={practiceAreas}
                    hourlyFeeMin={firm.hourlyFeeMin}
                    hourlyFeeMax={firm.hourlyFeeMax}
                    hourlyFeeCurrency={firm.hourlyFeeCurrency}
                    hourlyFeeNote={firm.hourlyFeeNote}
                  />
                  <CaseHighlightsSection caseHighlights={firm.caseHighlights} />
                  <TestimonialsSection testimonials={firm.testimonials} />
                  <TeamSection
                    teamMembers={
                      firm.teamMembers
                        ? firm.teamMembers.map((member) => ({
                            name: member.name,
                            role: member.role,
                            bio: member.bio,
                            email: member.email,
                            linkedIn: member.linkedIn,
                            photo:
                              member.photo && typeof member.photo === 'object' && 'url' in member.photo
                                ? { url: member.photo.url, alt: member.photo.alt || '' }
                                : null,
                          }))
                        : []
                    }
                  />
                  <FAQSection faq={firm.faq} />
                  <ContactMapSection firm={firm as any} />
                  <AtAGlanceSection
                    firm={firm as any}
                    practiceAreas={practiceAreas}
                    countrySlug={country.slug}
                  />
                </div>

                <div className="lg:w-[340px] lg:shrink-0">
                  <div className="lg:sticky lg:top-24">
                    <ProfileSidebar firm={firm as any} />
                  </div>
                </div>
              </div>
            </Container>
          </div>

          {relatedFirms.length > 0 && (
            <section className="py-12">
              <Container>
                <div className="mb-8 flex items-end justify-between">
                  <div>
                    <h2 className="font-heading text-2xl font-bold text-royal-900 lg:text-3xl">Related Law Firms</h2>
                    <p className="mt-2 text-royal-700/80">Other firms with similar location or practice focus</p>
                  </div>
                  <Link
                    href={`/${country.slug}/lawyers`}
                    className="hidden items-center gap-2 font-medium text-royal-700 hover:text-royal-600 sm:flex"
                  >
                    View All
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {relatedFirms.map((rf) => (
                    <LawFirmCard key={rf.id} firm={rf as any} variant="grid" />
                  ))}
                </div>
              </Container>
            </section>
          )}

          <MobileContactBar firm={firm as any} />
        </>
      )
    }

    notFound()
  }

  if (segments.length === 2) {
    const location = await getLocationBySlug(s1)
    if (location) {
      const practiceArea = await getPracticeAreaBySlug(s2)
      if (!practiceArea) notFound()

      const [{ firms, totalPages, currentPage, totalDocs, languageCounts, sortParam }] = await Promise.all([
        getLawFirms({ locationId: location.id, practiceAreaId: practiceArea.id, searchParams: resolvedSearchParams }),
      ])

      return (
        <>
          <DarkHero
            title={`${practiceArea.name} Lawyers in ${location.name}`}
            description={`Find qualified ${practiceArea.name.toLowerCase()} lawyers in ${location.name}, ${country.name}.`}
            meta={`${totalDocs} law firm${totalDocs !== 1 ? 's' : ''} found`}
            breadcrumbs={[
              { label: 'Home', href: '/' },
              { label: 'Lawyers', href: '/lawyers' },
              { label: country.name, href: `/${country.slug}/lawyers` },
              { label: location.name, href: `/${country.slug}/lawyers/${location.slug}` },
              { label: practiceArea.name },
            ]}
          />

          <section className="py-12">
            <Container>
              <div className="flex flex-col gap-8 lg:flex-row">
                <div className="lg:w-72 lg:shrink-0">
                  <FilterSidebar
                    showPracticeAreas={false}
                    showLocations={false}
                    languageCounts={languageCounts}
                  />
                </div>
                <div className="flex-1">
                  <ResultsToolbar
                    shown={firms.length}
                    total={totalDocs}
                    sortValue={sortParam}
                  />

                  <LawFirmGrid firms={firms as any} emptyMessage={`No ${practiceArea.name.toLowerCase()} lawyers found in ${location.name} matching your criteria.`} />

                  {totalPages > 1 && (
                    <div className="mt-8">
                      <Pagination currentPage={currentPage} totalPages={totalPages} basePath={`/${country.slug}/lawyers/${location.slug}/${practiceArea.slug}`} />
                    </div>
                  )}
                </div>
              </div>
            </Container>
          </section>
        </>
      )
    }

    const practiceArea = await getPracticeAreaBySlug(s1)
    if (!practiceArea) notFound()

    const q = slugToQuery(s2)
    const { firms, totalPages, currentPage, totalDocs, languageCounts, sortParam } = await getLawFirms({
      practiceAreaId: practiceArea.id,
      keyword: q,
      searchParams: resolvedSearchParams,
    })

    return (
      <>
        <DarkHero
          title={`${q} ${practiceArea.name} Lawyers in ${country.name}`}
          description={`Browse ${practiceArea.name.toLowerCase()} firms focused on ${q}.`}
          meta={`${totalDocs} law firm${totalDocs !== 1 ? 's' : ''} found`}
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Lawyers', href: '/lawyers' },
            { label: country.name, href: `/${country.slug}/lawyers` },
            { label: practiceArea.name, href: `/${country.slug}/lawyers/${practiceArea.slug}` },
            { label: q },
          ]}
        />

        <section className="py-12">
          <Container>
            <div className="flex flex-col gap-8 lg:flex-row">
              <div className="lg:w-72 lg:shrink-0">
                <FilterSidebar
                  showPracticeAreas={false}
                  showLocations={false}
                  languageCounts={languageCounts}
                />
              </div>
              <div className="flex-1">
                <ResultsToolbar
                  shown={firms.length}
                  total={totalDocs}
                  sortValue={sortParam}
                />
                <LawFirmGrid firms={firms as any} emptyMessage={`No ${practiceArea.name.toLowerCase()} firms found for "${q}".`} />
                {totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination currentPage={currentPage} totalPages={totalPages} basePath={`/${country.slug}/lawyers/${practiceArea.slug}/${s2}`} />
                  </div>
                )}
              </div>
            </div>
          </Container>
        </section>
      </>
    )
  }

  if (segments.length === 3) {
    const [location, practiceArea] = await Promise.all([
      getLocationBySlug(s1),
      getPracticeAreaBySlug(s2),
    ])
    if (!location || !practiceArea) notFound()

    const q = slugToQuery(s3)
    const { firms, totalPages, currentPage, totalDocs, languageCounts, sortParam } = await getLawFirms({
      locationId: location.id,
      practiceAreaId: practiceArea.id,
      keyword: q,
      searchParams: resolvedSearchParams,
    })

    return (
      <>
        <DarkHero
          title={`${q} ${practiceArea.name} Lawyers in ${location.name}`}
          description={`Browse ${practiceArea.name.toLowerCase()} firms in ${location.name} focused on ${q}.`}
          meta={`${totalDocs} law firm${totalDocs !== 1 ? 's' : ''} found`}
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Lawyers', href: '/lawyers' },
            { label: country.name, href: `/${country.slug}/lawyers` },
            { label: location.name, href: `/${country.slug}/lawyers/${location.slug}` },
            { label: practiceArea.name, href: `/${country.slug}/lawyers/${location.slug}/${practiceArea.slug}` },
            { label: q },
          ]}
        />

        <section className="py-12">
          <Container>
            <div className="flex flex-col gap-8 lg:flex-row">
              <div className="lg:w-72 lg:shrink-0">
                <FilterSidebar
                  showPracticeAreas={false}
                  showLocations={false}
                  languageCounts={languageCounts}
                />
              </div>
              <div className="flex-1">
                <ResultsToolbar
                  shown={firms.length}
                  total={totalDocs}
                  sortValue={sortParam}
                />
                <LawFirmGrid firms={firms as any} emptyMessage={`No firms found for "${q}" in ${location.name}.`} />
                {totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination currentPage={currentPage} totalPages={totalPages} basePath={`/${country.slug}/lawyers/${location.slug}/${practiceArea.slug}/${s3}`} />
                  </div>
                )}
              </div>
            </div>
          </Container>
        </section>
      </>
    )
  }

  notFound()
}
