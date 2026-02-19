import { BusinessCard } from './BusinessCard'
import type { Business, PracticeArea, Location, Media } from '@/payload-types'

interface BusinessGridProps {
  firms: Array<Business & {
    practiceAreas?: PracticeArea[] | number[]
    primaryLocation?: Location | number | null
    logo?: Media | number | null
  }>
  countrySlug: string
  emptyMessage?: string
}

export function BusinessGrid({
  firms,
  countrySlug,
  emptyMessage = 'No law firms found.',
}: BusinessGridProps) {
  if (!firms.length) {
    return (
      <div className="rounded-xl border border-border/50 bg-white p-12 text-center">
        <p className="text-royal-700/80">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {firms.map((firm) => (
        <BusinessCard key={firm.id} firm={firm} countrySlug={countrySlug} />
      ))}
    </div>
  )
}
