'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'

interface SortSelectProps {
  defaultValue: string
}

export function SortSelect({ defaultValue }: SortSelectProps) {
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
      defaultValue={defaultValue}
      onChange={handleChange}
      className="rounded-lg border border-border bg-white px-3 py-1.5 text-sm"
    >
      <option value="-featured">Featured</option>
      <option value="name">Name (A-Z)</option>
      <option value="-name">Name (Z-A)</option>
      <option value="-createdAt">Newest</option>
    </select>
  )
}
