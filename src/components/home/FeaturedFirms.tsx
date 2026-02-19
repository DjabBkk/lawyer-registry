import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import { Container } from '@/components/layout/Container'
import { BusinessCard } from '@/components/law-firms/BusinessCard'
import type { Business, PracticeArea, Location } from '@/payload-types'

interface FeaturedFirmsProps {
  firms: Array<Business & {
    practiceAreas: PracticeArea[]
    primaryLocation: Location | null
  }>
  countrySlug: string
}

export function FeaturedFirms({ firms, countrySlug }: FeaturedFirmsProps) {
  if (!firms.length) return null

  // Show max 6 firms in a 3-column grid (2 rows)
  const displayedFirms = firms.slice(0, 6)

  return (
    <section className="bg-cream-100 py-20 lg:py-28" id="featured-firms">
      <Container>
        {/* Section Header */}
        <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-wider text-gold-600">
              Top Rated
            </span>
            <h2 className="font-heading text-3xl font-bold text-royal-900 lg:text-4xl">
              Featured Law Firms
            </h2>
            <p className="mt-3 max-w-xl text-royal-900">
              Discover Thailand&apos;s most trusted legal practices, handpicked for their expertise and reputation.
            </p>
          </div>
          <Link
            href="/thailand/lawyers"
            className="group inline-flex items-center gap-2 rounded-lg border border-royal-200 bg-white px-5 py-2.5 font-semibold text-royal-700 transition-all hover:border-royal-300 hover:bg-royal-50 hover:shadow-sm"
          >
            View All Firms
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Firms Grid - 3 columns */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayedFirms.map((firm) => (
            <BusinessCard key={firm.id} firm={firm} countrySlug={countrySlug} variant="grid" />
          ))}
        </div>
      </Container>
    </section>
  )
}
