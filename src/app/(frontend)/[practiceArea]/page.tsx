import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { ChevronRight } from 'lucide-react'
import type { Metadata } from 'next'

import { Container } from '@/components/layout/Container'
import { LawFirmGrid, FilterSidebar, Pagination } from '@/components/law-firms'

interface PageProps {
  params: Promise<{ practiceArea: string }>
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

async function getLawFirms(
  practiceAreaId: number,
  searchParams: { [key: string]: string | string[] | undefined },
) {
  const payload = await getPayload({ config })
  
  const page = Number(searchParams.page) || 1
  const limit = 10

  // Build where clause
  const where: any = {
    _status: { equals: 'published' },
    practiceAreas: { contains: practiceAreaId },
  }

  // Location filter
  if (searchParams.locations) {
    const locationSlugs = String(searchParams.locations).split(',')
    const { docs: locationDocs } = await payload.find({
      collection: 'locations',
      where: { slug: { in: locationSlugs } },
    })
    if (locationDocs.length > 0) {
      where.locations = { in: locationDocs.map((l) => l.id) }
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
    where.languages = { contains: langs[0] } // At least one language
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
  
  const [locations] = await Promise.all([
    payload.find({ collection: 'locations', limit: 100, sort: 'name' }),
  ])

  return {
    locations: locations.docs.map((l) => ({ id: l.id, name: l.name, slug: l.slug })),
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { practiceArea: practiceAreaSlug } = await params
  const practiceArea = await getPracticeArea(practiceAreaSlug)

  if (!practiceArea) {
    return { title: 'Not Found' }
  }

  return {
    title: practiceArea.seoTitle || `${practiceArea.name} Lawyers in Thailand`,
    description:
      practiceArea.seoDescription ||
      `Find experienced ${practiceArea.name.toLowerCase()} lawyers in Thailand. Browse our directory of qualified legal professionals.`,
  }
}

export default async function PracticeAreaPage({ params, searchParams }: PageProps) {
  const { practiceArea: practiceAreaSlug } = await params
  const resolvedSearchParams = await searchParams
  
  const practiceArea = await getPracticeArea(practiceAreaSlug)

  if (!practiceArea) {
    notFound()
  }

  const [{ firms, totalPages, currentPage, totalDocs }, filterOptions] = await Promise.all([
    getLawFirms(practiceArea.id, resolvedSearchParams),
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
            <span className="text-white">{practiceArea.name}</span>
          </nav>

          <h1 className="font-heading text-3xl font-bold text-white lg:text-4xl">
            {practiceArea.name} Lawyers in Thailand
          </h1>
          <p className="mt-3 max-w-2xl text-silver-300">
            {practiceArea.shortDescription ||
              `Find qualified ${practiceArea.name.toLowerCase()} lawyers across Thailand.`}
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
                locations={filterOptions.locations}
                showPracticeAreas={false}
                showLocations={true}
              />
            </div>

            {/* Results */}
            <div className="flex-1">
              <LawFirmGrid
                firms={firms as any}
                emptyMessage={`No ${practiceArea.name.toLowerCase()} lawyers found matching your criteria.`}
              />

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    basePath={`/${practiceAreaSlug}`}
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
