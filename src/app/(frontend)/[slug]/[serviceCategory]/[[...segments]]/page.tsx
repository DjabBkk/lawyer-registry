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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug: countrySlug, serviceCategory, segments = [] } = await params
  const serviceConfig = getServiceCategoryConfig(serviceCategory)
  if (!serviceConfig) return { title: 'Not Found' }

  const country = getSupportedCountry(countrySlug)
  if (!country) return { title: 'Not Found' }

  const canonicalFor = (suffix: string = '') => `/${country.slug}/${serviceConfig.slug}${suffix}`

  if (segments.length === 0) {
    return {
      title: `${serviceConfig.label} in ${country.name}`,
      description: `Browse ${serviceConfig.label.toLowerCase()} providers in ${country.name}.`,
      alternates: { canonical: canonicalFor() },
    }
  }

  if (segments.length === 1) {
    const [s1] = segments
    const [location, practiceArea] = await Promise.all([getLocationBySlug(s1), getPracticeAreaBySlug(s1)])

    if (location) {
      return {
        title: `${serviceConfig.label} in ${location.name}, ${country.name}`,
        description: `Find ${serviceConfig.label.toLowerCase()} providers in ${location.name}, ${country.name}.`,
        alternates: { canonical: canonicalFor(`/${location.slug}`) },
      }
    }

    if (practiceArea) {
      return {
        title: `${practiceArea.name} ${serviceConfig.label} in ${country.name}`,
        description: `Find ${practiceArea.name.toLowerCase()} providers in ${country.name} offering ${serviceConfig.label.toLowerCase()}.`,
        alternates: { canonical: canonicalFor(`/${practiceArea.slug}`) },
      }
    }
  }

  if (segments.length === 2) {
    const [s1, s2] = segments
    const location = await getLocationBySlug(s1)
    if (location) {
      const practiceArea = await getPracticeAreaBySlug(s2)
      if (!practiceArea) return { title: 'Not Found' }
      return {
        title: `${practiceArea.name} ${serviceConfig.label} in ${location.name}`,
        description: `Find ${practiceArea.name.toLowerCase()} providers in ${location.name} offering ${serviceConfig.label.toLowerCase()}.`,
        alternates: { canonical: canonicalFor(`/${location.slug}/${practiceArea.slug}`) },
      }
    }

    const practiceArea = await getPracticeAreaBySlug(s1)
    if (!practiceArea) return { title: 'Not Found' }
    const q = slugToQuery(s2)

    return {
      title: `${q} ${practiceArea.name} ${serviceConfig.label} in ${country.name}`,
      description: `Browse ${practiceArea.name.toLowerCase()} providers in ${country.name} offering ${serviceConfig.label.toLowerCase()} for ${q}.`,
      alternates: { canonical: canonicalFor(`/${practiceArea.slug}/${s2}`) },
    }
  }

  if (segments.length === 3) {
    const [locationSlug, practiceAreaSlug, keywordSlug] = segments
    const [location, practiceArea] = await Promise.all([
      getLocationBySlug(locationSlug),
      getPracticeAreaBySlug(practiceAreaSlug),
    ])
    if (!location || !practiceArea) return { title: 'Not Found' }
    const q = slugToQuery(keywordSlug)

    return {
      title: `${q} ${practiceArea.name} ${serviceConfig.label} in ${location.name}`,
      description: `Browse ${practiceArea.name.toLowerCase()} providers in ${location.name} offering ${serviceConfig.label.toLowerCase()} for ${q}.`,
      alternates: { canonical: canonicalFor(`/${location.slug}/${practiceArea.slug}/${keywordSlug}`) },
    }
  }

  return { title: 'Not Found' }
}

export default async function CountryServiceCategoryPage({ params, searchParams }: PageProps) {
  const { slug: countrySlug, serviceCategory, segments = [] } = await params

  const serviceConfig = getServiceCategoryConfig(serviceCategory)
  if (!serviceConfig) {
    notFound()
  }

  const resolvedSearchParams = await searchParams
  const country = getSupportedCountry(countrySlug)
  if (!country) notFound()

  if (segments.length > 3) notFound()

  const [s1, s2, s3] = segments
  const basePath = `/${country.slug}/${serviceConfig.slug}`

  if (segments.length === 0) {
    const [{ firms, totalPages, currentPage, totalDocs, languageCounts, sortParam }, filterOptions] =
      await Promise.all([
        getBusinesses({
          searchParams: resolvedSearchParams,
          serviceCategory: serviceConfig.value,
        }),
        getFilterOptions(),
      ])

    return (
      <>
        <DarkHero
          title={`${serviceConfig.label} in ${country.name}`}
          description={`Browse providers offering ${serviceConfig.label.toLowerCase()} in ${country.name}.`}
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
      getLocationBySlug(s1),
      getPracticeAreaBySlug(s1),
      getBusinessBySlug(s1),
    ])

    if (location) {
      const [{ firms, totalPages, currentPage, totalDocs, languageCounts, sortParam }, filterOptions] =
        await Promise.all([
          getBusinesses({
            locationId: location.id,
            searchParams: resolvedSearchParams,
            serviceCategory: serviceConfig.value,
          }),
          getFilterOptions(),
        ])

      return (
        <>
          <DarkHero
            title={`${serviceConfig.label} in ${location.name}`}
            description={`Browse ${serviceConfig.label.toLowerCase()} providers in ${location.name}, ${country.name}.`}
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
          }),
          getFilterOptions(),
        ])

      return (
        <>
          <DarkHero
            title={`${practiceArea.name} ${serviceConfig.label} in ${country.name}`}
            description={`Find providers in ${country.name} offering ${serviceConfig.label.toLowerCase()} for ${practiceArea.name.toLowerCase()}.`}
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
    const location = await getLocationBySlug(s1)
    if (location) {
      const practiceArea = await getPracticeAreaBySlug(s2)
      if (!practiceArea) notFound()

      const { firms, totalPages, currentPage, totalDocs, languageCounts, sortParam } =
        await getBusinesses({
          locationId: location.id,
          practiceAreaId: practiceArea.id,
          searchParams: resolvedSearchParams,
          serviceCategory: serviceConfig.value,
        })

      return (
        <>
          <DarkHero
            title={`${practiceArea.name} ${serviceConfig.label} in ${location.name}`}
            description={`Find providers in ${location.name}, ${country.name} offering ${serviceConfig.label.toLowerCase()} for ${practiceArea.name.toLowerCase()}.`}
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

    const practiceArea = await getPracticeAreaBySlug(s1)
    if (!practiceArea) notFound()

    const q = slugToQuery(s2)
    const { firms, totalPages, currentPage, totalDocs, languageCounts, sortParam } = await getBusinesses(
      {
        practiceAreaId: practiceArea.id,
        keyword: q,
        searchParams: resolvedSearchParams,
        serviceCategory: serviceConfig.value,
      },
    )

    return (
      <>
        <DarkHero
          title={`${q} ${practiceArea.name} ${serviceConfig.label} in ${country.name}`}
          description={`Browse providers in ${country.name} offering ${serviceConfig.label.toLowerCase()} for ${practiceArea.name.toLowerCase()} and ${q}.`}
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
    const [location, practiceArea] = await Promise.all([getLocationBySlug(s1), getPracticeAreaBySlug(s2)])
    if (!location || !practiceArea) notFound()

    const q = slugToQuery(s3)
    const { firms, totalPages, currentPage, totalDocs, languageCounts, sortParam } = await getBusinesses(
      {
        locationId: location.id,
        practiceAreaId: practiceArea.id,
        keyword: q,
        searchParams: resolvedSearchParams,
        serviceCategory: serviceConfig.value,
      },
    )

    return (
      <>
        <DarkHero
          title={`${q} ${practiceArea.name} ${serviceConfig.label} in ${location.name}`}
          description={`Browse providers in ${location.name} offering ${serviceConfig.label.toLowerCase()} for ${practiceArea.name.toLowerCase()} and ${q}.`}
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
