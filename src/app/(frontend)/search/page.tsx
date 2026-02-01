import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Search, ChevronRight } from 'lucide-react'
import type { Metadata } from 'next'

import { Container } from '@/components/layout/Container'
import { LawFirmGrid, FilterSidebar, Pagination } from '@/components/law-firms'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

async function searchLawFirms(searchParams: { [key: string]: string | string[] | undefined }) {
  const payload = await getPayload({ config })
  
  const query = String(searchParams.q || '')
  const page = Number(searchParams.page) || 1
  const limit = 12

  if (!query.trim()) {
    return { firms: [], totalPages: 0, currentPage: 1, totalDocs: 0 }
  }

  // Build where clause for search
  const where: any = {
    _status: { equals: 'published' },
    or: [
      { name: { contains: query } },
      { shortDescription: { contains: query } },
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

  // Location filter
  if (searchParams.locations) {
    const locationSlugs = String(searchParams.locations).split(',')
    const { docs: locationDocs } = await payload.find({
      collection: 'locations',
      where: { slug: { in: locationSlugs } },
    })
    if (locationDocs.length > 0) {
      where.and = [
        ...(where.and || []),
        {
          or: [
            { locations: { in: locationDocs.map((l) => l.id) } },
            { primaryLocation: { in: locationDocs.map((l) => l.id) } },
          ],
        },
      ]
    }
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
  
  const [practiceAreas, locations] = await Promise.all([
    payload.find({ collection: 'practice-areas', limit: 100, sort: 'name' }),
    payload.find({ collection: 'locations', limit: 100, sort: 'name' }),
  ])

  return {
    practiceAreas: practiceAreas.docs.map((pa) => ({ id: pa.id, name: pa.name, slug: pa.slug })),
    locations: locations.docs.map((l) => ({ id: l.id, name: l.name, slug: l.slug })),
  }
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams
  const query = String(params.q || '')
  
  return {
    title: query ? `Search Results for "${query}"` : 'Search Law Firms',
    description: query
      ? `Find law firms matching "${query}" in Thailand.`
      : 'Search for law firms in Thailand by name, description, or services.',
  }
}

export default async function SearchPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams
  const query = String(resolvedSearchParams.q || '')
  
  const [{ firms, totalPages, currentPage, totalDocs }, filterOptions] = await Promise.all([
    searchLawFirms(resolvedSearchParams),
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
            <span className="text-white">Search</span>
          </nav>

          <h1 className="font-heading text-3xl font-bold text-white lg:text-4xl">
            {query ? `Search Results for "${query}"` : 'Search Law Firms'}
          </h1>
          
          {/* Search Form */}
          <form action="/search" method="GET" className="mt-6 max-w-2xl">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <Input
                  type="search"
                  name="q"
                  defaultValue={query}
                  placeholder="Search law firms by name or description..."
                  className="h-12 w-full border-0 bg-white pl-10 text-gray-900 shadow-sm"
                />
              </div>
              <Button type="submit" className="h-12 bg-gold-500 px-6 text-royal-900 hover:bg-gold-400">
                Search
              </Button>
            </div>
          </form>

          {query && (
            <p className="mt-4 text-sm text-silver-400">
              {totalDocs} result{totalDocs !== 1 ? 's' : ''} found
            </p>
          )}
        </Container>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <Container>
          {query ? (
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
                <LawFirmGrid
                  firms={firms as any}
                  emptyMessage={`No law firms found matching "${query}".`}
                />

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      basePath="/search"
                    />
                  </div>
                )}

                {/* No results suggestions */}
                {totalDocs === 0 && (
                  <div className="mt-8 rounded-xl border border-border/50 bg-white p-8 text-center">
                    <h3 className="font-heading text-xl font-semibold text-gray-900">
                      No results found
                    </h3>
                    <p className="mt-2 text-gray-600">
                      Try adjusting your search or browse our directory
                    </p>
                    <div className="mt-6 flex flex-wrap justify-center gap-3">
                      <Button asChild variant="outline">
                        <Link href="/law-firms">Browse All Firms</Link>
                      </Button>
                      <Button asChild variant="outline">
                        <Link href="/#practice-areas">View Practice Areas</Link>
                      </Button>
                      <Button asChild variant="outline">
                        <Link href="/#locations">View Locations</Link>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            // Empty search state
            <div className="mx-auto max-w-2xl text-center">
              <Search className="mx-auto h-16 w-16 text-gray-300" />
              <h2 className="mt-6 font-heading text-2xl font-bold text-gray-900">
                Search for Law Firms
              </h2>
              <p className="mt-2 text-gray-600">
                Enter a search term above to find law firms by name, description, or services.
              </p>
              <div className="mt-8">
                <p className="mb-4 text-sm text-gray-500">Or browse by:</p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button asChild variant="outline">
                    <Link href="/law-firms">All Law Firms</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/#practice-areas">Practice Areas</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/#locations">Locations</Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Container>
      </section>
    </>
  )
}
