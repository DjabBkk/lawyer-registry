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
    <section className="bg-[#F8F4EE] py-20 lg:py-28" id="locations">
      <Container>
        {/* Section Header */}
        <div className="mb-14 text-center">
          <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-wider text-royal-600">
            Nationwide Coverage
          </span>
          <h2 className="font-heading text-3xl font-bold text-royal-900 lg:text-4xl">
            Find Lawyers by Location
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-warm-500">
            Connect with legal professionals across Thailand&apos;s major cities and regions
          </p>
        </div>

        {/* Locations Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {locations.map((location, index) => (
            <Link
              key={location.id}
              href={`/thailand/lawyers/${location.slug}`}
              className={`group relative overflow-hidden rounded-2xl border border-warm-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-royal-300 hover:shadow-lg ${
                index === 0 ? 'sm:col-span-2 lg:col-span-2 lg:row-span-2' : ''
              }`}
            >
              {/* Background gradient for featured location */}
              {index === 0 && (
                <div className="absolute inset-0 bg-gradient-to-br from-royal-50/80 via-royal-50/40 to-transparent" />
              )}
              
              <div className="relative">
                <div className={`mb-4 inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-royal-700 to-royal-800 text-cream-100 shadow-sm transition-all group-hover:from-royal-600 group-hover:to-royal-700 ${
                  index === 0 ? 'h-14 w-14' : 'h-11 w-11'
                }`}>
                  <MapPin className={index === 0 ? 'h-7 w-7' : 'h-5 w-5'} />
                </div>
                
                <h3 className={`font-heading font-bold text-royal-900 group-hover:text-royal-700 ${
                  index === 0 ? 'text-xl lg:text-2xl' : 'text-lg'
                }`}>
                  {location.name}
                </h3>
                
                <p className="mt-1 text-sm text-warm-500">
                  {location.region} Thailand
                </p>
                
                {location.shortDescription && index === 0 && (
                  <p className="mt-4 line-clamp-2 text-warm-600">
                    {location.shortDescription}
                  </p>
                )}
                
                <div className={`inline-flex items-center text-sm font-semibold text-royal-600 group-hover:text-royal-700 ${
                  index === 0 ? 'mt-6' : 'mt-4'
                }`}>
                  Find Lawyers
                  <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  )
}
