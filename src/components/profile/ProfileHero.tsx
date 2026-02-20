'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import {
  MapPin,
  Calendar,
  Users,
  Globe,
  ChevronRight,
  ShieldCheck,
  Star,
  Zap,
  X,
} from 'lucide-react'

import { Container } from '@/components/layout/Container'
import type { Business, Location, Media, PracticeArea } from '@/payload-types'
import { formatFeeRange, getLanguageLabels, responseTimeBadgeLabel } from './profile-helpers'
import { AtAGlanceModal } from './AtAGlanceModal'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface ProfileHeroProps {
  firm: Business & {
    primaryLocation?: Location | number | null
    logo?: Media | number | null
    coverImage?: Media | number | null
  }
  breadcrumbs?: BreadcrumbItem[]
  practiceAreas?: PracticeArea[]
  countrySlug?: string
}

export function ProfileHero({
  firm,
  breadcrumbs,
  practiceAreas = [],
  countrySlug = '',
}: ProfileHeroProps) {
  const [showModal, setShowModal] = useState(false)
  const location = typeof firm.primaryLocation === 'object' ? firm.primaryLocation : null
  const logo = typeof firm.logo === 'object' ? firm.logo : null
  const responseTime = responseTimeBadgeLabel(firm.responseTime)
  const languageLabels = getLanguageLabels(firm.languages)
  const countryName =
    countrySlug
      ?.split('-')
      .map((segment) => `${segment.charAt(0).toUpperCase()}${segment.slice(1)}`)
      .join(' ') || 'Thailand'
  const feeRange = formatFeeRange({
    min: firm.feeRangeMin,
    max: firm.feeRangeMax,
    currency: firm.feeCurrency,
  })

  return (
    <section id="profile-hero-anchor" className="relative bg-royal-900">
      <Container className="pb-12 pt-8 lg:pb-16 lg:pt-10">
        {/* Breadcrumbs on blue background - above white container */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="mb-6">
            <nav className="flex flex-wrap items-center gap-2 text-sm text-white">
              {breadcrumbs.map((crumb, index) => (
                <span key={index} className="flex items-center gap-2">
                  {crumb.href ? (
                    <Link
                      href={crumb.href}
                      className="transition-colors hover:text-white/80 text-white/90"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-white font-medium">{crumb.label}</span>
                  )}
                  {index < breadcrumbs.length - 1 && (
                    <ChevronRight className="h-4 w-4 text-white/60" />
                  )}
                </span>
              ))}
            </nav>
          </div>
        )}
        <div className="rounded-xl border border-border/50 bg-white p-6 shadow-lg lg:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
            {/* Logo */}
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-royal-50 shadow-sm lg:h-32 lg:w-32">
              {logo?.url ? (
                <Image
                  src={logo.url}
                  alt={firm.name}
                  width={128}
                  height={128}
                  className="h-20 w-20 rounded-lg object-contain lg:h-28 lg:w-28"
                />
              ) : (
                <span className="font-heading text-4xl font-bold text-royal-700 lg:text-5xl">
                  {firm.name.charAt(0)}
                </span>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(true)}
                  className="font-heading text-2xl font-bold text-royal-900 transition-colors hover:text-royal-700 lg:text-3xl text-left"
                >
                  {firm.name}
                </button>
                {firm.listingTier && ['silver', 'gold', 'platinum'].includes(firm.listingTier) && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-gold-50 px-2 py-0.5 text-xs font-medium text-gold-600">
                    <Star className="h-3.5 w-3.5" />
                    Featured
                  </span>
                )}
                {firm.verified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Verified
                  </span>
                )}
              </div>

              {firm.tagline && (
                <p className="mt-2 text-lg font-medium text-royal-700">{firm.tagline}</p>
              )}

              {firm.shortDescription && (
                <p className="mt-2 text-royal-700/80">{firm.shortDescription}</p>
              )}

              {/* Quick Stats */}
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-royal-600">
                {location && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-royal-600" />
                    <span>{location.name}, {countryName}</span>
                  </div>
                )}
                {firm.foundingYear && (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-royal-600" />
                    <span>Est. {firm.foundingYear}</span>
                  </div>
                )}
                {firm.companySize && (
                  <div className="flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-royal-600" />
                    <span>{firm.companySize} employees</span>
                  </div>
                )}
                {languageLabels.length > 0 && (
                  <div className="flex items-center gap-1.5">
                    <Globe className="h-4 w-4 text-royal-600" />
                    <span>{languageLabels.join(', ')}</span>
                  </div>
                )}
                {responseTime && (
                  <div className="flex items-center gap-1.5">
                    <Zap className="h-4 w-4 text-royal-600" />
                    <span>{responseTime}</span>
                  </div>
                )}
              </div>

              {/* Fee Range */}
              {feeRange && (
                <div className="mt-4 inline-flex items-center rounded-full bg-gold-500/10 px-4 py-1.5 text-sm font-medium text-gold-600">
                  Consultation: {feeRange}
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
      {showModal && (
        <AtAGlanceModal
          firm={firm}
          practiceAreas={practiceAreas}
          countrySlug={countrySlug}
          onClose={() => setShowModal(false)}
        />
      )}
    </section>
  )
}
