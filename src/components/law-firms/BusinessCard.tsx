import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Users, Globe, ArrowRight, Building2 } from 'lucide-react'

import { cn } from '@/utilities/ui'
import { Button } from '@/components/ui/button'
import type { Business, PracticeArea, Location, Media } from '@/payload-types'
import { getBusinessUrl } from '@/utilities/getBusinessUrl'
import { getLanguageLabels } from '@/components/profile/profile-helpers'

interface BusinessCardProps {
  firm: Business & {
    practiceAreas?: PracticeArea[] | number[]
    primaryLocation?: Location | number | null
    logo?: Media | number | null
    coverImage?: Media | number | null
  }
  countrySlug: string
  variant?: 'default' | 'featured' | 'compact' | 'grid'
}

export function BusinessCard({ firm, countrySlug, variant = 'default' }: BusinessCardProps) {
  const practiceAreas = firm.practiceAreas?.filter((pa): pa is PracticeArea => typeof pa !== 'number') || []
  const profileUrl = getBusinessUrl(firm, countrySlug)

  const location = typeof firm.primaryLocation === 'object' ? firm.primaryLocation : null
  const logo = typeof firm.logo === 'object' ? firm.logo : null
  const coverImage = typeof firm.coverImage === 'object' ? firm.coverImage : null
  const languageLabels = getLanguageLabels(firm.languages)

  // ─── Image placeholder shared across variants ───
  const ImagePlaceholder = ({
    className,
    size = 'md',
  }: {
    className?: string
    size?: 'sm' | 'md' | 'lg'
  }) => (
    <div className={cn('relative bg-gradient-to-br from-royal-800 via-royal-700 to-royal-600', className)}>
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-gold-500/5 to-gold-400/10" />
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M20 20h20v20H20V20zm0-20h20v20H20V0zM0 20h20v20H0V20zM0 0h20v20H0V0z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        {logo?.url ? (
          <Image
            src={logo.url}
            alt={firm.name}
            width={size === 'lg' ? 80 : size === 'md' ? 64 : 48}
            height={size === 'lg' ? 80 : size === 'md' ? 64 : 48}
            className="rounded-xl bg-white/95 object-contain p-2 shadow-lg"
          />
        ) : (
          <span
            className={cn(
              'font-heading font-bold text-cream-200/25',
              size === 'lg' ? 'text-8xl' : size === 'md' ? 'text-7xl' : 'text-5xl',
            )}
          >
            {firm.name.charAt(0)}
          </span>
        )}
      </div>
    </div>
  )

  // ─── Practice area badges (transparent with subtle border) ───
  const PracticeAreaBadges = ({ max = 3 }: { max?: number }) => {
    const shown = practiceAreas.slice(0, max)
    const extra = practiceAreas.length - max
    if (!shown.length) return null
    return (
      <div className="flex flex-wrap gap-1.5">
        {shown.map((area) => (
          <Link
            key={area.id}
            href={`/${countrySlug}/lawyers/${area.slug}`}
            className="inline-flex items-center rounded-full border border-warm-300 bg-transparent px-2.5 py-0.5 text-xs font-medium text-royal-800 transition-colors hover:border-royal-400 hover:bg-royal-50 hover:text-royal-900"
          >
            {area.name}
          </Link>
        ))}
        {extra > 0 && (
          <span className="inline-flex items-center rounded-full border border-royal-200 bg-transparent px-2.5 py-0.5 text-xs font-medium text-royal-700/80">
            +{extra} more
          </span>
        )}
      </div>
    )
  }

  // ─── Compact variant ───
  if (variant === 'compact') {
    return (
      <Link
        href={profileUrl}
        className="group flex items-center gap-4 rounded-xl border border-warm-200 bg-white p-4 transition-all duration-300 hover:border-royal-300 hover:shadow-md"
      >
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-royal-700 to-royal-800">
          {logo?.url ? (
            <Image
              src={logo.url}
              alt={firm.name}
              width={40}
              height={40}
              className="h-8 w-8 rounded-md object-contain bg-white p-0.5"
            />
          ) : (
            <Building2 className="h-5 w-5 text-cream-200" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-heading text-base font-semibold text-royal-900 group-hover:text-royal-700">
            {firm.name}
          </h3>
          {location && (
            <p className="flex items-center gap-1 text-sm text-gold-600">
              <MapPin className="h-3 w-3 text-gold-500" />
              {location.name}
            </p>
          )}
        </div>
        <ArrowRight className="h-4 w-4 shrink-0 text-royal-400 transition-all group-hover:translate-x-1 group-hover:text-royal-600" />
      </Link>
    )
  }

  // ─── Grid variant (vertical card for 3-column homepage grid) ───
  if (variant === 'grid') {
    return (
      <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-warm-200 bg-white shadow-sm transition-all duration-300 hover:border-royal-200 hover:shadow-lg">
        <div className="relative aspect-[16/10] w-full flex-shrink-0 overflow-hidden">
          {coverImage?.url ? (
            <Image
              src={coverImage.url}
              alt={firm.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <ImagePlaceholder className="absolute inset-0" size="md" />
          )}
          {firm.featured && (
            <div className="absolute left-3 top-3">
              <span className="inline-flex items-center rounded-full bg-gold-500/90 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-royal-950 shadow-sm backdrop-blur-sm">
                Featured
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-heading text-lg font-bold text-royal-900 group-hover:text-royal-700">
                {firm.name}
              </h3>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                {firm.companySize && (
                  <span className="flex items-center gap-1 text-gold-600">
                    <Users className="h-3.5 w-3.5 text-gold-500" />
                    {firm.companySize}
                  </span>
                )}
                {location && (
                  <span className="flex items-center gap-1 text-gold-600">
                    <MapPin className="h-3.5 w-3.5 text-gold-500" />
                    {location.name}
                  </span>
                )}
              </div>
            </div>
            {firm.website && (
              <a
                href={firm.website}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 rounded-full border border-royal-200 p-2 text-royal-500 transition-all hover:border-royal-300 hover:bg-royal-50 hover:text-royal-600"
              >
                <Globe className="h-4 w-4" />
              </a>
            )}
          </div>

          <div className="mt-3">
            <PracticeAreaBadges max={3} />
          </div>

          {firm.shortDescription && (
            <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-royal-900">
              {firm.shortDescription}
            </p>
          )}

          <div className="mt-auto pt-4 border-t border-warm-100">
            <Link
              href={profileUrl}
              className="group/link flex items-center justify-center gap-2 rounded-lg border border-royal-200 bg-royal-50/50 px-4 py-2.5 text-sm font-semibold text-royal-700 transition-all hover:border-royal-300 hover:bg-royal-100"
            >
              View Profile
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'group overflow-hidden rounded-2xl border transition-all duration-300',
        variant === 'featured'
          ? 'border-gold-400/40 bg-white shadow-md shadow-gold-500/5 hover:shadow-lg hover:shadow-gold-500/10'
          : 'border-warm-200 bg-white shadow-sm hover:shadow-lg hover:border-royal-200',
      )}
    >
      {variant === 'featured' && firm.featured && (
        <div className="bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500 px-4 py-2 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-royal-950">
            Featured Firm
          </span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row">
        <div className="relative w-full sm:w-1/3 aspect-[4/3] sm:aspect-auto sm:min-h-[220px]">
          {coverImage?.url ? (
            <Image
              src={coverImage.url}
              alt={firm.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 28vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <ImagePlaceholder className="absolute inset-0" size="lg" />
          )}
        </div>

        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="font-heading text-xl font-bold text-royal-900 group-hover:text-royal-700 lg:text-2xl">
                {firm.name}
              </h3>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                {firm.companySize && (
                  <span className="flex items-center gap-1.5 text-gold-600">
                    <Users className="h-4 w-4 text-gold-500" />
                    {firm.companySize}
                  </span>
                )}
                {location && (
                  <span className="flex items-center gap-1.5 text-gold-600">
                    <MapPin className="h-4 w-4 text-gold-500" />
                    {location.name}
                  </span>
                )}
                {languageLabels.length > 0 && (
                  <span className="flex items-center gap-1.5">
                    <Globe className="h-4 w-4 text-royal-500" />
                    {languageLabels.slice(0, 2).join(', ')}
                    {languageLabels.length > 2 && ` +${languageLabels.length - 2}`}
                  </span>
                )}
              </div>
            </div>

            {firm.website && (
              <a
                href={firm.website}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden shrink-0 rounded-full border border-royal-200 p-2.5 text-royal-500 transition-all hover:border-royal-300 hover:bg-royal-50 hover:text-royal-600 sm:block"
              >
                <Globe className="h-5 w-5" />
              </a>
            )}
          </div>

          <div className="mt-4">
            <PracticeAreaBadges max={4} />
          </div>

          {firm.shortDescription && (
            <p className="mt-3 line-clamp-2 flex-1 text-sm leading-relaxed text-royal-900">
              {firm.shortDescription}
            </p>
          )}

          <div className="mt-5 flex items-center gap-3">
            <Button
              asChild
              variant="outline"
              className="flex-1 border-royal-200 bg-royal-50/50 text-sm font-semibold text-royal-700 hover:border-royal-300 hover:bg-royal-100"
            >
              <Link href={profileUrl}>
                View Profile
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
