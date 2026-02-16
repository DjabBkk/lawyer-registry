import { LawFirmCard } from './LawFirmCard'
import type { LawFirm, PracticeArea, Location, Media } from '@/payload-types'

interface LawFirmGridProps {
  firms: Array<LawFirm & {
    practiceAreas?: PracticeArea[] | number[]
    primaryLocation?: Location | number | null
    logo?: Media | number | null
  }>
  emptyMessage?: string
}

export function LawFirmGrid({ firms, emptyMessage = 'No law firms found.' }: LawFirmGridProps) {
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
        <LawFirmCard key={firm.id} firm={firm} />
      ))}
    </div>
  )
}
