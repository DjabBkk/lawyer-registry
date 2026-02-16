'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'

interface SortSelectProps {
  value: string
}

export function SortSelect({ value }: SortSelectProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', e.target.value)
    params.delete('page') // Reset to page 1 when sorting changes
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <select
      value={value}
      onChange={handleChange}
      className="rounded-lg border border-warm-200 bg-white px-3 py-1.5 text-sm text-royal-900"
    >
      <option value="-featured">Most Relevant</option>
      <option value="fee-asc">Lowest Consultation Fee</option>
      <option value="rating-desc" disabled>
        Highest Rated (Coming Soon)
      </option>
      <option value="newest">Newest Listed</option>
      <option value="name-asc">A-Z</option>
    </select>
  )
}
