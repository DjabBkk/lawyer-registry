import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Users, Globe, ArrowRight, Building2 } from 'lucide-react'

import { cn } from '@/utilities/ui'
import { Button } from '@/components/ui/button'
import type { LawFirm, PracticeArea, Location, Media } from '@/payload-types'

interface LawFirmCardProps {
  firm: LawFirm & {
    practiceAreas?: PracticeArea[] | number[]
    primaryLocation?: Location | number | null
    logo?: Media | number | null
    coverImage?: Media | number | null
  }
  variant?: 'default' | 'featured' | 'compact'
}

export function LawFirmCard({ firm, variant = 'default' }: LawFirmCardProps) {
  const practiceAreas = firm.practiceAreas?.filter(
    (pa): pa is PracticeArea => typeof pa !== 'number'
  ) || []
  
  const location = typeof firm.primaryLocation === 'object' ? firm.primaryLocation : null
  const logo = typeof firm.logo === 'object' ? firm.logo : null
  const coverImage = typeof firm.coverImage === 'object' ? firm.coverImage : null
  
  const displayedPracticeAreas = practiceAreas.slice(0, 3)
  const remainingCount = practiceAreas.length - 3

  // Compact variant - simple row
  if (variant === 'compact') {
    return (
      <Link
        href={`/thailand/lawyers/${firm.slug}`}
        className="group flex items-center gap-4 rounded-xl border border-warm-200 bg-cream-50 p-4 transition-all duration-300 hover:border-royal-300 hover:bg-white hover:shadow-md"
      >
        {/* Logo */}
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-royal-700 to-royal-800">
          {logo?.url ? (
            <Image
              src={logo.url}
              alt={firm.name}
              width={48}
              height={48}
              className="h-10 w-10 rounded-lg object-contain bg-white p-1"
            />
          ) : (
            <Building2 className="h-6 w-6 text-cream-200" />
          )}
        </div>

        {/* Content */}
          <div className="min-w-0 flex-1">
          <h3 className="truncate font-heading text-lg font-semibold text-royal-900 group-hover:text-royal-700">
            {firm.name}
          </h3>
          {location && (
            <p className="flex items-center gap-1.5 text-sm text-warm-500">
              <MapPin className="h-3.5 w-3.5" />
              {location.name}
            </p>
          )}
        </div>

        <ArrowRight className="h-5 w-5 text-warm-400 transition-all group-hover:translate-x-1 group-hover:text-royal-600" />
      </Link>
    )
  }

  // Default & Featured - Horizontal layout with photo
  return (
    <div
      className={cn(
        'group overflow-hidden rounded-2xl border transition-all duration-300',
        variant === 'featured' 
          ? 'border-gold-400/60 bg-cream-50 shadow-lg shadow-gold-500/10 hover:shadow-xl hover:shadow-gold-500/15 ring-1 ring-gold-400/30' 
          : 'border-warm-200 bg-cream-50 shadow-sm hover:shadow-lg hover:border-royal-300',
      )}
    >
      {/* Featured Badge */}
      {variant === 'featured' && firm.featured && (
        <div className="bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500 px-4 py-2.5 text-center">
          <span className="text-sm font-bold uppercase tracking-wider text-royal-950">
            Featured Firm
          </span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row">
        {/* Photo Section - 1/3 width */}
        <div className="relative w-full sm:w-1/3 aspect-[4/3] sm:aspect-auto sm:min-h-[240px]">
          {coverImage?.url ? (
            <Image
              src={coverImage.url}
              alt={firm.name}
              fill
              className="object-cover"
            />
          ) : (
            // Full-size placeholder with warm Königsblau
            <div className="absolute inset-0 bg-gradient-to-br from-royal-800 via-royal-700 to-royal-600">
              {/* Warm gold accent overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-gold-500/5 to-gold-400/10" />
              
              {/* Subtle geometric pattern */}
              <div 
                className="absolute inset-0 opacity-[0.05]"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M20 20h20v20H20V20zm0-20h20v20H20V0zM0 20h20v20H0V20zM0 0h20v20H0V0z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
              />
              
              {/* Centered logo/initial */}
              <div className="absolute inset-0 flex items-center justify-center">
                {logo?.url ? (
                  <div className="rounded-xl bg-white/95 p-4 shadow-lg">
                    <Image
                      src={logo.url}
                      alt={firm.name}
                      width={72}
                      height={72}
                      className="h-16 w-16 object-contain"
                    />
                  </div>
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm">
                    <span className="font-heading text-5xl font-bold text-white/60">
                      {firm.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Content Section - 2/3 width */}
        <div className="flex flex-1 flex-col bg-white p-6 sm:p-7">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <Link href={`/thailand/lawyers/${firm.slug}`}>
                <h3 className="font-heading text-xl font-bold text-royal-900 transition-colors group-hover:text-royal-700 sm:text-2xl">
                  {firm.name}
                </h3>
              </Link>
              
              {/* Quick Stats */}
              <div className="mt-2.5 flex flex-wrap items-center gap-4 text-sm text-warm-500">
                {firm.companySize && (
                  <span className="flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-warm-400" />
                    {firm.companySize}
                  </span>
                )}
                {location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-warm-400" />
                    {location.name}
                  </span>
                )}
                {firm.languages && firm.languages.length > 0 && (
                  <span className="flex items-center gap-1.5">
                    <Globe className="h-4 w-4 text-warm-400" />
                    {firm.languages.slice(0, 2).join(', ')}
                    {firm.languages.length > 2 && ` +${firm.languages.length - 2}`}
                  </span>
                )}
              </div>
            </div>

            {/* Website icon - desktop */}
            {firm.website && (
              <a
                href={firm.website}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden shrink-0 rounded-full border border-warm-200 bg-cream-100 p-2.5 text-warm-500 transition-all hover:border-royal-300 hover:bg-royal-50 hover:text-royal-600 sm:block"
              >
                <Globe className="h-5 w-5" />
              </a>
            )}
          </div>

          {/* Practice Area Badges - Premium styling via CSS class */}
          {displayedPracticeAreas.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {displayedPracticeAreas.map((area) => (
                <Link
                  key={area.id}
                  href={`/thailand/lawyers/${area.slug}`}
                  className="practice-badge"
                >
                  {area.name}
                </Link>
              ))}
              {remainingCount > 0 && (
                <span className="inline-flex items-center rounded-lg border border-warm-200 bg-warm-100 px-3 py-1.5 text-sm font-medium text-warm-600">
                  +{remainingCount} more
                </span>
              )}
            </div>
          )}

          {/* Description */}
          {firm.shortDescription && (
            <p className="mt-4 line-clamp-2 flex-1 leading-relaxed text-warm-600">
              {firm.shortDescription}
            </p>
          )}

          {/* CTA */}
          <div className="mt-6 flex items-center gap-3">
            <Button
              asChild
              variant="outline"
              className="flex-1 border-royal-300 bg-royal-50/50 font-semibold text-royal-700 hover:border-royal-400 hover:bg-royal-100"
            >
              <Link href={`/thailand/lawyers/${firm.slug}`}>
                View Profile
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            {firm.website && (
              <Button
                asChild
                variant="outline"
                className="border-warm-200 text-warm-500 hover:border-royal-300 hover:bg-royal-50 hover:text-royal-700 sm:hidden"
              >
                <a href={firm.website} target="_blank" rel="noopener noreferrer">
                  <Globe className="h-5 w-5" />
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
