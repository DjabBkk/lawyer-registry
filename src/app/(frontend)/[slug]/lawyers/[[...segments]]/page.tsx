import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { ChevronRight } from 'lucide-react'
import type { Metadata } from 'next'

import { Container } from '@/components/layout/Container'
import { DarkHero } from '@/components/layout/DarkHero'
import { LawFirmGrid, FilterSidebar, Pagination, ResultsToolbar } from '@/components/law-firms'
import { ProfileHero, TeamSection, ContactSection } from '@/components/profile'
import { LawFirmCard } from '@/components/law-firms/LawFirmCard'
import { getSupportedCountry } from '@/utilities/countries'
import type { LawFirm, PracticeArea } from '@/payload-types'

type SearchParams = { [key: string]: string | string[] | undefined }

interface PageProps {
  params: Promise<{ slug: string; segments?: string[] }>
  searchParams: Promise<SearchParams>
}

async function getPracticeAreaBySlug(slug: string) {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'practice-areas',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
  })
  return docs[0] || null
}

async function getLocationBySlug(slug: string) {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'locations',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
  })
  return docs[0] || null
}

async function getLawFirmBySlug(slug: string) {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'law-firms',
    where: {
      slug: { equals: slug },
      _status: { equals: 'published' },
    },
    limit: 1,
    depth: 3,
  })
  return docs[0] || null
}

async function getFilterOptions() {
  const payload = await getPayload({ config })

  const [practiceAreas, locations] = await Promise.all([
    payload.find({ collection: 'practice-areas', limit: 200, sort: 'name' }),
    payload.find({ collection: 'locations', limit: 200, sort: 'name' }),
  ])

  return {
    practiceAreas: practiceAreas.docs.map((pa) => ({ id: pa.id, name: pa.name, slug: pa.slug })),
    locations: locations.docs.map((l) => ({ id: l.id, name: l.name, slug: l.slug })),
  }
}

async function getLawFirms({
  practiceAreaId,
  locationId,
  searchParams,
}: {
  practiceAreaId?: number
  locationId?: number
  searchParams: SearchParams
}) {
  const payload = await getPayload({ config })

  const page = Number(searchParams.page) || 1
  const limit = 12
  const sort = String(searchParams.sort || '-featured')

  const where: any = {
    _status: { equals: 'published' },
  }

  if (practiceAreaId) {
    where.practiceAreas = { contains: practiceAreaId }
  }

  if (locationId) {
    where.and = [
      ...(where.and || []),
      {
        or: [
          { locations: { contains: locationId } },
          { primaryLocation: { equals: locationId } },
        ],
      },
    ]
  }

  if (searchParams.size) {
    const sizes = String(searchParams.size).split(',')
    where.companySize = { in: sizes }
  }
  if (searchParams.languages) {
    const langs = String(searchParams.languages).split(',')
    where.languages = { contains: langs[0] }
  }

  const result = await payload.find({
    collection: 'law-firms',
    where,
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

  const { docs } = await payload.find({
    collection: 'law-firms',
    where: {
      _status: { equals: 'published' },
      id: { not_equals: firm.id },
      or: [
        { primaryLocation: { equals: locationId } },
        { practiceAreas: { in: practiceAreaIds.slice(0, 3) } },
      ],
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
      return {
        title: firm.meta?.title || `${firm.name} | Law Firm in ${loc?.name || country.name}`,
        description:
          firm.meta?.description ||
          firm.shortDescription ||
          `${firm.name} is a law firm based in ${loc?.name || country.name}. Learn more about their services and team.`,
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
    const [{ firms, totalPages, currentPage, totalDocs }, filterOptions] = await Promise.all([
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
                  showPracticeAreas={true}
                  showLocations={true}
                />
              </div>

              <div className="flex-1">
                <ResultsToolbar
                  shown={firms.length}
                  total={totalDocs}
                  sortValue={String(resolvedSearchParams.sort || '-featured')}
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
      const [{ firms, totalPages, currentPage, totalDocs }, filterOptions] = await Promise.all([
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
                    showPracticeAreas={true}
                    showLocations={false}
                  />
                </div>

                <div className="flex-1">
                  <ResultsToolbar
                    shown={firms.length}
                    total={totalDocs}
                    sortValue={String(resolvedSearchParams.sort || '-featured')}
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
      const [{ firms, totalPages, currentPage, totalDocs }, filterOptions] = await Promise.all([
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
                    showPracticeAreas={false}
                    showLocations={true}
                  />
                </div>

                <div className="flex-1">
                  <ResultsToolbar
                    shown={firms.length}
                    total={totalDocs}
                    sortValue={String(resolvedSearchParams.sort || '-featured')}
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

      // Build breadcrumbs
      const breadcrumbs = [
        { label: 'Home', href: '/' },
        { label: 'Lawyers', href: '/lawyers' },
        { label: country.name, href: `/${country.slug}/lawyers` },
        ...(location ? [{ label: location.name, href: `/${country.slug}/lawyers/${location.slug}` }] : []),
        { label: firm.name },
      ]

      return (
        <>
          <ProfileHero firm={firm as any} breadcrumbs={breadcrumbs} />

          <div className="py-12">
            <Container>
              <div className="grid gap-12 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-12">
                  {firm.description && (
                    <section>
                      <h2 className="font-heading text-2xl font-bold text-royal-900">About {firm.name}</h2>
                      <div className="prose prose-gray mt-4 max-w-none">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: ((firm.description as any)?.root?.children?.[0]?.children?.[0]?.text as string) || '',
                          }}
                        />
                      </div>
                    </section>
                  )}

                  {firm.services && firm.services.length > 0 && (
                    <section>
                      <h2 className="font-heading text-2xl font-bold text-royal-900">Services Offered</h2>
                      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                        {firm.services.map((service, index) => (
                          <li key={index} className="flex items-start gap-3 rounded-lg border border-border/50 bg-white p-4">
                            <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-royal-600" />
                            <span className="text-royal-800">{service.service}</span>
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}
                </div>

                <div className="space-y-8">
                  {practiceAreas.length > 0 && (
                    <div className="rounded-xl border border-border/50 bg-white p-6">
                      <h3 className="font-heading text-lg font-semibold text-royal-900">Practice Areas</h3>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {practiceAreas.map((area) => (
                          <Link
                            key={area.id}
                            href={`/${country.slug}/lawyers/${area.slug}`}
                            className="rounded-full bg-royal-50 px-3 py-1.5 text-sm font-medium text-royal-700 transition-colors hover:bg-royal-100"
                          >
                            {area.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="rounded-xl border border-border/50 bg-white p-6">
                    <h3 className="font-heading text-lg font-semibold text-royal-900">Quick Facts</h3>
                    <dl className="mt-4 space-y-3">
                      {firm.foundingYear && (
                        <div className="flex justify-between">
                          <dt className="text-royal-700/70">Founded</dt>
                          <dd className="font-medium text-royal-900">{firm.foundingYear}</dd>
                        </div>
                      )}
                      {firm.companySize && (
                        <div className="flex justify-between">
                          <dt className="text-royal-700/70">Team Size</dt>
                          <dd className="font-medium text-royal-900">{firm.companySize}</dd>
                        </div>
                      )}
                      {firm.languages && firm.languages.length > 0 && (
                        <div className="flex justify-between">
                          <dt className="text-royal-700/70">Languages</dt>
                          <dd className="font-medium text-royal-900 text-right">{firm.languages.join(', ')}</dd>
                        </div>
                      )}
                      {location && (
                        <div className="flex justify-between">
                          <dt className="text-royal-700/70">Location</dt>
                          <dd className="font-medium text-royal-900">{location.name}</dd>
                        </div>
                      )}
                    </dl>
                  </div>
                </div>
              </div>
            </Container>
          </div>

          {firm.teamMembers && firm.teamMembers.length > 0 && <TeamSection teamMembers={firm.teamMembers as any} />}
          <ContactSection firm={firm as any} />

          {relatedFirms.length > 0 && (
            <section className="py-12">
              <Container>
                <div className="mb-8 flex items-end justify-between">
                  <div>
                    <h2 className="font-heading text-2xl font-bold text-royal-900 lg:text-3xl">Related Law Firms</h2>
                    <p className="mt-2 text-royal-700/80">Other firms you might be interested in</p>
                  </div>
                  <Link href={`/${country.slug}/lawyers`} className="hidden items-center gap-2 font-medium text-royal-700 hover:text-royal-600 sm:flex">
                    View All
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {relatedFirms.map((rf) => (
                    <LawFirmCard key={rf.id} firm={rf as any} variant="compact" />
                  ))}
                </div>
              </Container>
            </section>
          )}
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

      const [{ firms, totalPages, currentPage, totalDocs }] = await Promise.all([
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
                  <FilterSidebar showPracticeAreas={false} showLocations={false} />
                </div>
                <div className="flex-1">
                  <ResultsToolbar
                    shown={firms.length}
                    total={totalDocs}
                    sortValue={String(resolvedSearchParams.sort || '-featured')}
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
    const payload = await getPayload({ config })
    const page = Number(resolvedSearchParams.page) || 1
    const limit = 12
    const sort = String(resolvedSearchParams.sort || '-featured')
    const where: any = {
      _status: { equals: 'published' },
      practiceAreas: { contains: practiceArea.id },
      or: [{ name: { contains: q } }, { shortDescription: { contains: q } }],
    }
    const result = await payload.find({ collection: 'law-firms', where, limit, page, depth: 2, sort })

    return (
      <>
        <DarkHero
          title={`${q} ${practiceArea.name} Lawyers in ${country.name}`}
          description={`Browse ${practiceArea.name.toLowerCase()} firms focused on ${q}.`}
          meta={`${result.totalDocs} law firm${result.totalDocs !== 1 ? 's' : ''} found`}
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
                <FilterSidebar showPracticeAreas={false} showLocations={false} />
              </div>
              <div className="flex-1">
                <LawFirmGrid firms={result.docs as any} emptyMessage={`No ${practiceArea.name.toLowerCase()} firms found for "${q}".`} />
                {result.totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination currentPage={result.page || 1} totalPages={result.totalPages} basePath={`/${country.slug}/lawyers/${practiceArea.slug}/${s2}`} />
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

    const payload = await getPayload({ config })
    const page = Number(resolvedSearchParams.page) || 1
    const limit = 12
    const sort = String(resolvedSearchParams.sort || '-featured')

    const where: any = {
      _status: { equals: 'published' },
      practiceAreas: { contains: practiceArea.id },
      and: [
        {
          or: [
            { locations: { contains: location.id } },
            { primaryLocation: { equals: location.id } },
          ],
        },
      ],
      or: [{ name: { contains: q } }, { shortDescription: { contains: q } }],
    }

    const result = await payload.find({ collection: 'law-firms', where, limit, page, depth: 2, sort })

    return (
      <>
        <DarkHero
          title={`${q} ${practiceArea.name} Lawyers in ${location.name}`}
          description={`Browse ${practiceArea.name.toLowerCase()} firms in ${location.name} focused on ${q}.`}
          meta={`${result.totalDocs} law firm${result.totalDocs !== 1 ? 's' : ''} found`}
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
                <FilterSidebar showPracticeAreas={false} showLocations={false} />
              </div>
              <div className="flex-1">
                <LawFirmGrid firms={result.docs as any} emptyMessage={`No firms found for "${q}" in ${location.name}.`} />
                {result.totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination currentPage={result.page || 1} totalPages={result.totalPages} basePath={`/${country.slug}/lawyers/${location.slug}/${practiceArea.slug}/${s3}`} />
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
