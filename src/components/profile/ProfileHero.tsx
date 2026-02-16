import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Calendar, Users, Globe, Mail, Phone, ExternalLink, ChevronRight } from 'lucide-react'

import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/button'
import type { LawFirm, Location, Media } from '@/payload-types'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface ProfileHeroProps {
  firm: LawFirm & {
    primaryLocation?: Location | number | null
    logo?: Media | number | null
    coverImage?: Media | number | null
  }
  breadcrumbs?: BreadcrumbItem[]
}

export function ProfileHero({ firm, breadcrumbs }: ProfileHeroProps) {
  const location = typeof firm.primaryLocation === 'object' ? firm.primaryLocation : null
  const logo = typeof firm.logo === 'object' ? firm.logo : null
  const coverImage = typeof firm.coverImage === 'object' ? firm.coverImage : null

  return (
    <section className="relative bg-royal-900">
      {/* Cover Image */}
      <div className="relative h-48 bg-royal-900 lg:h-64">
        {coverImage?.url && (
          <Image
            src={coverImage.url}
            alt={`${firm.name} cover`}
            fill
            className="object-cover opacity-30"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-royal-900/80 to-transparent" />
      </div>

      {/* Content Container */}
      <Container className="relative -mt-16 pb-8 lg:-mt-20">
        {/* Breadcrumbs on blue background - above white container */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="mb-6">
            <nav className="flex flex-wrap items-center gap-2 text-sm text-white">
              {breadcrumbs.map((crumb, index) => (
                <span key={index} className="flex items-center gap-2">
                  {crumb.href ? (
                    <Link href={crumb.href} className="transition-colors hover:text-white/80 text-white/90">
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
              <h1 className="font-heading text-2xl font-bold text-royal-900 lg:text-3xl">
                {firm.name}
              </h1>

              {firm.shortDescription && (
                <p className="mt-2 text-royal-700/80">{firm.shortDescription}</p>
              )}

              {/* Quick Stats */}
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-royal-700/80">
                {location && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-royal-600" />
                    <span>{location.name}, Thailand</span>
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
                {firm.languages && firm.languages.length > 0 && (
                  <div className="flex items-center gap-1.5">
                    <Globe className="h-4 w-4 text-royal-600" />
                    <span>{firm.languages.join(', ')}</span>
                  </div>
                )}
              </div>

              {/* Fee Range */}
              {firm.feeRangeMin && firm.feeRangeMax && (
                <div className="mt-4 inline-flex items-center rounded-full bg-gold-500/10 px-4 py-1.5 text-sm font-medium text-gold-600">
                  Consultation: {firm.feeRangeMin.toLocaleString()} -{' '}
                  {firm.feeRangeMax.toLocaleString()} {firm.feeCurrency || 'THB'}
                </div>
              )}
            </div>

            {/* Contact Buttons */}
            <div className="flex flex-col gap-3 lg:shrink-0">
              {firm.phone && (
                <Button asChild variant="outline" className="border-royal-200 bg-white hover:bg-royal-50">
                  <a href={`tel:${firm.phone}`}>
                    <Phone className="h-4 w-4 text-royal-700" />
                    <span className="text-royal-700">Call Now</span>
                  </a>
                </Button>
              )}
              {firm.email && (
                <Button asChild variant="outline" className="border-royal-200">
                  <a href={`mailto:${firm.email}`}>
                    <Mail className="h-4 w-4" />
                    Email
                  </a>
                </Button>
              )}
              {firm.website && (
                <Button asChild variant="ghost" className="text-royal-700/80">
                  <a href={firm.website} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                    Website
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
