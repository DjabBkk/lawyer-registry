'use client'

import { useMemo } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { X } from 'lucide-react'

import { SortSelect } from './SortSelect'

interface ResultsToolbarProps {
  shown: number
  total: number
  sortValue: string
  practiceAreas?: Array<{ id: number | string; name: string; slug: string }>
  locations?: Array<{ id: number | string; name: string; slug: string }>
}

const sizeLabels: Record<string, string> = {
  '1-5': '1-5 employees',
  '6-10': '6-10 employees',
  '11-25': '11-25 employees',
  '26-50': '26-50 employees',
  '51-100': '51-100 employees',
  '100+': '100+ employees',
}

const languageLabels: Record<string, string> = {
  English: 'English',
  Thai: 'Thai',
  Chinese: 'Chinese',
  Japanese: 'Japanese',
  German: 'German',
}

const feeLabels: Record<string, string> = {
  'under-2000': 'Under ฿2,000',
  '2000-5000': '฿2,000 - ฿5,000',
  '5000-10000': '฿5,000 - ฿10,000',
  '10000-25000': '฿10,000 - ฿25,000',
  '25000-plus': '฿25,000+',
}

export function ResultsToolbar({
  shown,
  total,
  sortValue,
  practiceAreas = [],
  locations = [],
}: ResultsToolbarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const practiceAreaMap = useMemo(
    () => new Map(practiceAreas.map((option) => [option.slug, option.name])),
    [practiceAreas],
  )
  const locationMap = useMemo(
    () => new Map(locations.map((option) => [option.slug, option.name])),
    [locations],
  )

  const activeFilters = useMemo(() => {
    const entries: Array<{ key: string; value?: string; label: string }> = []
    const parseList = (key: string) =>
      (searchParams.get(key) || '')
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean)

    parseList('practiceAreas').forEach((slug) => {
      entries.push({
        key: 'practiceAreas',
        value: slug,
        label: practiceAreaMap.get(slug) || slug.replace(/-/g, ' '),
      })
    })

    parseList('locations').forEach((slug) => {
      entries.push({
        key: 'locations',
        value: slug,
        label: locationMap.get(slug) || slug.replace(/-/g, ' '),
      })
    })

    parseList('languages').forEach((language) => {
      entries.push({
        key: 'languages',
        value: language,
        label: languageLabels[language] || language,
      })
    })

    parseList('size').forEach((size) => {
      entries.push({
        key: 'size',
        value: size,
        label: sizeLabels[size] || size,
      })
    })

    parseList('feeRange').forEach((range) => {
      entries.push({
        key: 'feeRange',
        value: range,
        label: feeLabels[range] || range,
      })
    })

    if (searchParams.get('verified') === 'true') {
      entries.push({ key: 'verified', label: 'Verified firms only' })
    }

    if (searchParams.get('hasPricing') === 'true') {
      entries.push({ key: 'hasPricing', label: 'Shows pricing' })
    }

    return entries
  }, [locationMap, practiceAreaMap, searchParams])

  const removeFilter = (key: string, value?: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      const nextValues = (params.get(key) || '')
        .split(',')
        .map((entry) => entry.trim())
        .filter(Boolean)
        .filter((entry) => entry !== value)

      if (nextValues.length) {
        params.set(key, nextValues.join(','))
      } else {
        params.delete(key)
      }
    } else {
      params.delete(key)
    }

    params.delete('page')
    const query = params.toString()
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }

  const clearAllFilters = () => {
    const params = new URLSearchParams(searchParams.toString())
    ;['practiceAreas', 'locations', 'languages', 'size', 'feeRange', 'verified', 'hasPricing', 'page'].forEach(
      (key) => params.delete(key),
    )

    const query = params.toString()
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }

  return (
    <div className="mb-6 space-y-3 rounded-lg border border-warm-200 bg-white px-4 py-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-royal-700/80">
          Showing {shown} of {total} firms
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-royal-700/70">Sort by:</span>
          <SortSelect value={sortValue} />
        </div>
      </div>

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {activeFilters.map((filter) => (
            <button
              key={`${filter.key}-${filter.value || 'toggle'}`}
              type="button"
              onClick={() => removeFilter(filter.key, filter.value)}
              className="inline-flex items-center gap-1 rounded-full border border-royal-200 bg-royal-50 px-2.5 py-1 text-xs font-medium text-royal-700 hover:bg-royal-100"
            >
              <span>{filter.label}</span>
              <X className="h-3.5 w-3.5" />
            </button>
          ))}
          {activeFilters.length >= 2 && (
            <button
              type="button"
              onClick={clearAllFilters}
              className="text-xs font-medium text-royal-700 hover:text-royal-900"
            >
              Clear all
            </button>
          )}
        </div>
      )}
    </div>
  )
}
