import Link from 'next/link'
import { ArrowRight, Scale, Users, Building2, FileText, Briefcase, Shield, Globe, Gavel } from 'lucide-react'

import { Container } from '@/components/layout/Container'
import type { PracticeArea } from '@/payload-types'

// Map of icon names to components
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  scale: Scale,
  users: Users,
  building: Building2,
  file: FileText,
  briefcase: Briefcase,
  shield: Shield,
  globe: Globe,
  gavel: Gavel,
}

interface PracticeAreasGridProps {
  practiceAreas: PracticeArea[]
}

export function PracticeAreasGrid({ practiceAreas }: PracticeAreasGridProps) {
  if (!practiceAreas.length) return null

  return (
    <section className="bg-cream-300 py-20 lg:py-28" id="practice-areas">
      <Container>
        {/* Section Header */}
        <div className="mb-14 text-center">
          <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-wider text-royal-600">
            Our Expertise
          </span>
          <h2 className="font-heading text-3xl font-bold text-royal-900 lg:text-4xl">
            Browse by Practice Area
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-warm-600">
            Find specialized legal expertise across all major practice areas in Thailand
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {practiceAreas.map((area) => {
            const IconComponent = area.icon ? iconMap[area.icon] || Scale : Scale

            return (
              <Link
                key={area.id}
                href={`/thailand/lawyers/${area.slug}`}
                className="group rounded-2xl border border-warm-200 bg-white p-7 shadow-sm transition-all duration-300 hover:border-royal-300 hover:shadow-lg"
              >
                <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-royal-700 to-royal-800 text-cream-100 shadow-sm transition-all group-hover:from-royal-600 group-hover:to-royal-700 group-hover:shadow-md">
                  <IconComponent className="h-7 w-7" />
                </div>
                <h3 className="font-heading text-lg font-bold text-royal-900 transition-colors group-hover:text-royal-700">
                  {area.name}
                </h3>
                {area.shortDescription && (
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-warm-500">
                    {area.shortDescription}
                  </p>
                )}
                <div className="mt-5 inline-flex items-center text-sm font-semibold text-royal-600 transition-colors group-hover:text-royal-700">
                  View Lawyers
                  <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            )
          })}
        </div>

        {/* View All Link */}
        <div className="mt-14 text-center">
          <Link
            href="/thailand/lawyers"
            className="inline-flex items-center gap-2 rounded-xl border-2 border-royal-300 bg-white px-7 py-3.5 font-semibold text-royal-700 shadow-sm transition-all hover:border-royal-400 hover:bg-royal-50 hover:shadow-md"
          >
            View All Practice Areas
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Container>
    </section>
  )
}
