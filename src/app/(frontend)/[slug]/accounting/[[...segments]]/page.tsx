import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { ChevronRight } from 'lucide-react'
import type { Metadata } from 'next'
import { cache } from 'react'

import { Container } from '@/components/layout/Container'
import { DarkHero } from '@/components/layout/DarkHero'
import { BusinessGrid, FilterSidebar, Pagination, ResultsToolbar } from '@/components/law-firms'
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
import { BusinessCard } from '@/components/law-firms/BusinessCard'
import { getSupportedCountry } from '@/utilities/countries'
import { getBusinessTypeLabel, getBusinessUrl, type BusinessType } from '@/utilities/getBusinessUrl'
import {
  getBusinessBySlug,
  getBusinesses,
  getFilterOptions,
  getLocationBySlug,
  getPracticeAreaBySlug,
  type DirectorySearchParams,
} from '@/utilities/directoryQueries'
import type { Business, Media, PracticeArea } from '@/payload-types'

interface PageProps {
  params: Promise<{ slug: string; segments?: string[] }>
  searchParams: Promise<DirectorySearchParams>
}

const ACCOUNTING_BUSINESS_TYPES: BusinessType[] = ['accounting-firm', 'accountant']

const getPayloadClient = cache(async () => getPayload({ config }))

async function getRelatedFirms(firm: Business) {
  const payload = await getPayloadClient()

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
    collection: 'businesses',
    where: {
      _status: { equals: 'published' },
      id: { not_equals: firm.id },
      businessType: { in: ACCOUNTING_BUSINESS_TYPES },
      or: relatedConditions as any,
    },
    limit: 3,
    depth: 1,
  })

  return docs
}

function slugToQuery(slug: string) {
  return slug.replace(/-accounting(?:-services)?$/i, '').replace(/-/g, ' ').trim()
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug: countrySlug, segments = [] } = await params
  const country = getSupportedCountry(countrySlug)
  if (!country) return { title: 'Not Found' }
  const canonicalFor = (suffix: string = '') => `/${country.slug}/accounting${suffix}`
  const withCanonical = (metadata: Metadata, suffix: string = ''): Metadata => ({
    ...metadata,
    alternates: {
      canonical: canonicalFor(suffix),
    },
  })

  if (segments.length === 0) {
    return withCanonical({
      title: `Accounting Services in ${country.name}`,
      description: `Browse accounting businesses and accounting services in ${country.name}. Filter by location and practice area.`,
    })
  }

  if (segments.length === 1) {
    const [s1] = segments
    const [location, practiceArea, firm] = await Promise.all([
      getLocationBySlug(s1),
      getPracticeAreaBySlug(s1),
      getBusinessBySlug(s1, { businessTypes: ACCOUNTING_BUSINESS_TYPES }),
    ])

    if (location) {
      return withCanonical({
        title: `Accounting Services in ${location.name}, ${country.name}`,
        description: `Find accounting businesses and accounting services in ${location.name}, ${country.name}.`,
      }, `/${location.slug}`)
    }
    if (practiceArea) {
      return withCanonical({
        title: `${practiceArea.name} Accounting Services in ${country.name}`,
        description: `Find experienced ${practiceArea.name.toLowerCase()} accounting services in ${country.name}.`,
      }, `/${practiceArea.slug}`)
    }
    if (firm) {
      const loc = typeof firm.primaryLocation === 'object' ? firm.primaryLocation : null
      const areaNames = ((firm.practiceAreas as PracticeArea[]) || [])
        .filter((area): area is PracticeArea => typeof area === 'object')
        .slice(0, 3)
        .map((area) => area.name)
      const areaSummary = areaNames.length ? `Specialties include ${areaNames.join(', ')}.` : ''
      const businessTypeLabel = getBusinessTypeLabel(firm.businessType)
      return withCanonical({
        title: firm.meta?.title || `${firm.name} | ${businessTypeLabel} in ${loc?.name || country.name}`,
        description:
          firm.meta?.description ||
          firm.shortDescription ||
          `${firm.name} is a ${businessTypeLabel.toLowerCase()} based in ${loc?.name || country.name}. ${areaSummary} Learn more about their services, team, fees, and client FAQs.`,
      }, `/${firm.slug}`)
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
      return withCanonical({
        title: `${pa.name} Accounting Services in ${location.name} | ${country.name}`,
        description: `Find ${pa.name.toLowerCase()} accounting services in ${location.name}, ${country.name}.`,
      }, `/${location.slug}/${pa.slug}`)
    }

    if (practiceArea) {
      const q = slugToQuery(s2)
      return withCanonical({
        title: `${q} | ${practiceArea.name} Accounting Services in ${country.name}`,
        description: `Browse ${practiceArea.name.toLowerCase()} accounting services in ${country.name} focused on ${q}.`,
      }, `/${practiceArea.slug}/${s2}`)
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
    return withCanonical({
      title: `${q} | ${practiceArea.name} Accounting Services in ${location.name}`,
      description: `Browse ${practiceArea.name.toLowerCase()} accounting services in ${location.name}, ${country.name} focused on ${q}.`,
    }, `/${location.slug}/${practiceArea.slug}/${specSlug}`)
  }

  return { title: 'Not Found' }
}

export default async function CountryAccountingPage({ params, searchParams }: PageProps) {
  const { slug: countrySlug, segments = [] } = await params
  const resolvedSearchParams = await searchParams

  const country = getSupportedCountry(countrySlug)
  if (!country) notFound()

  if (segments.length > 3) notFound()

  const [s1, s2, s3] = segments

  if (segments.length === 0) {
    const [{ firms, totalPages, currentPage, totalDocs, languageCounts, sortParam }, filterOptions] = await Promise.all([
      getBusinesses({ searchParams: resolvedSearchParams, businessTypes: ACCOUNTING_BUSINESS_TYPES }),
      getFilterOptions(),
    ])

    return (
      <>
        <DarkHero
          title={`Accounting Services in ${country.name}`}
          description="Browse our directory of accounting businesses. Filter by practice area, location, and more."
          meta={`${totalDocs} accounting provider${totalDocs !== 1 ? 's' : ''} found`}
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Accounting Services', href: '/accounting' },
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

                <BusinessGrid firms={firms as any} countrySlug={country.slug} emptyMessage="No accounting businesses found matching your criteria." />

                {totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination currentPage={currentPage} totalPages={totalPages} basePath={`/${country.slug}/accounting`} />
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
      getBusinessBySlug(s1, { businessTypes: ACCOUNTING_BUSINESS_TYPES }),
    ])

    if (location) {
      const [{ firms, totalPages, currentPage, totalDocs, languageCounts, sortParam }, filterOptions] = await Promise.all([
        getBusinesses({
          locationId: location.id,
          searchParams: resolvedSearchParams,
          businessTypes: ACCOUNTING_BUSINESS_TYPES,
        }),
        getFilterOptions(),
      ])

      return (
        <>
          <DarkHero
            title={`Accounting Services in ${location.name}`}
            description={`Browse accounting businesses in ${location.name}, ${country.name}. Filter by practice area and more.`}
            meta={`${totalDocs} accounting provider${totalDocs !== 1 ? 's' : ''} found`}
            breadcrumbs={[
              { label: 'Home', href: '/' },
              { label: 'Accounting Services', href: '/accounting' },
              { label: country.name, href: `/${country.slug}/accounting` },
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
                    showPracticeAreas={false}
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

                  <BusinessGrid firms={firms as any} countrySlug={country.slug} emptyMessage={`No accounting businesses found in ${location.name} matching your criteria.`} />

                  {totalPages > 1 && (
                    <div className="mt-8">
                      <Pagination currentPage={currentPage} totalPages={totalPages} basePath={`/${country.slug}/accounting/${location.slug}`} />
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
        getBusinesses({
          practiceAreaId: practiceArea.id,
          searchParams: resolvedSearchParams,
          businessTypes: ACCOUNTING_BUSINESS_TYPES,
        }),
        getFilterOptions(),
      ])

      return (
        <>
          <DarkHero
            title={`${practiceArea.name} Accounting Services in ${country.name}`}
            description={
              practiceArea.shortDescription ||
              `Find qualified ${practiceArea.name.toLowerCase()} accounting services across ${country.name}.`
            }
            meta={`${totalDocs} accounting provider${totalDocs !== 1 ? 's' : ''} found`}
            breadcrumbs={[
              { label: 'Home', href: '/' },
              { label: 'Accounting Services', href: '/accounting' },
              { label: country.name, href: `/${country.slug}/accounting` },
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

                  <BusinessGrid firms={firms as any} countrySlug={country.slug} emptyMessage={`No ${practiceArea.name.toLowerCase()} accounting services found matching your criteria.`} />

                  {totalPages > 1 && (
                    <div className="mt-8">
                      <Pagination currentPage={currentPage} totalPages={totalPages} basePath={`/${country.slug}/accounting/${practiceArea.slug}`} />
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
      const relatedEntityLabel = getBusinessTypeLabel(firm.businessType)
      const relatedHeading =
        relatedEntityLabel === 'Accounting Firm' ? 'Related Accounting Firms' : 'Related Accountants'
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
        { label: 'Accounting Services', href: '/accounting' },
        { label: country.name, href: `/${country.slug}/accounting` },
        ...(location ? [{ label: location.name, href: `/${country.slug}/accounting/${location.slug}` }] : []),
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
        url: firm.website || getBusinessUrl(firm, country.slug),
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
                  <TeamSection teamMembers={(firm.teamMembers || []) as any} />
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
                    <h2 className="font-heading text-2xl font-bold text-royal-900 lg:text-3xl">{relatedHeading}</h2>
                    <p className="mt-2 text-royal-700/80">Other firms with similar location or practice focus</p>
                  </div>
                  <Link
                    href={`/${country.slug}/accounting`}
                    className="hidden items-center gap-2 font-medium text-royal-700 hover:text-royal-600 sm:flex"
                  >
                    View All
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {relatedFirms.map((rf) => (
                    <BusinessCard key={rf.id} firm={rf as any} countrySlug={country.slug} variant="grid" />
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
        getBusinesses({
          locationId: location.id,
          practiceAreaId: practiceArea.id,
          searchParams: resolvedSearchParams,
          businessTypes: ACCOUNTING_BUSINESS_TYPES,
        }),
      ])

      return (
        <>
          <DarkHero
            title={`${practiceArea.name} Accounting Services in ${location.name}`}
            description={`Find qualified ${practiceArea.name.toLowerCase()} accounting services in ${location.name}, ${country.name}.`}
            meta={`${totalDocs} accounting provider${totalDocs !== 1 ? 's' : ''} found`}
            breadcrumbs={[
              { label: 'Home', href: '/' },
              { label: 'Accounting Services', href: '/accounting' },
              { label: country.name, href: `/${country.slug}/accounting` },
              { label: location.name, href: `/${country.slug}/accounting/${location.slug}` },
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

                  <BusinessGrid firms={firms as any} countrySlug={country.slug} emptyMessage={`No ${practiceArea.name.toLowerCase()} accounting services found in ${location.name} matching your criteria.`} />

                  {totalPages > 1 && (
                    <div className="mt-8">
                      <Pagination currentPage={currentPage} totalPages={totalPages} basePath={`/${country.slug}/accounting/${location.slug}/${practiceArea.slug}`} />
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
    const { firms, totalPages, currentPage, totalDocs, languageCounts, sortParam } = await getBusinesses({
      practiceAreaId: practiceArea.id,
      keyword: q,
      searchParams: resolvedSearchParams,
      businessTypes: ACCOUNTING_BUSINESS_TYPES,
    })

    return (
      <>
        <DarkHero
          title={`${q} ${practiceArea.name} Accounting Services in ${country.name}`}
          description={`Browse ${practiceArea.name.toLowerCase()} firms focused on ${q}.`}
          meta={`${totalDocs} accounting provider${totalDocs !== 1 ? 's' : ''} found`}
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Accounting Services', href: '/accounting' },
            { label: country.name, href: `/${country.slug}/accounting` },
            { label: practiceArea.name, href: `/${country.slug}/accounting/${practiceArea.slug}` },
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
                <BusinessGrid firms={firms as any} countrySlug={country.slug} emptyMessage={`No ${practiceArea.name.toLowerCase()} firms found for "${q}".`} />
                {totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination currentPage={currentPage} totalPages={totalPages} basePath={`/${country.slug}/accounting/${practiceArea.slug}/${s2}`} />
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
    const { firms, totalPages, currentPage, totalDocs, languageCounts, sortParam } = await getBusinesses({
      locationId: location.id,
      practiceAreaId: practiceArea.id,
      keyword: q,
      searchParams: resolvedSearchParams,
      businessTypes: ACCOUNTING_BUSINESS_TYPES,
    })

    return (
      <>
        <DarkHero
          title={`${q} ${practiceArea.name} Accounting Services in ${location.name}`}
          description={`Browse ${practiceArea.name.toLowerCase()} firms in ${location.name} focused on ${q}.`}
          meta={`${totalDocs} accounting provider${totalDocs !== 1 ? 's' : ''} found`}
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Accounting Services', href: '/accounting' },
            { label: country.name, href: `/${country.slug}/accounting` },
            { label: location.name, href: `/${country.slug}/accounting/${location.slug}` },
            { label: practiceArea.name, href: `/${country.slug}/accounting/${location.slug}/${practiceArea.slug}` },
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
                <BusinessGrid firms={firms as any} countrySlug={country.slug} emptyMessage={`No firms found for "${q}" in ${location.name}.`} />
                {totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination currentPage={currentPage} totalPages={totalPages} basePath={`/${country.slug}/accounting/${location.slug}/${practiceArea.slug}/${s3}`} />
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
