import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { ChevronRight } from 'lucide-react'
import type { Metadata } from 'next'

import { Container } from '@/components/layout/Container'
import { LawFirmGrid, FilterSidebar, Pagination } from '@/components/law-firms'

interface PageProps {
  params: Promise<{ practiceArea: string; location: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

async function getPracticeArea(slug: string) {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'practice-areas',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  return docs[0] || null
}

async function getLocation(slug: string) {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'locations',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  return docs[0] || null
}

async function getLawFirms(
  practiceAreaId: number,
  locationId: number,
  searchParams: { [key: string]: string | string[] | undefined },
) {
  const payload = await getPayload({ config })
  
  const page = Number(searchParams.page) || 1
  const limit = 10

  // Build where clause
  const where: any = {
    _status: { equals: 'published' },
    practiceAreas: { contains: practiceAreaId },
    or: [
      { locations: { contains: locationId } },
      { primaryLocation: { equals: locationId } },
    ],
  }

  // Company size filter
  if (searchParams.size) {
    const sizes = String(searchParams.size).split(',')
    where.companySize = { in: sizes }
  }

  // Languages filter
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
    sort: '-featured',
  })

  return {
    firms: result.docs,
    totalPages: result.totalPages,
    currentPage: result.page || 1,
    totalDocs: result.totalDocs,
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { practiceArea: practiceAreaSlug, location: locationSlug } = await params
  
  const [practiceArea, location] = await Promise.all([
    getPracticeArea(practiceAreaSlug),
    getLocation(locationSlug),
  ])

  if (!practiceArea || !location) {
    return { title: 'Not Found' }
  }

  return {
    title: `${practiceArea.name} Lawyers in ${location.name} | Top Lawyers Thailand`,
    description: `Find experienced ${practiceArea.name.toLowerCase()} lawyers in ${location.name}, Thailand. Browse our directory of qualified legal professionals specializing in ${practiceArea.name.toLowerCase()}.`,
  }
}

export default async function CombinedPage({ params, searchParams }: PageProps) {
  const { practiceArea: practiceAreaSlug, location: locationSlug } = await params
  const resolvedSearchParams = await searchParams
  
  const [practiceArea, location] = await Promise.all([
    getPracticeArea(practiceAreaSlug),
    getLocation(locationSlug),
  ])

  if (!practiceArea || !location) {
    notFound()
  }

  const { firms, totalPages, currentPage, totalDocs } = await getLawFirms(
    practiceArea.id,
    location.id,
    resolvedSearchParams,
  )

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-royal-900 via-royal-700 to-royal-600 py-12 lg:py-16">
        <Container>
          {/* Breadcrumb */}
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-silver-400">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href={`/${practiceAreaSlug}`} className="hover:text-white">
              {practiceArea.name}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-white">{location.name}</span>
          </nav>

          <h1 className="font-heading text-3xl font-bold text-white lg:text-4xl">
            {practiceArea.name} Lawyers in {location.name}
          </h1>
          <p className="mt-3 max-w-2xl text-silver-300">
            Find qualified {practiceArea.name.toLowerCase()} lawyers in {location.name},{' '}
            {location.region} Thailand.
          </p>
          <p className="mt-4 text-sm text-silver-400">
            {totalDocs} law firm{totalDocs !== 1 ? 's' : ''} found
          </p>
        </Container>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <Container>
          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Sidebar */}
            <div className="lg:w-72 lg:shrink-0">
              <FilterSidebar
                showPracticeAreas={false}
                showLocations={false}
              />
            </div>

            {/* Results */}
            <div className="flex-1">
              <LawFirmGrid
                firms={firms as any}
                emptyMessage={`No ${practiceArea.name.toLowerCase()} lawyers found in ${location.name} matching your criteria.`}
              />

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    basePath={`/${practiceAreaSlug}/${locationSlug}`}
                  />
                </div>
              )}

              {/* Alternative suggestions if no results */}
              {totalDocs === 0 && (
                <div className="mt-8 rounded-xl border border-border/50 bg-white p-6">
                  <h3 className="font-heading text-lg font-semibold text-gray-900">
                    Try these alternatives
                  </h3>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Link
                      href={`/${practiceAreaSlug}`}
                      className="rounded-full bg-royal-50 px-4 py-2 text-sm font-medium text-royal-700 hover:bg-royal-100"
                    >
                      All {practiceArea.name} Lawyers
                    </Link>
                    <Link
                      href={`/locations/${locationSlug}`}
                      className="rounded-full bg-royal-50 px-4 py-2 text-sm font-medium text-royal-700 hover:bg-royal-100"
                    >
                      All Lawyers in {location.name}
                    </Link>
                    <Link
                      href="/law-firms"
                      className="rounded-full bg-royal-50 px-4 py-2 text-sm font-medium text-royal-700 hover:bg-royal-100"
                    >
                      Browse All Firms
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
