import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { ChevronRight } from 'lucide-react'
import type { Metadata } from 'next'

import { Container } from '@/components/layout/Container'
import { LawFirmGrid, FilterSidebar, Pagination, SortSelect } from '@/components/law-firms'

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

async function getLawFirms(searchParams: { [key: string]: string | string[] | undefined }) {
  const payload = await getPayload({ config })
  
  const page = Number(searchParams.page) || 1
  const limit = 12
  const sort = String(searchParams.sort || '-featured')

  // Build where clause
  const where: any = {
    _status: { equals: 'published' },
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

  // Location filter
  if (searchParams.locations) {
    const locationSlugs = String(searchParams.locations).split(',')
    const { docs: locationDocs } = await payload.find({
      collection: 'locations',
      where: { slug: { in: locationSlugs } },
    })
    if (locationDocs.length > 0) {
      where.or = [
        { locations: { in: locationDocs.map((l) => l.id) } },
        { primaryLocation: { in: locationDocs.map((l) => l.id) } },
      ]
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
    sort,
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
  
  const [practiceAreas, locations] = await Promise.all([
    payload.find({ collection: 'practice-areas', limit: 100, sort: 'name' }),
    payload.find({ collection: 'locations', limit: 100, sort: 'name' }),
  ])

  return {
    practiceAreas: practiceAreas.docs.map((pa) => ({ id: pa.id, name: pa.name, slug: pa.slug })),
    locations: locations.docs.map((l) => ({ id: l.id, name: l.name, slug: l.slug })),
  }
}

export const metadata: Metadata = {
  title: 'All Law Firms in Thailand',
  description:
    'Browse our comprehensive directory of law firms in Thailand. Filter by practice area, location, and more to find the right legal professional for your needs.',
}

export default async function LawFirmsIndexPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams
  
  const [{ firms, totalPages, currentPage, totalDocs }, filterOptions] = await Promise.all([
    getLawFirms(resolvedSearchParams),
    getFilterOptions(),
  ])

  return (
    <>
      {/* Hero Section - Warm Königsblau */}
      <section className="relative overflow-hidden bg-gradient-to-br from-royal-900 via-royal-700 to-royal-600">
        {/* Warm gold accent overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-gold-500/5 to-gold-400/10" />
        
        <Container className="relative py-16 lg:py-20">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center gap-2 text-sm text-cream-200/70">
            <Link href="/" className="transition-colors hover:text-white">
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-white">All Law Firms</span>
          </nav>

          <h1 className="font-heading text-4xl font-bold text-white lg:text-5xl">
            Law Firms in Thailand
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-cream-200/80">
            Browse our comprehensive directory of law firms across Thailand. Use filters to find the perfect match for your legal needs.
          </p>
          <p className="mt-6 text-sm font-medium text-cream-200/60">
            {totalDocs} law firm{totalDocs !== 1 ? 's' : ''} found
          </p>
        </Container>
      </section>

      {/* Main Content */}
      <section className="bg-cream-100 py-12">
        <Container>
          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Sidebar */}
            <div className="lg:w-72 lg:shrink-0">
              <FilterSidebar
                practiceAreas={filterOptions.practiceAreas}
                locations={filterOptions.locations}
                showPracticeAreas={true}
                showLocations={true}
              />
            </div>

            {/* Results */}
            <div className="flex-1">
              {/* Sort Options */}
              <div className="mb-6 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing {firms.length} of {totalDocs} firms
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Sort by:</span>
                  <SortSelect defaultValue={String(resolvedSearchParams.sort || '-featured')} />
                </div>
              </div>

              <LawFirmGrid
                firms={firms as any}
                emptyMessage="No law firms found matching your criteria."
              />

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    basePath="/law-firms"
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
