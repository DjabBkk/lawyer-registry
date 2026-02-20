import { notFound, redirect } from 'next/navigation'
import type { Metadata } from 'next'

import { Container } from '@/components/layout/Container'
import { DarkHero } from '@/components/layout/DarkHero'
import { BusinessGrid, FilterSidebar, Pagination, ResultsToolbar } from '@/components/law-firms'
import { getSupportedCountry } from '@/utilities/countries'
import {
  getBusinessBySlug,
  getBusinesses,
  getFilterOptions,
  getLocationBySlug,
  getPracticeAreaBySlug,
  type DirectorySearchParams,
  type ServiceCategory,
} from '@/utilities/directoryQueries'
import { getBusinessUrl } from '@/utilities/getBusinessUrl'
import { DEFAULT_LOCALE, getAlternateUrls, isValidLocalePrefix } from '@/utilities/locales'
import { replaceTemplateVars } from '@/utilities/templateReplace'

type ServiceCategorySlug =
  | 'visa-services'
  | 'company-registration'
  | 'tax'
  | 'audit'
  | 'legal'
  | 'accounting-services'

const SERVICE_CATEGORY_CONFIG: Record<
  ServiceCategorySlug,
  { label: string; value: ServiceCategory }
> = {
  'visa-services': {
    label: 'Visa Services',
    value: 'visa-services',
  },
  'company-registration': {
    label: 'Company Registration',
    value: 'company-registration',
  },
  tax: {
    label: 'Tax Services',
    value: 'tax',
  },
  audit: {
    label: 'Audit and Assurance',
    value: 'audit',
  },
  legal: {
    label: 'Legal Services',
    value: 'legal',
  },
  'accounting-services': {
    label: 'Accounting Services',
    value: 'accounting',
  },
}
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || '').replace(/\/$/, '')

interface PageProps {
  params: Promise<{ slug: string; serviceCategory: string; segments?: string[] }>
  searchParams: Promise<DirectorySearchParams>
}

function getServiceCategoryConfig(
  serviceCategory: string,
): { slug: ServiceCategorySlug; label: string; value: ServiceCategory } | null {
  if (!(serviceCategory in SERVICE_CATEGORY_CONFIG)) return null

  const slug = serviceCategory as ServiceCategorySlug
  const config = SERVICE_CATEGORY_CONFIG[slug]
  return {
    slug,
    label: config.label,
    value: config.value,
  }
}

function slugToQuery(slug: string) {
  return slug.replace(/-services?$/i, '').replace(/-/g, ' ').trim()
}

type ResolvedRouteContext = {
  locale: string
  countrySlug: string | undefined
  serviceCategory: string | undefined
  segments: string[]
}

const toAbsoluteUrl = (path: string): string => (SITE_URL ? `${SITE_URL}${path}` : path)

const resolveRouteContext = (
  slugOrLocale: string,
  serviceCategoryOrCountry: string,
  rawSegments: string[] = [],
): ResolvedRouteContext => {
  if (isValidLocalePrefix(slugOrLocale)) {
    const [serviceCategory, ...segments] = rawSegments

    return {
      locale: slugOrLocale,
      countrySlug: serviceCategoryOrCountry,
      serviceCategory,
      segments,
    }
  }

  return {
    locale: DEFAULT_LOCALE.code,
    countrySlug: slugOrLocale,
    serviceCategory: serviceCategoryOrCountry,
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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug: slugOrLocale, serviceCategory: serviceCategoryOrCountry, segments: rawSegments = [] } =
    await params
  const { locale, countrySlug, serviceCategory, segments } = resolveRouteContext(
    slugOrLocale,
    serviceCategoryOrCountry,
    rawSegments,
  )
  if (!countrySlug || !serviceCategory) return { title: 'Not Found' }

  const serviceConfig = getServiceCategoryConfig(serviceCategory)
  if (!serviceConfig) return { title: 'Not Found' }

  const country = await getSupportedCountry(countrySlug)
  if (!country) return { title: 'Not Found' }

  const applyTemplate = (template: string, variables: Record<string, string | undefined> = {}) =>
    replaceTemplateVars(template, { ...variables, locale })

  const canonicalFor = (suffix: string = '') => `/${country.slug}/${serviceConfig.slug}${suffix}`
  const withCanonical = (metadata: Metadata, suffix: string = ''): Metadata => ({
    ...metadata,
    alternates: buildAlternateMetadata(canonicalFor(suffix), locale),
  })

  if (segments.length === 0) {
    return withCanonical({
      title: applyTemplate('{service} in {country}', {
        service: serviceConfig.label,
        country: country.name,
      }),
      description: applyTemplate('Browse {service} providers in {country}.', {
        service: serviceConfig.label.toLowerCase(),
        country: country.name,
      }),
    })
  }

  if (segments.length === 1) {
    const [s1] = segments
    const [location, practiceArea] = await Promise.all([
      getLocationBySlug(s1, locale),
      getPracticeAreaBySlug(s1, locale),
    ])

    if (location) {
      return withCanonical({
        title: applyTemplate('{service} in {city}, {country}', {
          service: serviceConfig.label,
          city: location.name,
          country: country.name,
        }),
        description: applyTemplate('Find {service} providers in {city}, {country}.', {
          service: serviceConfig.label.toLowerCase(),
          city: location.name,
          country: country.name,
        }),
      }, `/${location.slug}`)
    }

    if (practiceArea) {
      return withCanonical({
        title: applyTemplate('{practiceArea} {service} in {country}', {
          practiceArea: practiceArea.name,
          service: serviceConfig.label,
          country: country.name,
        }),
        description: applyTemplate(
          'Find {practiceArea} providers in {country} offering {service}.',
          {
            practiceArea: practiceArea.name?.toLowerCase(),
            country: country.name,
            service: serviceConfig.label.toLowerCase(),
          },
        ),
      }, `/${practiceArea.slug}`)
    }
  }

  if (segments.length === 2) {
    const [s1, s2] = segments
    const location = await getLocationBySlug(s1, locale)
    if (location) {
      const practiceArea = await getPracticeAreaBySlug(s2, locale)
      if (!practiceArea) return { title: 'Not Found' }
      return withCanonical({
        title: applyTemplate('{practiceArea} {service} in {city}', {
          practiceArea: practiceArea.name,
          service: serviceConfig.label,
          city: location.name,
        }),
        description: applyTemplate(
          'Find {practiceArea} providers in {city} offering {service}.',
          {
            practiceArea: practiceArea.name?.toLowerCase(),
            city: location.name,
            service: serviceConfig.label.toLowerCase(),
          },
        ),
      }, `/${location.slug}/${practiceArea.slug}`)
    }

    const practiceArea = await getPracticeAreaBySlug(s1, locale)
    if (!practiceArea) return { title: 'Not Found' }
    const q = slugToQuery(s2)

    return withCanonical({
      title: applyTemplate('{service} {practiceArea} {category} in {country}', {
        service: q,
        practiceArea: practiceArea.name,
        category: serviceConfig.label,
        country: country.name,
      }),
      description: applyTemplate(
        'Browse {practiceArea} providers in {country} offering {category} for {service}.',
        {
          practiceArea: practiceArea.name?.toLowerCase(),
          country: country.name,
          category: serviceConfig.label.toLowerCase(),
          service: q,
        },
      ),
    }, `/${practiceArea.slug}/${s2}`)
  }

  if (segments.length === 3) {
    const [locationSlug, practiceAreaSlug, keywordSlug] = segments
    const [location, practiceArea] = await Promise.all([
      getLocationBySlug(locationSlug, locale),
      getPracticeAreaBySlug(practiceAreaSlug, locale),
    ])
    if (!location || !practiceArea) return { title: 'Not Found' }
    const q = slugToQuery(keywordSlug)

    return withCanonical({
      title: applyTemplate('{service} {practiceArea} {category} in {city}', {
        service: q,
        practiceArea: practiceArea.name,
        category: serviceConfig.label,
        city: location.name,
      }),
      description: applyTemplate(
        'Browse {practiceArea} providers in {city} offering {category} for {service}.',
        {
          practiceArea: practiceArea.name?.toLowerCase(),
          city: location.name,
          category: serviceConfig.label.toLowerCase(),
          service: q,
        },
      ),
    }, `/${location.slug}/${practiceArea.slug}/${keywordSlug}`)
  }

  return { title: 'Not Found' }
}

export default async function CountryServiceCategoryPage({ params, searchParams }: PageProps) {
  const { slug: slugOrLocale, serviceCategory: serviceCategoryOrCountry, segments: rawSegments = [] } =
    await params
  const { locale, countrySlug, serviceCategory, segments } = resolveRouteContext(
    slugOrLocale,
    serviceCategoryOrCountry,
    rawSegments,
  )
  if (!countrySlug || !serviceCategory) notFound()

  const serviceConfig = getServiceCategoryConfig(serviceCategory)
  if (!serviceConfig) {
    notFound()
  }

  const resolvedSearchParams = await searchParams
  const country = await getSupportedCountry(countrySlug)
  if (!country) notFound()

  const applyTemplate = (template: string, variables: Record<string, string | undefined> = {}) =>
    replaceTemplateVars(template, { ...variables, locale })

  if (segments.length > 3) notFound()

  const [s1, s2, s3] = segments
  const basePath = `/${country.slug}/${serviceConfig.slug}`

  if (segments.length === 0) {
    const [{ firms, totalPages, currentPage, totalDocs, languageCounts, sortParam }, filterOptions] =
      await Promise.all([
        getBusinesses({
          searchParams: resolvedSearchParams,
          serviceCategory: serviceConfig.value,
          locale,
        }),
        getFilterOptions(locale),
      ])

    return (
      <>
        <DarkHero
          title={applyTemplate('{service} in {country}', {
            service: serviceConfig.label,
            country: country.name,
          })}
          description={applyTemplate('Browse providers offering {service} in {country}.', {
            service: serviceConfig.label.toLowerCase(),
            country: country.name,
          })}
          meta={`${totalDocs} provider${totalDocs !== 1 ? 's' : ''} found`}
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: serviceConfig.label, href: `/${serviceConfig.slug}` },
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

                <BusinessGrid
                  firms={firms as any}
                  countrySlug={country.slug}
                  emptyMessage={`No providers found for ${serviceConfig.label.toLowerCase()}.`}
                />

                {totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination currentPage={currentPage} totalPages={totalPages} basePath={basePath} />
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
    const [location, practiceArea, business] = await Promise.all([
      getLocationBySlug(s1, locale),
      getPracticeAreaBySlug(s1, locale),
      getBusinessBySlug(s1, { locale }),
    ])

    if (location) {
      const [{ firms, totalPages, currentPage, totalDocs, languageCounts, sortParam }, filterOptions] =
        await Promise.all([
          getBusinesses({
            locationId: location.id,
            searchParams: resolvedSearchParams,
            serviceCategory: serviceConfig.value,
            locale,
          }),
          getFilterOptions(locale),
        ])

      return (
        <>
          <DarkHero
            title={applyTemplate('{service} in {city}', {
              service: serviceConfig.label,
              city: location.name,
            })}
            description={applyTemplate(
              'Browse {service} providers in {city}, {country}.',
              {
                service: serviceConfig.label.toLowerCase(),
                city: location.name,
                country: country.name,
              },
            )}
            meta={`${totalDocs} provider${totalDocs !== 1 ? 's' : ''} found`}
            breadcrumbs={[
              { label: 'Home', href: '/' },
              { label: serviceConfig.label, href: `/${serviceConfig.slug}` },
              { label: country.name, href: basePath },
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

                  <BusinessGrid
                    firms={firms as any}
                    countrySlug={country.slug}
                    emptyMessage={`No providers found in ${location.name} for ${serviceConfig.label.toLowerCase()}.`}
                  />

                  {totalPages > 1 && (
                    <div className="mt-8">
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        basePath={`${basePath}/${location.slug}`}
                      />
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
      const [{ firms, totalPages, currentPage, totalDocs, languageCounts, sortParam }, filterOptions] =
        await Promise.all([
          getBusinesses({
            practiceAreaId: practiceArea.id,
            searchParams: resolvedSearchParams,
            serviceCategory: serviceConfig.value,
            locale,
          }),
          getFilterOptions(locale),
        ])

      return (
        <>
          <DarkHero
            title={applyTemplate('{practiceArea} {service} in {country}', {
              practiceArea: practiceArea.name,
              service: serviceConfig.label,
              country: country.name,
            })}
            description={applyTemplate(
              'Find providers in {country} offering {service} for {practiceArea}.',
              {
                country: country.name,
                service: serviceConfig.label.toLowerCase(),
                practiceArea: practiceArea.name.toLowerCase(),
              },
            )}
            meta={`${totalDocs} provider${totalDocs !== 1 ? 's' : ''} found`}
            breadcrumbs={[
              { label: 'Home', href: '/' },
              { label: serviceConfig.label, href: `/${serviceConfig.slug}` },
              { label: country.name, href: basePath },
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

                  <BusinessGrid
                    firms={firms as any}
                    countrySlug={country.slug}
                    emptyMessage={`No providers found for ${practiceArea.name.toLowerCase()} under ${serviceConfig.label.toLowerCase()}.`}
                  />

                  {totalPages > 1 && (
                    <div className="mt-8">
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        basePath={`${basePath}/${practiceArea.slug}`}
                      />
                    </div>
                  )}
                </div>
              </div>
            </Container>
          </section>
        </>
      )
    }

    if (business) {
      redirect(getBusinessUrl(business, country.slug))
    }

    notFound()
  }

  if (segments.length === 2) {
    const location = await getLocationBySlug(s1, locale)
    if (location) {
      const practiceArea = await getPracticeAreaBySlug(s2, locale)
      if (!practiceArea) notFound()

      const { firms, totalPages, currentPage, totalDocs, languageCounts, sortParam } =
        await getBusinesses({
          locationId: location.id,
          practiceAreaId: practiceArea.id,
          searchParams: resolvedSearchParams,
          serviceCategory: serviceConfig.value,
          locale,
        })

      return (
        <>
          <DarkHero
            title={applyTemplate('{practiceArea} {service} in {city}', {
              practiceArea: practiceArea.name,
              service: serviceConfig.label,
              city: location.name,
            })}
            description={applyTemplate(
              'Find providers in {city}, {country} offering {service} for {practiceArea}.',
              {
                city: location.name,
                country: country.name,
                service: serviceConfig.label.toLowerCase(),
                practiceArea: practiceArea.name.toLowerCase(),
              },
            )}
            meta={`${totalDocs} provider${totalDocs !== 1 ? 's' : ''} found`}
            breadcrumbs={[
              { label: 'Home', href: '/' },
              { label: serviceConfig.label, href: `/${serviceConfig.slug}` },
              { label: country.name, href: basePath },
              { label: location.name, href: `${basePath}/${location.slug}` },
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
                  <ResultsToolbar shown={firms.length} total={totalDocs} sortValue={sortParam} />

                  <BusinessGrid
                    firms={firms as any}
                    countrySlug={country.slug}
                    emptyMessage={`No providers found for ${practiceArea.name.toLowerCase()} in ${location.name}.`}
                  />

                  {totalPages > 1 && (
                    <div className="mt-8">
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        basePath={`${basePath}/${location.slug}/${practiceArea.slug}`}
                      />
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
    const { firms, totalPages, currentPage, totalDocs, languageCounts, sortParam } = await getBusinesses(
      {
        practiceAreaId: practiceArea.id,
        keyword: q,
        searchParams: resolvedSearchParams,
        serviceCategory: serviceConfig.value,
        locale,
      },
    )

    return (
      <>
        <DarkHero
          title={applyTemplate('{service} {practiceArea} {category} in {country}', {
            service: q,
            practiceArea: practiceArea.name,
            category: serviceConfig.label,
            country: country.name,
          })}
          description={applyTemplate(
            'Browse providers in {country} offering {category} for {practiceArea} and {service}.',
            {
              country: country.name,
              category: serviceConfig.label.toLowerCase(),
              practiceArea: practiceArea.name.toLowerCase(),
              service: q,
            },
          )}
          meta={`${totalDocs} provider${totalDocs !== 1 ? 's' : ''} found`}
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: serviceConfig.label, href: `/${serviceConfig.slug}` },
            { label: country.name, href: basePath },
            { label: practiceArea.name, href: `${basePath}/${practiceArea.slug}` },
            { label: q },
          ]}
        />

        <section className="py-12">
          <Container>
            <div className="flex flex-col gap-8 lg:flex-row">
              <div className="lg:w-72 lg:shrink-0">
                <FilterSidebar showPracticeAreas={false} showLocations={false} languageCounts={languageCounts} />
              </div>
              <div className="flex-1">
                <ResultsToolbar shown={firms.length} total={totalDocs} sortValue={sortParam} />
                <BusinessGrid
                  firms={firms as any}
                  countrySlug={country.slug}
                  emptyMessage={`No providers found for "${q}".`}
                />
                {totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      basePath={`${basePath}/${practiceArea.slug}/${s2}`}
                    />
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
    const { firms, totalPages, currentPage, totalDocs, languageCounts, sortParam } = await getBusinesses(
      {
        locationId: location.id,
        practiceAreaId: practiceArea.id,
        keyword: q,
        searchParams: resolvedSearchParams,
        serviceCategory: serviceConfig.value,
        locale,
      },
    )

    return (
      <>
        <DarkHero
          title={applyTemplate('{service} {practiceArea} {category} in {city}', {
            service: q,
            practiceArea: practiceArea.name,
            category: serviceConfig.label,
            city: location.name,
          })}
          description={applyTemplate(
            'Browse providers in {city} offering {category} for {practiceArea} and {service}.',
            {
              city: location.name,
              category: serviceConfig.label.toLowerCase(),
              practiceArea: practiceArea.name.toLowerCase(),
              service: q,
            },
          )}
          meta={`${totalDocs} provider${totalDocs !== 1 ? 's' : ''} found`}
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: serviceConfig.label, href: `/${serviceConfig.slug}` },
            { label: country.name, href: basePath },
            { label: location.name, href: `${basePath}/${location.slug}` },
            { label: practiceArea.name, href: `${basePath}/${location.slug}/${practiceArea.slug}` },
            { label: q },
          ]}
        />

        <section className="py-12">
          <Container>
            <div className="flex flex-col gap-8 lg:flex-row">
              <div className="lg:w-72 lg:shrink-0">
                <FilterSidebar showPracticeAreas={false} showLocations={false} languageCounts={languageCounts} />
              </div>
              <div className="flex-1">
                <ResultsToolbar shown={firms.length} total={totalDocs} sortValue={sortParam} />
                <BusinessGrid
                  firms={firms as any}
                  countrySlug={country.slug}
                  emptyMessage={`No providers found for "${q}" in ${location.name}.`}
                />
                {totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      basePath={`${basePath}/${location.slug}/${practiceArea.slug}/${s3}`}
                    />
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
