import Link from 'next/link'
import { MapPin, ArrowRight } from 'lucide-react'

import { Container } from '@/components/layout/Container'
import type { Location } from '@/payload-types'

interface LocationsGridProps {
  locations: Location[]
}

export function LocationsGrid({ locations }: LocationsGridProps) {
  if (!locations.length) return null

  return (
    <section className="bg-cream-100 py-20 lg:py-28" id="locations">
      <Container>
        {/* Section Header */}
        <div className="mb-14 text-center">
          <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-wider text-royal-600">
            Nationwide Coverage
          </span>
          <h2 className="font-heading text-3xl font-bold text-royal-900 lg:text-4xl">
            Find Lawyers by Location
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-royal-800/70">
            Connect with legal professionals across Thailand&apos;s major cities and regions
          </p>
        </div>

        {/* Locations Grid - uniform 5 columns */}
        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {locations.map((location) => (
            <Link
              key={location.id}
              href={`/thailand/lawyers/${location.slug}`}
              className="group rounded-2xl border border-warm-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-royal-300 hover:shadow-lg"
            >
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-royal-900 text-white shadow-sm transition-all group-hover:bg-royal-800 group-hover:shadow-md">
                <MapPin className="h-5 w-5" />
              </div>

              <h3 className="font-heading text-lg font-bold text-royal-900 group-hover:text-royal-700">
                {location.name}
              </h3>

              <p className="mt-1 text-sm text-royal-800/60">
                {location.region} Thailand
              </p>

              <div className="mt-4 inline-flex items-center text-sm font-semibold text-royal-600 group-hover:text-royal-700">
                Find Lawyers
                <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  )
}
