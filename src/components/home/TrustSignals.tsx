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
    <section className="relative overflow-hidden bg-gradient-to-br from-royal-950 via-royal-800 to-royal-700 py-20 lg:py-28">
      {/* Warm gold accent overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-gold-500/8 to-gold-400/12 pointer-events-none" />
      
      {/* Subtle pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      
      <Container className="relative">
        <div className="text-center">
          <div className="mb-5 inline-flex items-center gap-2.5 rounded-full border border-gold-500/30 bg-gold-500/15 px-5 py-2 shadow-lg shadow-gold-500/10 backdrop-blur-sm">
            <CheckCircle className="h-4 w-4 text-gold-400" />
            <span className="text-sm font-semibold uppercase tracking-wider text-gold-300">Trusted Directory</span>
          </div>
          <h2 className="font-heading text-3xl font-bold text-white lg:text-4xl">
            Thailand&apos;s Most Comprehensive Legal Directory
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-cream-200">
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
              <div className="mt-1.5 text-sm text-cream-200/70">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
