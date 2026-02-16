'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Search, Scale } from 'lucide-react'

import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface HeroProps {
  practiceAreas: Array<{ id: number; name: string; slug: string }>
  locations: Array<{ id: number; name: string; slug: string }>
}

export function Hero({ practiceAreas, locations }: HeroProps) {
  const router = useRouter()
  const [selectedPracticeArea, setSelectedPracticeArea] = useState<string>('')
  const [selectedLocation, setSelectedLocation] = useState<string>('')

  const handleSearch = () => {
    if (selectedPracticeArea && selectedLocation) {
      router.push(`/thailand/lawyers/${selectedLocation}/${selectedPracticeArea}`)
    } else if (selectedPracticeArea) {
      router.push(`/thailand/lawyers/${selectedPracticeArea}`)
    } else if (selectedLocation) {
      router.push(`/thailand/lawyers/${selectedLocation}`)
    } else {
      router.push('/thailand/lawyers')
    }
  }

  return (
    <section className="dark-surface relative overflow-hidden">
      <Container className="relative py-20 lg:py-32">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-gold-500/30 bg-gold-500/15 px-5 py-2.5 text-sm font-semibold text-gold-300 shadow-lg shadow-gold-500/10 backdrop-blur-sm">
            <Scale className="h-4 w-4" />
            Thailand&apos;s Premier Legal Directory
          </div>

          {/* Headline */}
          <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
            <span className="text-white">Find Your</span>{' '}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-gold-300 via-gold-400 to-gold-500 bg-clip-text text-transparent">
                Lawyer
              </span>
              <span className="absolute -bottom-1.5 left-0 right-0 h-1 rounded-full bg-gradient-to-r from-gold-400/0 via-gold-400/80 to-gold-400/0" />
            </span>
            <br className="sm:hidden" />
            {' '}<span className="text-white">in Thailand</span>
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white sm:text-xl">
            Connect with Thailand&apos;s top legal professionals. Search by practice area
            and location to find the perfect match for your legal needs.
          </p>

          {/* Search Box */}
          <div className="mt-10 overflow-hidden rounded-2xl border border-white/10 bg-white/10 p-2 shadow-2xl shadow-royal-950/50 backdrop-blur-md sm:p-3">
            <div className="flex flex-col gap-3 rounded-xl bg-cream-50 p-2 shadow-lg sm:flex-row sm:p-3">
              {/* Practice Area Select */}
              <div className="flex-1">
                <Select value={selectedPracticeArea} onValueChange={setSelectedPracticeArea}>
                  <SelectTrigger className="h-12 w-full border-warm-200 bg-white text-left text-royal-900 hover:bg-cream-100 focus:ring-royal-500 focus:ring-offset-cream-50 sm:h-14">
                    <SelectValue placeholder="Select Practice Area" />
                  </SelectTrigger>
                  <SelectContent>
                    {practiceAreas.map((area) => (
                      <SelectItem key={area.id} value={area.slug}>
                        {area.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Location Select */}
              <div className="flex-1">
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger className="h-12 w-full border-warm-200 bg-white text-left text-royal-900 hover:bg-cream-100 focus:ring-royal-500 focus:ring-offset-cream-50 sm:h-14">
                    <SelectValue placeholder="Select Location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location.id} value={location.slug}>
                        {location.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Search Button */}
              <Button
                onClick={handleSearch}
                className="h-12 bg-gradient-to-r from-gold-500 to-gold-600 px-6 text-base font-semibold text-white shadow-lg shadow-gold-600/25 transition-all hover:from-gold-400 hover:to-gold-500 hover:shadow-xl hover:shadow-gold-500/30 sm:h-14"
              >
                <Search className="h-4 w-4 shrink-0" />
                <span>Search</span>
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-14 flex flex-wrap items-center justify-center gap-8 text-sm sm:gap-14">
            <div className="flex items-center gap-3">
              <span className="font-heading text-3xl font-bold text-white sm:text-4xl">20+</span>
              <span className="text-white">Law Firms</span>
            </div>
            <div className="hidden h-10 w-px bg-white/20 sm:block" />
            <div className="flex items-center gap-3">
              <span className="font-heading text-3xl font-bold text-white sm:text-4xl">25</span>
              <span className="text-white">Practice Areas</span>
            </div>
            <div className="hidden h-10 w-px bg-white/20 sm:block" />
            <div className="flex items-center gap-3">
              <span className="font-heading text-3xl font-bold text-white sm:text-4xl">10</span>
              <span className="text-white">Locations</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
