import { Building2, Scale, MapPin, CheckCircle } from 'lucide-react'

import { Container } from '@/components/layout/Container'

interface TrustSignalsProps {
  counts: {
    lawFirms: number
    practiceAreas: number
    locations: number
  }
}

export function TrustSignals({ counts }: TrustSignalsProps) {
  const stats = [
    {
      icon: Building2,
      value: counts.lawFirms,
      label: 'Law Firms',
      description: 'Verified legal practices',
    },
    {
      icon: Scale,
      value: counts.practiceAreas,
      label: 'Practice Areas',
      description: 'Legal specializations',
    },
    {
      icon: MapPin,
      value: counts.locations,
      label: 'Locations',
      description: 'Cities across Thailand',
    },
  ]

  return (
    <section className="dark-surface relative overflow-hidden py-20 lg:py-28">
      <Container className="relative">
        <div className="text-center">
          <div className="mb-5 inline-flex items-center gap-2.5 rounded-full border border-gold-500/30 bg-gold-500/15 px-5 py-2 shadow-lg shadow-gold-500/10 backdrop-blur-sm">
            <CheckCircle className="h-4 w-4 text-gold-400" />
            <span className="text-sm font-semibold uppercase tracking-wider text-gold-300">Trusted Directory</span>
          </div>
          <h2 className="font-heading text-3xl font-bold text-white lg:text-4xl">
            Thailand&apos;s Most Comprehensive Legal Directory
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-white">
            We connect you with qualified legal professionals across all practice areas and locations
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-3 lg:gap-16">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="group text-center"
            >
              <div className="mx-auto mb-6 inline-flex h-18 w-18 items-center justify-center rounded-2xl border border-gold-400/20 bg-gradient-to-br from-gold-400/15 to-gold-500/25 shadow-lg shadow-gold-500/10 backdrop-blur-sm transition-all group-hover:from-gold-400/25 group-hover:to-gold-500/35 group-hover:shadow-gold-500/20">
                <stat.icon className="h-9 w-9 text-gold-400" />
              </div>
              <div className="font-heading text-5xl font-bold text-white lg:text-6xl">
                {stat.value}+
              </div>
              <div className="mt-3 text-xl font-semibold text-white">
                {stat.label}
              </div>
              <div className="mt-1.5 text-sm text-white/80">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
