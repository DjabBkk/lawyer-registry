'use client'

import { useEffect, useMemo, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ChevronDown, ChevronUp, Filter, ShieldCheck } from 'lucide-react'

import { cn } from '@/utilities/ui'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

interface FilterOption {
  id: number | string
  name: string
  slug: string
}

interface FilterSidebarProps {
  practiceAreas?: FilterOption[]
  locations?: FilterOption[]
  languageCounts?: Record<string, number>
  showPracticeAreas?: boolean
  showLocations?: boolean
  className?: string
}

type FilterState = {
  practiceAreas: string[]
  locations: string[]
  size: string[]
  languages: string[]
  feeRange: string[]
  verified: boolean
  hasPricing: boolean
}

const companySizes = [
  { value: '1-5', label: '1-5 employees' },
  { value: '6-10', label: '6-10 employees' },
  { value: '11-25', label: '11-25 employees' },
  { value: '26-50', label: '26-50 employees' },
  { value: '51-100', label: '51-100 employees' },
  { value: '100+', label: '100+ employees' },
]

const feeRangeOptions = [
  { value: 'under-2000', label: 'Under ฿2,000' },
  { value: '2000-5000', label: '฿2,000 - ฿5,000' },
  { value: '5000-10000', label: '฿5,000 - ฿10,000' },
  { value: '10000-25000', label: '฿10,000 - ฿25,000' },
  { value: '25000-plus', label: '฿25,000+' },
]

const filterKeys = [
  'practiceAreas',
  'locations',
  'size',
  'languages',
  'feeRange',
  'verified',
  'hasPricing',
  'page',
] as const

const parseList = (value: string | null) =>
  (value || '')
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)

const getFilterStateFromSearchParams = (searchParams: URLSearchParams): FilterState => ({
  practiceAreas: parseList(searchParams.get('practiceAreas')),
  locations: parseList(searchParams.get('locations')),
  size: parseList(searchParams.get('size')),
  languages: parseList(searchParams.get('languages')),
  feeRange: parseList(searchParams.get('feeRange')),
  verified: searchParams.get('verified') === 'true',
  hasPricing: searchParams.get('hasPricing') === 'true',
})

const buildParamsFromState = (state: FilterState, searchParams: URLSearchParams) => {
  const params = new URLSearchParams(searchParams.toString())

  if (state.practiceAreas.length) params.set('practiceAreas', state.practiceAreas.join(','))
  else params.delete('practiceAreas')

  if (state.locations.length) params.set('locations', state.locations.join(','))
  else params.delete('locations')

  if (state.size.length) params.set('size', state.size.join(','))
  else params.delete('size')

  if (state.languages.length) params.set('languages', state.languages.join(','))
  else params.delete('languages')

  if (state.feeRange.length) params.set('feeRange', state.feeRange.join(','))
  else params.delete('feeRange')

  if (state.verified) params.set('verified', 'true')
  else params.delete('verified')

  if (state.hasPricing) params.set('hasPricing', 'true')
  else params.delete('hasPricing')

  params.delete('page')
  return params
}

const createEmptyState = (): FilterState => ({
  practiceAreas: [],
  locations: [],
  size: [],
  languages: [],
  feeRange: [],
  verified: false,
  hasPricing: false,
})

const getActiveFilterCount = (state: FilterState) =>
  state.practiceAreas.length +
  state.locations.length +
  state.size.length +
  state.languages.length +
  state.feeRange.length +
  (state.verified ? 1 : 0) +
  (state.hasPricing ? 1 : 0)

export function FilterSidebar({
  practiceAreas = [],
  locations = [],
  languageCounts = {},
  showPracticeAreas = true,
  showLocations = true,
  className,
}: FilterSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const selectedState = useMemo(
    () => getFilterStateFromSearchParams(searchParams),
    [searchParams],
  )

  const languageOptions = useMemo(
    () =>
      Object.keys(languageCounts)
        .sort((a, b) => a.localeCompare(b))
        .map((language) => ({ value: language, label: language })),
    [languageCounts],
  )

  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [mobileDraftState, setMobileDraftState] = useState<FilterState>(selectedState)

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    practiceAreas: true,
    locations: true,
    languages: true,
    feeRange: true,
    size: false,
  })

  useEffect(() => {
    if (!isMobileOpen) {
      setMobileDraftState(selectedState)
    }
  }, [isMobileOpen, selectedState])

  const pushParams = (params: URLSearchParams) => {
    const query = params.toString()
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }

  const clearAllFilters = (isMobile = false) => {
    if (isMobile) {
      setMobileDraftState(createEmptyState())
      const params = new URLSearchParams(searchParams.toString())
      filterKeys.forEach((key) => params.delete(key))
      pushParams(params)
      setIsMobileOpen(false)
      return
    }

    const params = new URLSearchParams(searchParams.toString())
    filterKeys.forEach((key) => params.delete(key))
    pushParams(params)
  }

  const applyDesktopState = (nextState: FilterState) => {
    const params = buildParamsFromState(nextState, searchParams)
    pushParams(params)
  }

  const toggleDesktopArray = (key: keyof Pick<FilterState, 'practiceAreas' | 'locations' | 'size' | 'languages' | 'feeRange'>, value: string) => {
    const current = selectedState[key]
    const next = current.includes(value)
      ? current.filter((entry) => entry !== value)
      : [...current, value]

    applyDesktopState({ ...selectedState, [key]: next })
  }

  const toggleDesktopBoolean = (key: keyof Pick<FilterState, 'verified' | 'hasPricing'>) => {
    applyDesktopState({ ...selectedState, [key]: !selectedState[key] })
  }

  const toggleMobileArray = (key: keyof Pick<FilterState, 'practiceAreas' | 'locations' | 'size' | 'languages' | 'feeRange'>, value: string) => {
    setMobileDraftState((prev) => {
      const current = prev[key]
      const next = current.includes(value)
        ? current.filter((entry) => entry !== value)
        : [...current, value]
      return { ...prev, [key]: next }
    })
  }

  const toggleMobileBoolean = (key: keyof Pick<FilterState, 'verified' | 'hasPricing'>) => {
    setMobileDraftState((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const applyMobileFilters = () => {
    const params = buildParamsFromState(mobileDraftState, searchParams)
    pushParams(params)
    setIsMobileOpen(false)
  }

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const FilterSection = ({
    title,
    sectionKey,
    children,
  }: {
    title: string
    sectionKey: string
    children: React.ReactNode
  }) => (
    <div className="border-b border-warm-200 py-4 last:border-b-0">
      <button
        type="button"
        onClick={() => toggleSection(sectionKey)}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="font-semibold text-royal-900">{title}</span>
        {expandedSections[sectionKey] ? (
          <ChevronUp className="h-4 w-4 text-royal-400" />
        ) : (
          <ChevronDown className="h-4 w-4 text-royal-400" />
        )}
      </button>
      {expandedSections[sectionKey] && <div className="mt-4 space-y-3">{children}</div>}
    </div>
  )

  const renderFilterContent = ({
    state,
    onToggleArray,
    onToggleBoolean,
    onClearAll,
    activeCount,
    idPrefix,
  }: {
    state: FilterState
    onToggleArray: (
      key: keyof Pick<FilterState, 'practiceAreas' | 'locations' | 'size' | 'languages' | 'feeRange'>,
      value: string,
    ) => void
    onToggleBoolean: (key: keyof Pick<FilterState, 'verified' | 'hasPricing'>) => void
    onClearAll: () => void
    activeCount: number
    idPrefix: string
  }) => (
    <>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-royal-700" />
          <h3 className="font-heading text-lg font-semibold text-royal-900">Filters</h3>
          {activeCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-royal-700 text-xs font-medium text-white">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="h-auto p-0 text-sm text-royal-700/70 hover:text-royal-900"
          >
            Clear all
          </Button>
        )}
      </div>

      <div className="mb-4 rounded-lg border border-royal-100 bg-royal-50/60 p-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-royal-600" />
          <Label
            htmlFor={`${idPrefix}-verified-toggle`}
            className="cursor-pointer text-sm font-medium text-royal-800"
          >
            Verified firms only
          </Label>
        </div>
        <div className="mt-2">
          <Checkbox
            id={`${idPrefix}-verified-toggle`}
            checked={state.verified}
            onCheckedChange={() => onToggleBoolean('verified')}
          />
        </div>
      </div>

      {showPracticeAreas && practiceAreas.length > 0 && (
        <FilterSection title="Practice Areas" sectionKey="practiceAreas">
          <div className="max-h-48 space-y-2 overflow-y-auto">
            {practiceAreas.map((area) => (
              <div key={area.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`${idPrefix}-pa-${area.slug}`}
                  checked={state.practiceAreas.includes(area.slug)}
                  onCheckedChange={() => onToggleArray('practiceAreas', area.slug)}
                />
                <Label htmlFor={`${idPrefix}-pa-${area.slug}`} className="cursor-pointer text-sm text-royal-800">
                  {area.name}
                </Label>
              </div>
            ))}
          </div>
        </FilterSection>
      )}

      {showLocations && locations.length > 0 && (
        <FilterSection title="Locations" sectionKey="locations">
          <div className="max-h-48 space-y-2 overflow-y-auto">
            {locations.map((location) => (
              <div key={location.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`${idPrefix}-loc-${location.slug}`}
                  checked={state.locations.includes(location.slug)}
                  onCheckedChange={() => onToggleArray('locations', location.slug)}
                />
                <Label
                  htmlFor={`${idPrefix}-loc-${location.slug}`}
                  className="cursor-pointer text-sm text-royal-800"
                >
                  {location.name}
                </Label>
              </div>
            ))}
          </div>
        </FilterSection>
      )}

      <FilterSection title="Languages" sectionKey="languages">
        <div className="space-y-2">
          {languageOptions.map((language) => {
            const count = languageCounts[language.value]
            const countSuffix = typeof count === 'number' ? ` (${count})` : ''

            return (
              <div key={language.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`${idPrefix}-lang-${language.value}`}
                  checked={state.languages.includes(language.value)}
                  onCheckedChange={() => onToggleArray('languages', language.value)}
                />
                <Label
                  htmlFor={`${idPrefix}-lang-${language.value}`}
                  className="cursor-pointer text-sm text-royal-800"
                >
                  {language.label}
                  {countSuffix}
                </Label>
              </div>
            )
          })}
        </div>
      </FilterSection>

      <FilterSection title="Consultation Fee" sectionKey="feeRange">
        <div className="space-y-2">
          {feeRangeOptions.map((range) => (
            <div key={range.value} className="flex items-center space-x-2">
              <Checkbox
                id={`${idPrefix}-fee-${range.value}`}
                checked={state.feeRange.includes(range.value)}
                onCheckedChange={() => onToggleArray('feeRange', range.value)}
              />
              <Label
                htmlFor={`${idPrefix}-fee-${range.value}`}
                className="cursor-pointer text-sm text-royal-800"
              >
                {range.label}
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>

      <div className="border-b border-warm-200 py-4">
        <div className="flex items-center gap-2">
          <Checkbox
            id={`${idPrefix}-has-pricing-toggle`}
            checked={state.hasPricing}
            onCheckedChange={() => onToggleBoolean('hasPricing')}
          />
          <Label
            htmlFor={`${idPrefix}-has-pricing-toggle`}
            className="cursor-pointer text-sm font-medium text-royal-800"
          >
            Shows pricing
          </Label>
        </div>
      </div>

      <FilterSection title="Company Size" sectionKey="size">
        <div className="space-y-2">
          {companySizes.map((size) => (
            <div key={size.value} className="flex items-center space-x-2">
              <Checkbox
                id={`${idPrefix}-size-${size.value}`}
                checked={state.size.includes(size.value)}
                onCheckedChange={() => onToggleArray('size', size.value)}
              />
              <Label
                htmlFor={`${idPrefix}-size-${size.value}`}
                className="cursor-pointer text-sm text-royal-800"
              >
                {size.label}
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>
    </>
  )

  const selectedActiveCount = getActiveFilterCount(selectedState)
  const mobileActiveCount = getActiveFilterCount(mobileDraftState)

  return (
    <>
      <div className="mb-4 lg:hidden">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setMobileDraftState(selectedState)
            setIsMobileOpen(true)
          }}
          className="inline-flex items-center gap-2 border-royal-200 bg-white text-royal-700"
        >
          <Filter className="h-4 w-4" />
          Filters
          {selectedActiveCount > 0 && (
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-royal-700 px-1 text-xs font-medium text-white">
              {selectedActiveCount}
            </span>
          )}
        </Button>
      </div>

      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsMobileOpen(false)}
            aria-label="Close filters"
          />
          <div className="absolute inset-y-0 left-0 w-[90vw] max-w-sm overflow-y-auto bg-white p-5 shadow-xl">
            {renderFilterContent({
              state: mobileDraftState,
              onToggleArray: toggleMobileArray,
              onToggleBoolean: toggleMobileBoolean,
              onClearAll: () => clearAllFilters(true),
              activeCount: mobileActiveCount,
              idPrefix: 'mobile',
            })}

            <div className="sticky bottom-0 mt-6 border-t border-warm-200 bg-white pt-4">
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => clearAllFilters(true)}
                  className="flex-1 border-royal-200 text-royal-700"
                >
                  Clear All
                </Button>
                <Button
                  type="button"
                  onClick={applyMobileFilters}
                  className="flex-1 bg-gradient-to-r from-gold-500 to-gold-600 text-white hover:from-gold-400 hover:to-gold-500"
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <aside className={cn('hidden rounded-2xl border border-warm-200 bg-white p-6 shadow-sm lg:block', className)}>
        {renderFilterContent({
          state: selectedState,
          onToggleArray: toggleDesktopArray,
          onToggleBoolean: toggleDesktopBoolean,
          onClearAll: () => clearAllFilters(false),
          activeCount: selectedActiveCount,
          idPrefix: 'desktop',
        })}
      </aside>
    </>
  )
}
