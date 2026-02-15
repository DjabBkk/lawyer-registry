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
    <section className="relative overflow-hidden bg-gradient-to-br from-royal-950 via-royal-800 to-royal-700">
      {/* Warm gold accent overlay - refined glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-gold-500/8 to-gold-400/12" />
      
      {/* Bottom warm beige gradient fade */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#F8F4EE]/10 to-transparent" />
      
      {/* Subtle elegant pattern - legal/professional feel */}
      <div 
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <Container className="relative py-24 lg:py-40">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge - more refined with blur effect */}
          <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-gold-500/30 bg-gold-500/15 px-5 py-2.5 text-sm font-semibold text-gold-300 shadow-lg shadow-gold-500/10 backdrop-blur-sm">
            <Scale className="h-4 w-4" />
            Thailand&apos;s Premier Legal Directory
          </div>

          {/* Headline - refined typography */}
          <h1 className="font-heading text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl">
            Find Your{' '}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-gold-300 via-gold-400 to-gold-500 bg-clip-text text-transparent">
                Lawyer
              </span>
              <span className="absolute -bottom-1.5 left-0 right-0 h-1 rounded-full bg-gradient-to-r from-gold-400/0 via-gold-400/80 to-gold-400/0" />
            </span>
            <br className="sm:hidden" />
            {' '}in Thailand
          </h1>

          {/* Subheadline - improved color for better warmth */}
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-cream-200 sm:text-xl">
            Connect with Thailand&apos;s top legal professionals. Search by practice area 
            and location to find the perfect match for your legal needs.
          </p>

          {/* Search Box - refined with warmer styling */}
          <div className="mt-12 overflow-hidden rounded-2xl border border-white/10 bg-white/10 p-2 shadow-2xl shadow-royal-950/50 backdrop-blur-md sm:p-3">
            <div className="flex flex-col gap-3 rounded-xl bg-cream-50 p-2 shadow-lg sm:flex-row sm:p-3">
              {/* Practice Area Select */}
              <div className="flex-1">
                <Select value={selectedPracticeArea} onValueChange={setSelectedPracticeArea}>
                  <SelectTrigger className="h-14 w-full border-warm-200 bg-white text-left text-gray-900 hover:bg-cream-100 focus:ring-royal-500 focus:ring-offset-cream-50">
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
                  <SelectTrigger className="h-14 w-full border-warm-200 bg-white text-left text-gray-900 hover:bg-cream-100 focus:ring-royal-500 focus:ring-offset-cream-50">
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

              {/* Search Button - richer gold gradient */}
              <Button
                onClick={handleSearch}
                className="h-14 bg-gradient-to-r from-gold-500 to-gold-600 px-8 text-base font-semibold text-royal-950 shadow-lg shadow-gold-600/25 transition-all hover:from-gold-400 hover:to-gold-500 hover:shadow-xl hover:shadow-gold-500/30"
              >
                <Search className="mr-2 h-5 w-5" />
                Search
              </Button>
            </div>
          </div>

          {/* Quick Stats - refined with better spacing */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm sm:gap-14">
            <div className="flex items-center gap-3">
              <span className="font-heading text-3xl font-bold text-white sm:text-4xl">20+</span>
              <span className="text-cream-200/90">Law Firms</span>
            </div>
            <div className="hidden h-10 w-px bg-cream-200/20 sm:block" />
            <div className="flex items-center gap-3">
              <span className="font-heading text-3xl font-bold text-white sm:text-4xl">25</span>
              <span className="text-cream-200/90">Practice Areas</span>
            </div>
            <div className="hidden h-10 w-px bg-cream-200/20 sm:block" />
            <div className="flex items-center gap-3">
              <span className="font-heading text-3xl font-bold text-white sm:text-4xl">10</span>
              <span className="text-cream-200/90">Locations</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
