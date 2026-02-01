import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { ChevronRight } from 'lucide-react'
import type { Metadata } from 'next'

import { Container } from '@/components/layout/Container'
import { LawFirmGrid, FilterSidebar, Pagination } from '@/components/law-firms'

interface PageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
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
  locationId: number,
  searchParams: { [key: string]: string | string[] | undefined },
) {
  const payload = await getPayload({ config })
  
  const page = Number(searchParams.page) || 1
  const limit = 10

  // Build where clause
  const where: any = {
    _status: { equals: 'published' },
    or: [
      { locations: { contains: locationId } },
      { primaryLocation: { equals: locationId } },
    ],
  }

  // Practice area filter
  if (searchParams.practiceAreas) {
    const paSlugs = String(searchParams.practiceAreas).split(',')
    const { docs: paDocs } = await payload.find({
      collection: 'practice-areas',
      where: { slug: { in: paSlugs } },
    })
    if (paDocs.length > 0) {
      where.practiceAreas = { in: paDocs.map((pa) => pa.id) }
    }
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

async function getFilterOptions() {
  const payload = await getPayload({ config })
  
  const [practiceAreas] = await Promise.all([
    payload.find({ collection: 'practice-areas', limit: 100, sort: 'name' }),
  ])

  return {
    practiceAreas: practiceAreas.docs.map((pa) => ({ id: pa.id, name: pa.name, slug: pa.slug })),
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const location = await getLocation(slug)

  if (!location) {
    return { title: 'Not Found' }
  }

  return {
    title: location.seoTitle || `Law Firms in ${location.name}, Thailand`,
    description:
      location.seoDescription ||
      `Find the best law firms and lawyers in ${location.name}, Thailand. Browse our comprehensive directory of legal professionals.`,
  }
}

export default async function LocationPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const resolvedSearchParams = await searchParams
  
  const location = await getLocation(slug)

  if (!location) {
    notFound()
  }

  const [{ firms, totalPages, currentPage, totalDocs }, filterOptions] = await Promise.all([
    getLawFirms(location.id, resolvedSearchParams),
    getFilterOptions(),
  ])

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-royal-900 via-royal-700 to-royal-600 py-12 lg:py-16">
        <Container>
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-sm text-silver-400">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/#locations" className="hover:text-white">
              Locations
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-white">{location.name}</span>
          </nav>

          <h1 className="font-heading text-3xl font-bold text-white lg:text-4xl">
            Law Firms in {location.name}
          </h1>
          <p className="mt-3 max-w-2xl text-silver-300">
            {location.shortDescription ||
              `Discover trusted legal professionals in ${location.name}, ${location.region} Thailand.`}
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
                practiceAreas={filterOptions.practiceAreas}
                showPracticeAreas={true}
                showLocations={false}
              />
            </div>

            {/* Results */}
            <div className="flex-1">
              <LawFirmGrid
                firms={firms as any}
                emptyMessage={`No law firms found in ${location.name} matching your criteria.`}
              />

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    basePath={`/locations/${slug}`}
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
