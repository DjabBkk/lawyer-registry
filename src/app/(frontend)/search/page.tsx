import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Search } from 'lucide-react'
import type { Metadata } from 'next'

import { Container } from '@/components/layout/Container'
import { DarkHero } from '@/components/layout/DarkHero'
import { LawFirmGrid, FilterSidebar, Pagination, ResultsToolbar } from '@/components/law-firms'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

const languageOptions = ['English', 'Thai', 'Chinese', 'Japanese', 'German'] as const

const parseListParam = (value: string | string[] | undefined) =>
  String(value || '')
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)

const normalizeSort = (value: string) => {
  switch (value) {
    case 'fee-asc':
      return 'feeRangeMin'
    case 'newest':
      return '-createdAt'
    case 'name-asc':
      return 'name'
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

async function searchLawFirms(searchParams: { [key: string]: string | string[] | undefined }) {
  const payload = await getPayload({ config })
  
  const query = String(searchParams.q || '')
  const page = Number(searchParams.page) || 1
  const limit = 12
  const sortParam = normalizeSortParamValue(String(searchParams.sort || '-featured'))
  const sort = normalizeSort(sortParam)

  if (!query.trim()) {
    return { firms: [], totalPages: 0, currentPage: 1, totalDocs: 0, languageCounts: {}, sortParam }
  }

  const selectedPracticeAreas = parseListParam(searchParams.practiceAreas)
  const selectedLocations = parseListParam(searchParams.locations)
  const selectedSizes = parseListParam(searchParams.size)
  const selectedLanguages = parseListParam(searchParams.languages)
  const selectedFeeRanges = parseListParam(searchParams.feeRange)
  const verifiedOnly = String(searchParams.verified || '') === 'true'
  const hasPricing = String(searchParams.hasPricing || '') === 'true'

  const [practiceAreaDocs, locationDocs] = await Promise.all([
    selectedPracticeAreas.length
      ? payload.find({
          collection: 'practice-areas',
          where: { slug: { in: selectedPracticeAreas } },
          limit: selectedPracticeAreas.length,
          depth: 0,
        })
      : Promise.resolve({ docs: [] as Array<{ id: number }> }),
    selectedLocations.length
      ? payload.find({
          collection: 'locations',
          where: { slug: { in: selectedLocations } },
          limit: selectedLocations.length,
          depth: 0,
        })
      : Promise.resolve({ docs: [] as Array<{ id: number }> }),
  ])

  const whereBase: any = {
    _status: { equals: 'published' },
    and: [
      {
        or: [{ name: { contains: query } }, { shortDescription: { contains: query } }],
      },
    ],
  }

  if (practiceAreaDocs.docs.length) {
    whereBase.and.push({
      practiceAreas: { in: practiceAreaDocs.docs.map((doc) => doc.id) },
    })
  }

  if (locationDocs.docs.length) {
    const locationIds = locationDocs.docs.map((doc) => doc.id)
    whereBase.and.push({
      or: [{ locations: { in: locationIds } }, { primaryLocation: { in: locationIds } }],
    })
  }

  if (selectedSizes.length) {
    whereBase.and.push({
      companySize: { in: selectedSizes },
    })
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
      .filter(Boolean)

    if (feeConditions.length) {
      whereBase.and.push({ or: feeConditions })
    }
  }

  if (verifiedOnly) {
    whereBase.and.push({ verified: { equals: true } })
  }

  if (hasPricing) {
    whereBase.and.push({
      or: [
        { feeRangeMin: { exists: true } },
        { feeRangeMax: { exists: true } },
        { hourlyFeeMin: { exists: true } },
        { hourlyFeeMax: { exists: true } },
        { practiceAreaDetails: { exists: true } },
      ],
    })
  }

  const languageCountsResult = await payload.find({
    collection: 'law-firms',
    where: whereBase,
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

  const where = { ...whereBase }
  if (selectedLanguages.length) {
    where.and = [
      ...(where.and || []),
      {
        or: selectedLanguages.map((language) => ({ languages: { contains: language } })),
      },
    ]
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
    languageCounts,
    sortParam,
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
  
  const [{ firms, totalPages, currentPage, totalDocs, languageCounts, sortParam }, filterOptions] = await Promise.all([
    searchLawFirms(resolvedSearchParams),
    getFilterOptions(),
  ])

  return (
    <>
      <DarkHero
        title={query ? `Search Results for "${query}"` : 'Search Law Firms'}
        meta={query ? `${totalDocs} result${totalDocs !== 1 ? 's' : ''} found` : undefined}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Search' },
        ]}
      >
        <form action="/search" method="GET" className="mt-6 max-w-2xl">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-royal-700/50" />
              <Input
                type="search"
                name="q"
                defaultValue={query}
                placeholder="Search law firms by name or description..."
                className="h-12 w-full border-0 bg-white pl-10 text-royal-900 shadow-sm"
              />
            </div>
            <Button type="submit" className="h-12 bg-gold-500 px-6 text-white hover:bg-gold-400">
              Search
            </Button>
          </div>
        </form>
      </DarkHero>

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
                  languageCounts={languageCounts}
                  showPracticeAreas={true}
                  showLocations={true}
                />
              </div>

              {/* Results */}
              <div className="flex-1">
                <ResultsToolbar
                  shown={firms.length}
                  total={totalDocs}
                  sortValue={sortParam}
                  practiceAreas={filterOptions.practiceAreas}
                  locations={filterOptions.locations}
                />
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
                    <h3 className="font-heading text-xl font-semibold text-royal-900">
                      No results found
                    </h3>
                    <p className="mt-2 text-royal-700/80">
                      Try adjusting your search or browse our directory
                    </p>
                    <div className="mt-6 flex flex-wrap justify-center gap-3">
                      <Button asChild variant="outline">
                        <Link href="/thailand/lawyers">Browse All Firms</Link>
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
              <Search className="mx-auto h-16 w-16 text-royal-300" />
              <h2 className="mt-6 font-heading text-2xl font-bold text-royal-900">
                Search for Law Firms
              </h2>
              <p className="mt-2 text-royal-700/80">
                Enter a search term above to find law firms by name, description, or services.
              </p>
              <div className="mt-8">
                <p className="mb-4 text-sm text-royal-700/70">Or browse by:</p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button asChild variant="outline">
                    <Link href="/thailand/lawyers">All Law Firms</Link>
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
