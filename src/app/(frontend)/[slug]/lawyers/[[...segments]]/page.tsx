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
import { DEFAULT_LOCALE, getAlternateUrls, isValidLocalePrefix } from '@/utilities/locales'
import { replaceTemplateVars } from '@/utilities/templateReplace'
import type { Business, Media, PracticeArea } from '@/payload-types'

interface PageProps {
  params: Promise<{ slug: string; segments?: string[] }>
  searchParams: Promise<DirectorySearchParams>
}

const LAWYER_BUSINESS_TYPES: BusinessType[] = ['law-firm', 'lawyer']
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || '').replace(/\/$/, '')

const getPayloadClient = cache(async () => getPayload({ config }))

type ResolvedRouteContext = {
  locale: string
  countrySlug: string | undefined
  segments: string[]
}

const toAbsoluteUrl = (path: string): string => (SITE_URL ? `${SITE_URL}${path}` : path)

const resolveRouteContext = (slugOrLocale: string, rawSegments: string[] = []): ResolvedRouteContext => {
  if (isValidLocalePrefix(slugOrLocale)) {
    const [countrySlug, ...segments] = rawSegments

    return {
      locale: slugOrLocale,
      countrySlug,
      segments,
    }
  }

  return {
    locale: DEFAULT_LOCALE.code,
    countrySlug: slugOrLocale,
    segments: rawSegments,
  }
}

const buildAlternateMetadata = (pathWithoutLocale: string, locale: string): Metadata['alternates'] => {
  const alternateUrls = getAlternateUrls(pathWithoutLocale)
  const languages = alternateUrls.reduce<Record<string, string>>((acc, alternateUrl) => {
    acc[alternateUrl.hreflang] = toAbsoluteUrl(alternateUrl.href)
    return acc
  }, {})

  const defaultHref =
    alternateUrls.find((alternateUrl) => alternateUrl.hreflang === DEFAULT_LOCALE.hreflang)?.href ||
    pathWithoutLocale

  languages['x-default'] = toAbsoluteUrl(defaultHref)

  const currentHref =
    alternateUrls.find((alternateUrl) => alternateUrl.hreflang === locale)?.href || defaultHref

  return {
    canonical: toAbsoluteUrl(currentHref),
    languages,
  }
}

async function getRelatedFirms(firm: Business, locale: string) {
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
      businessType: { in: LAWYER_BUSINESS_TYPES },
      or: relatedConditions as any,
    },
    limit: 3,
    depth: 1,
    locale: locale === 'th' || locale === 'zh' ? locale : 'en',
  })

  return docs
}

function slugToQuery(slug: string) {
  return slug.replace(/-lawyers?$/i, '').replace(/-/g, ' ').trim()
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug: slugOrLocale, segments: rawSegments = [] } = await params
  const { locale, countrySlug, segments } = resolveRouteContext(slugOrLocale, rawSegments)
  if (!countrySlug) return { title: 'Not Found' }

  const country = getSupportedCountry(countrySlug)
  if (!country) return { title: 'Not Found' }

  const applyTemplate = (template: string, variables: Record<string, string | undefined> = {}) =>
    replaceTemplateVars(template, { ...variables, locale })

  const canonicalFor = (suffix: string = '') => `/${country.slug}/lawyers${suffix}`
  const withCanonical = (metadata: Metadata, suffix: string = ''): Metadata => ({
    ...metadata,
    alternates: buildAlternateMetadata(canonicalFor(suffix), locale),
  })

  if (segments.length === 0) {
    return withCanonical({
      title: applyTemplate('Lawyers in {country}', { country: country.name }),
      description: applyTemplate(
        'Browse law firms and lawyers in {country}. Filter by location and practice area.',
        { country: country.name },
      ),
    })
  }

  if (segments.length === 1) {
    const [s1] = segments
    const [location, practiceArea, firm] = await Promise.all([
      getLocationBySlug(s1, locale),
      getPracticeAreaBySlug(s1, locale),
      getBusinessBySlug(s1, { businessTypes: LAWYER_BUSINESS_TYPES, locale }),
    ])

    if (location) {
      return withCanonical({
        title: applyTemplate('Lawyers in {city}, {country}', {
          city: location.name,
          country: country.name,
        }),
        description: applyTemplate('Find law firms and lawyers in {city}, {country}.', {
          city: location.name,
          country: country.name,
        }),
      }, `/${location.slug}`)
    }
    if (practiceArea) {
      return withCanonical({
        title: applyTemplate('{practiceArea} Lawyers in {country}', {
          practiceArea: practiceArea.name,
          country: country.name,
        }),
        description: applyTemplate('Find experienced {practiceArea} lawyers in {country}.', {
          practiceArea: practiceArea.name?.toLowerCase(),
          country: country.name,
        }),
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
        title:
          (firm.meta?.title &&
            replaceTemplateVars(firm.meta.title, {
              locale,
              country: country.name,
              city: loc?.name || country.name,
              practiceArea: areaNames[0],
            })) ||
          applyTemplate('{name} | {businessType} in {city}', {
            name: firm.name,
            businessType: businessTypeLabel,
            city: loc?.name || country.name,
          }),
        description:
          (firm.meta?.description &&
            replaceTemplateVars(firm.meta.description, {
              locale,
              country: country.name,
              city: loc?.name || country.name,
              practiceArea: areaNames[0],
            })) ||
          firm.shortDescription ||
          applyTemplate(
            '{name} is a {businessType} based in {city}. {areaSummary} Learn more about their services, team, fees, and client FAQs.',
            {
              name: firm.name,
              businessType: businessTypeLabel.toLowerCase(),
              city: loc?.name || country.name,
              areaSummary,
            },
          ),
      }, `/${firm.slug}`)
    }
  }

  if (segments.length === 2) {
    const [s1, s2] = segments
    const [location, practiceArea] = await Promise.all([
      getLocationBySlug(s1, locale),
      getPracticeAreaBySlug(s1, locale),
    ])

    if (location) {
      const pa = await getPracticeAreaBySlug(s2, locale)
      if (!pa) return { title: 'Not Found' }
      return withCanonical({
        title: applyTemplate('{practiceArea} Lawyers in {city} | {country}', {
          practiceArea: pa.name,
          city: location.name,
          country: country.name,
        }),
        description: applyTemplate('Find {practiceArea} lawyers in {city}, {country}.', {
          practiceArea: pa.name?.toLowerCase(),
          city: location.name,
          country: country.name,
        }),
      }, `/${location.slug}/${pa.slug}`)
    }

    if (practiceArea) {
      const q = slugToQuery(s2)
      return withCanonical({
        title: applyTemplate('{service} | {practiceArea} Lawyers in {country}', {
          service: q,
          practiceArea: practiceArea.name,
          country: country.name,
        }),
        description: applyTemplate(
          'Browse {practiceArea} lawyers in {country} focused on {service}.',
          {
            practiceArea: practiceArea.name?.toLowerCase(),
            country: country.name,
            service: q,
          },
        ),
      }, `/${practiceArea.slug}/${s2}`)
    }
  }

  if (segments.length === 3) {
    const [citySlug, practiceAreaSlug, specSlug] = segments
    const [location, practiceArea] = await Promise.all([
      getLocationBySlug(citySlug, locale),
      getPracticeAreaBySlug(practiceAreaSlug, locale),
    ])
    if (!location || !practiceArea) return { title: 'Not Found' }

    const q = slugToQuery(specSlug)
    return withCanonical({
      title: applyTemplate('{service} | {practiceArea} Lawyers in {city}', {
        service: q,
        practiceArea: practiceArea.name,
        city: location.name,
      }),
      description: applyTemplate(
        'Browse {practiceArea} lawyers in {city}, {country} focused on {service}.',
        {
          practiceArea: practiceArea.name?.toLowerCase(),
          city: location.name,
          country: country.name,
          service: q,
        },
      ),
    }, `/${location.slug}/${practiceArea.slug}/${specSlug}`)
  }

  return { title: 'Not Found' }
}

export default async function CountryLawyersPage({ params, searchParams }: PageProps) {
  const { slug: slugOrLocale, segments: rawSegments = [] } = await params
  const { locale, countrySlug, segments } = resolveRouteContext(slugOrLocale, rawSegments)
  if (!countrySlug) notFound()

  const resolvedSearchParams = await searchParams

  const country = getSupportedCountry(countrySlug)
  if (!country) notFound()

  const applyTemplate = (template: string, variables: Record<string, string | undefined> = {}) =>
    replaceTemplateVars(template, { ...variables, locale })

  if (segments.length > 3) notFound()

  const [s1, s2, s3] = segments

  if (segments.length === 0) {
    const [{ firms, totalPages, currentPage, totalDocs, languageCounts, sortParam }, filterOptions] = await Promise.all([
      getBusinesses({
        searchParams: resolvedSearchParams,
        businessTypes: LAWYER_BUSINESS_TYPES,
        locale,
      }),
      getFilterOptions(locale),
    ])

    return (
      <>
        <DarkHero
          title={applyTemplate('Lawyers in {country}', { country: country.name })}
          description={applyTemplate(
            'Browse our directory of law firms. Filter by practice area, location, and more.',
          )}
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

                <BusinessGrid firms={firms as any} countrySlug={country.slug} emptyMessage="No law firms found matching your criteria." />

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
      getLocationBySlug(s1, locale),
      getPracticeAreaBySlug(s1, locale),
      getBusinessBySlug(s1, { businessTypes: LAWYER_BUSINESS_TYPES, locale }),
    ])

    if (location) {
      const [{ firms, totalPages, currentPage, totalDocs, languageCounts, sortParam }, filterOptions] = await Promise.all([
        getBusinesses({
          locationId: location.id,
          searchParams: resolvedSearchParams,
          businessTypes: LAWYER_BUSINESS_TYPES,
          locale,
        }),
        getFilterOptions(locale),
      ])

      return (
        <>
          <DarkHero
            title={applyTemplate('Lawyers in {city}', { city: location.name })}
            description={applyTemplate(
              'Browse law firms in {city}, {country}. Filter by practice area and more.',
              { city: location.name, country: country.name },
            )}
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

                  <BusinessGrid firms={firms as any} countrySlug={country.slug} emptyMessage={`No law firms found in ${location.name} matching your criteria.`} />

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
        getBusinesses({
          practiceAreaId: practiceArea.id,
          searchParams: resolvedSearchParams,
          businessTypes: LAWYER_BUSINESS_TYPES,
          locale,
        }),
        getFilterOptions(locale),
      ])

      return (
        <>
          <DarkHero
            title={applyTemplate('{practiceArea} Lawyers in {country}', {
              practiceArea: practiceArea.name,
              country: country.name,
            })}
            description={
              practiceArea.shortDescription ||
              applyTemplate('Find qualified {practiceArea} lawyers across {country}.', {
                practiceArea: practiceArea.name?.toLowerCase(),
                country: country.name,
              })
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

                  <BusinessGrid firms={firms as any} countrySlug={country.slug} emptyMessage={`No ${practiceArea.name.toLowerCase()} lawyers found matching your criteria.`} />

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
      const relatedFirms = await getRelatedFirms(firm, locale)
      const relatedEntityLabel = getBusinessTypeLabel(firm.businessType)
      const relatedHeading = relatedEntityLabel === 'Law Firm' ? 'Related Law Firms' : 'Related Lawyers'
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
                    href={`/${country.slug}/lawyers`}
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
    const location = await getLocationBySlug(s1, locale)
    if (location) {
      const practiceArea = await getPracticeAreaBySlug(s2, locale)
      if (!practiceArea) notFound()

      const [{ firms, totalPages, currentPage, totalDocs, languageCounts, sortParam }] = await Promise.all([
        getBusinesses({
          locationId: location.id,
          practiceAreaId: practiceArea.id,
          searchParams: resolvedSearchParams,
          businessTypes: LAWYER_BUSINESS_TYPES,
          locale,
        }),
      ])

      return (
        <>
          <DarkHero
            title={applyTemplate('{practiceArea} Lawyers in {city}', {
              practiceArea: practiceArea.name,
              city: location.name,
            })}
            description={applyTemplate(
              'Find qualified {practiceArea} lawyers in {city}, {country}.',
              {
                practiceArea: practiceArea.name?.toLowerCase(),
                city: location.name,
                country: country.name,
              },
            )}
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

                  <BusinessGrid firms={firms as any} countrySlug={country.slug} emptyMessage={`No ${practiceArea.name.toLowerCase()} lawyers found in ${location.name} matching your criteria.`} />

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

    const practiceArea = await getPracticeAreaBySlug(s1, locale)
    if (!practiceArea) notFound()

    const q = slugToQuery(s2)
    const { firms, totalPages, currentPage, totalDocs, languageCounts, sortParam } = await getBusinesses({
      practiceAreaId: practiceArea.id,
      keyword: q,
      searchParams: resolvedSearchParams,
      businessTypes: LAWYER_BUSINESS_TYPES,
      locale,
    })

    return (
      <>
        <DarkHero
          title={applyTemplate('{service} {practiceArea} Lawyers in {country}', {
            service: q,
            practiceArea: practiceArea.name,
            country: country.name,
          })}
          description={applyTemplate('Browse {practiceArea} firms focused on {service}.', {
            practiceArea: practiceArea.name?.toLowerCase(),
            service: q,
          })}
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
                <BusinessGrid firms={firms as any} countrySlug={country.slug} emptyMessage={`No ${practiceArea.name.toLowerCase()} firms found for "${q}".`} />
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
      getLocationBySlug(s1, locale),
      getPracticeAreaBySlug(s2, locale),
    ])
    if (!location || !practiceArea) notFound()

    const q = slugToQuery(s3)
    const { firms, totalPages, currentPage, totalDocs, languageCounts, sortParam } = await getBusinesses({
      locationId: location.id,
      practiceAreaId: practiceArea.id,
      keyword: q,
      searchParams: resolvedSearchParams,
      businessTypes: LAWYER_BUSINESS_TYPES,
      locale,
    })

    return (
      <>
        <DarkHero
          title={applyTemplate('{service} {practiceArea} Lawyers in {city}', {
            service: q,
            practiceArea: practiceArea.name,
            city: location.name,
          })}
          description={applyTemplate('Browse {practiceArea} firms in {city} focused on {service}.', {
            practiceArea: practiceArea.name?.toLowerCase(),
            city: location.name,
            service: q,
          })}
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
                <BusinessGrid firms={firms as any} countrySlug={country.slug} emptyMessage={`No firms found for "${q}" in ${location.name}.`} />
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
