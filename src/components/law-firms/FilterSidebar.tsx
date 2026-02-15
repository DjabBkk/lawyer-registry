'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback, useState } from 'react'
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react'

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
  showPracticeAreas?: boolean
  showLocations?: boolean
  className?: string
}

const companySizes = [
  { value: '1-5', label: '1-5 employees' },
  { value: '6-10', label: '6-10 employees' },
  { value: '11-25', label: '11-25 employees' },
  { value: '26-50', label: '26-50 employees' },
  { value: '51-100', label: '51-100 employees' },
  { value: '100+', label: '100+ employees' },
]

const languages = [
  { value: 'English', label: 'English' },
  { value: 'Thai', label: 'Thai' },
  { value: 'Chinese', label: 'Chinese' },
  { value: 'Japanese', label: 'Japanese' },
  { value: 'German', label: 'German' },
]

export function FilterSidebar({
  practiceAreas = [],
  locations = [],
  showPracticeAreas = true,
  showLocations = true,
  className,
}: FilterSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    practiceAreas: true,
    locations: true,
    size: false,
    languages: false,
  })

  // Get current filter values from URL
  const selectedPracticeAreas = searchParams.get('practiceAreas')?.split(',').filter(Boolean) || []
  const selectedLocations = searchParams.get('locations')?.split(',').filter(Boolean) || []
  const selectedSizes = searchParams.get('size')?.split(',').filter(Boolean) || []
  const selectedLanguages = searchParams.get('languages')?.split(',').filter(Boolean) || []

  const activeFilterCount =
    selectedPracticeAreas.length +
    selectedLocations.length +
    selectedSizes.length +
    selectedLanguages.length

  const updateFilters = useCallback(
    (key: string, values: string[]) => {
      const params = new URLSearchParams(searchParams.toString())

      if (values.length > 0) {
        params.set(key, values.join(','))
      } else {
        params.delete(key)
      }

      // Reset to page 1 when filters change
      params.delete('page')

      router.push(`${pathname}?${params.toString()}`, { scroll: false })
    },
    [router, pathname, searchParams],
  )

  const toggleFilter = (key: string, value: string, currentValues: string[]) => {
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value]
    updateFilters(key, newValues)
  }

  const clearAllFilters = () => {
    router.push(pathname, { scroll: false })
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
        <span className="font-semibold text-gray-900">{title}</span>
        {expandedSections[sectionKey] ? (
          <ChevronUp className="h-4 w-4 text-warm-400" />
        ) : (
          <ChevronDown className="h-4 w-4 text-warm-400" />
        )}
      </button>
      {expandedSections[sectionKey] && (
        <div className="mt-4 space-y-3">{children}</div>
      )}
    </div>
  )

  return (
    <aside className={cn('rounded-2xl border border-warm-200 bg-white p-6 shadow-sm', className)}>
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-royal-700" />
          <h3 className="font-heading text-lg font-semibold text-gray-900">Filters</h3>
          {activeFilterCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-royal-700 text-xs font-medium text-white">
              {activeFilterCount}
            </span>
          )}
        </div>
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="h-auto p-0 text-sm text-gray-500 hover:text-gray-700"
          >
            Clear all
          </Button>
        )}
      </div>

      {/* Practice Areas Filter */}
      {showPracticeAreas && practiceAreas.length > 0 && (
        <FilterSection title="Practice Areas" sectionKey="practiceAreas">
          <div className="max-h-48 space-y-2 overflow-y-auto">
            {practiceAreas.map((area) => (
              <div key={area.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`pa-${area.slug}`}
                  checked={selectedPracticeAreas.includes(area.slug)}
                  onCheckedChange={() =>
                    toggleFilter('practiceAreas', area.slug, selectedPracticeAreas)
                  }
                />
                <Label
                  htmlFor={`pa-${area.slug}`}
                  className="cursor-pointer text-sm text-gray-700"
                >
                  {area.name}
                </Label>
              </div>
            ))}
          </div>
        </FilterSection>
      )}

      {/* Locations Filter */}
      {showLocations && locations.length > 0 && (
        <FilterSection title="Locations" sectionKey="locations">
          <div className="max-h-48 space-y-2 overflow-y-auto">
            {locations.map((location) => (
              <div key={location.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`loc-${location.slug}`}
                  checked={selectedLocations.includes(location.slug)}
                  onCheckedChange={() =>
                    toggleFilter('locations', location.slug, selectedLocations)
                  }
                />
                <Label
                  htmlFor={`loc-${location.slug}`}
                  className="cursor-pointer text-sm text-gray-700"
                >
                  {location.name}
                </Label>
              </div>
            ))}
          </div>
        </FilterSection>
      )}

      {/* Company Size Filter */}
      <FilterSection title="Company Size" sectionKey="size">
        <div className="space-y-2">
          {companySizes.map((size) => (
            <div key={size.value} className="flex items-center space-x-2">
              <Checkbox
                id={`size-${size.value}`}
                checked={selectedSizes.includes(size.value)}
                onCheckedChange={() => toggleFilter('size', size.value, selectedSizes)}
              />
              <Label
                htmlFor={`size-${size.value}`}
                className="cursor-pointer text-sm text-gray-700"
              >
                {size.label}
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>

      {/* Languages Filter */}
      <FilterSection title="Languages" sectionKey="languages">
        <div className="space-y-2">
          {languages.map((lang) => (
            <div key={lang.value} className="flex items-center space-x-2">
              <Checkbox
                id={`lang-${lang.value}`}
                checked={selectedLanguages.includes(lang.value)}
                onCheckedChange={() => toggleFilter('languages', lang.value, selectedLanguages)}
              />
              <Label
                htmlFor={`lang-${lang.value}`}
                className="cursor-pointer text-sm text-gray-700"
              >
                {lang.label}
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>
    </aside>
  )
}
