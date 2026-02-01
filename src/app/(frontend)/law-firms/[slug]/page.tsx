import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { ChevronRight, ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'

import { Container } from '@/components/layout/Container'
import { ProfileHero, TeamSection, ContactSection } from '@/components/profile'
import { LawFirmCard } from '@/components/law-firms/LawFirmCard'
import type { LawFirm, PracticeArea, Location } from '@/payload-types'

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getLawFirm(slug: string) {
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

async function getRelatedFirms(firm: LawFirm) {
  const payload = await getPayload({ config })

  // Get firms in same location or with same practice areas
  const practiceAreaIds = (firm.practiceAreas as PracticeArea[])
    ?.map((pa) => (typeof pa === 'object' ? pa.id : pa))
    .filter(Boolean) || []

  const locationId = typeof firm.primaryLocation === 'object' ? firm.primaryLocation?.id : firm.primaryLocation

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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const firm = await getLawFirm(slug)

  if (!firm) {
    return { title: 'Not Found' }
  }

  const location = typeof firm.primaryLocation === 'object' ? firm.primaryLocation : null

  return {
    title: firm.seoTitle || `${firm.name} | Law Firm in ${location?.name || 'Thailand'}`,
    description:
      firm.seoDescription ||
      firm.shortDescription ||
      `${firm.name} is a law firm based in ${location?.name || 'Thailand'}. Learn more about their services and team.`,
  }
}

export default async function LawFirmProfilePage({ params }: PageProps) {
  const { slug } = await params
  const firm = await getLawFirm(slug)

  if (!firm) {
    notFound()
  }

  const relatedFirms = await getRelatedFirms(firm)

  const practiceAreas = (firm.practiceAreas as PracticeArea[])?.filter(
    (pa): pa is PracticeArea => typeof pa === 'object'
  ) || []

  const location = typeof firm.primaryLocation === 'object' ? firm.primaryLocation : null

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-cream-200/50 py-4">
        <Container>
          <nav className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-royal-700">
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/law-firms" className="hover:text-royal-700">
              Law Firms
            </Link>
            {location && (
              <>
                <ChevronRight className="h-4 w-4" />
                <Link href={`/locations/${location.slug}`} className="hover:text-royal-700">
                  {location.name}
                </Link>
              </>
            )}
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900">{firm.name}</span>
          </nav>
        </Container>
      </div>

      {/* Profile Hero */}
      <ProfileHero firm={firm as any} />

      {/* Main Content */}
      <div className="py-12">
        <Container>
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Main Column */}
            <div className="lg:col-span-2 space-y-12">
              {/* About Section */}
              {firm.description && (
                <section>
                  <h2 className="font-heading text-2xl font-bold text-gray-900">
                    About {firm.name}
                  </h2>
                  <div className="prose prose-gray mt-4 max-w-none">
                    {typeof firm.description === 'string' ? (
                      <p>{firm.description}</p>
                    ) : (
                      <div dangerouslySetInnerHTML={{ __html: firm.description?.root?.children?.[0]?.children?.[0]?.text || '' }} />
                    )}
                  </div>
                </section>
              )}

              {/* Services Section */}
              {firm.services && firm.services.length > 0 && (
                <section>
                  <h2 className="font-heading text-2xl font-bold text-gray-900">
                    Services Offered
                  </h2>
                  <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                    {firm.services.map((service, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 rounded-lg border border-border/50 bg-white p-4"
                      >
                        <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-royal-600" />
                        <span className="text-gray-700">{service.service}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Practice Areas */}
              {practiceAreas.length > 0 && (
                <div className="rounded-xl border border-border/50 bg-white p-6">
                  <h3 className="font-heading text-lg font-semibold text-gray-900">
                    Practice Areas
                  </h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {practiceAreas.map((area) => (
                      <Link
                        key={area.id}
                        href={`/${area.slug}`}
                        className="rounded-full bg-royal-50 px-3 py-1.5 text-sm font-medium text-royal-700 transition-colors hover:bg-royal-100"
                      >
                        {area.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Facts */}
              <div className="rounded-xl border border-border/50 bg-white p-6">
                <h3 className="font-heading text-lg font-semibold text-gray-900">
                  Quick Facts
                </h3>
                <dl className="mt-4 space-y-3">
                  {firm.foundingYear && (
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Founded</dt>
                      <dd className="font-medium text-gray-900">{firm.foundingYear}</dd>
                    </div>
                  )}
                  {firm.companySize && (
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Team Size</dt>
                      <dd className="font-medium text-gray-900">{firm.companySize}</dd>
                    </div>
                  )}
                  {firm.languages && firm.languages.length > 0 && (
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Languages</dt>
                      <dd className="font-medium text-gray-900 text-right">
                        {firm.languages.join(', ')}
                      </dd>
                    </div>
                  )}
                  {location && (
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Location</dt>
                      <dd className="font-medium text-gray-900">{location.name}</dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Team Section */}
      {firm.teamMembers && firm.teamMembers.length > 0 && (
        <TeamSection teamMembers={firm.teamMembers as any} />
      )}

      {/* Contact Section */}
      <ContactSection firm={firm as any} />

      {/* Related Firms */}
      {relatedFirms.length > 0 && (
        <section className="py-12">
          <Container>
            <div className="mb-8 flex items-end justify-between">
              <div>
                <h2 className="font-heading text-2xl font-bold text-gray-900 lg:text-3xl">
                  Related Law Firms
                </h2>
                <p className="mt-2 text-gray-600">
                  Other firms you might be interested in
                </p>
              </div>
              <Link
                href="/law-firms"
                className="hidden items-center gap-2 font-medium text-royal-700 hover:text-royal-600 sm:flex"
              >
                View All
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedFirms.map((firm) => (
                <LawFirmCard key={firm.id} firm={firm as any} variant="compact" />
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  )
}
