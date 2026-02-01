import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import { Container } from '@/components/layout/Container'
import { LawFirmCard } from '@/components/law-firms/LawFirmCard'
import type { LawFirm, PracticeArea, Location } from '@/payload-types'

interface FeaturedFirmsProps {
  firms: Array<LawFirm & {
    practiceAreas: PracticeArea[]
    primaryLocation: Location | null
  }>
}

export function FeaturedFirms({ firms }: FeaturedFirmsProps) {
  if (!firms.length) return null

  return (
    <section className="bg-[#F8F4EE] py-20 lg:py-28" id="featured-firms">
      <Container>
        {/* Section Header */}
        <div className="mb-14 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-wider text-gold-600">
              Top Rated
            </span>
            <h2 className="font-heading text-3xl font-bold text-royal-900 lg:text-4xl">
              Featured Law Firms
            </h2>
            <p className="mt-3 max-w-xl text-warm-500">
              Discover Thailand&apos;s most trusted legal practices, handpicked for their expertise and reputation.
            </p>
          </div>
          <Link
            href="/law-firms"
            className="group inline-flex items-center gap-2 rounded-lg border border-royal-200 bg-white px-5 py-2.5 font-semibold text-royal-700 transition-all hover:border-royal-300 hover:bg-royal-50 hover:shadow-sm"
          >
            View All Firms
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Firms Grid - single column for horizontal cards */}
        <div className="space-y-6">
          {firms.map((firm) => (
            <LawFirmCard key={firm.id} firm={firm} variant="featured" />
          ))}
        </div>
      </Container>
    </section>
  )
}
