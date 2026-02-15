'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Scale } from 'lucide-react'

import { Container } from './Container'
import { cn } from '@/utilities/ui'
import { Button } from '@/components/ui/button'

const navigation = [
  { name: 'Find Lawyers', href: '/thailand/lawyers' },
  { name: 'Practice Areas', href: '/#practice-areas' },
  { name: 'Locations', href: '/#locations' },
  { name: 'About', href: '/about' },
]

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-warm-200/60 bg-cream-100/95 backdrop-blur-md supports-[backdrop-filter]:bg-cream-100/90">
      <Container>
        <nav className="flex h-18 items-center justify-between lg:h-20">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-royal-700 to-royal-800 shadow-sm transition-shadow group-hover:shadow-md">
              <Scale className="h-6 w-6 text-gold-400" />
            </div>
            <div className="hidden sm:block">
              <span className="font-heading text-xl font-bold text-royal-800">
                Top Lawyers
              </span>
              <span className="font-heading text-xl font-medium text-royal-500">
                {' '}Thailand
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:gap-10">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="relative text-[15px] font-medium text-warm-500 transition-colors hover:text-royal-700 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-royal-600 after:transition-all hover:after:w-full"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:flex lg:items-center lg:gap-4">
            <Button
              asChild
              className="bg-royal-700 px-6 text-white shadow-sm transition-all hover:bg-royal-600 hover:shadow-md"
            >
              <Link href="/thailand/lawyers">Find a Lawyer</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden inline-flex items-center justify-center rounded-xl p-2.5 text-warm-500 transition-colors hover:bg-cream-200 hover:text-royal-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Open main menu</span>
            {mobileMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </nav>

        {/* Mobile Navigation */}
        <div
          className={cn(
            'lg:hidden overflow-hidden transition-all duration-300 ease-in-out',
            mobileMenuOpen ? 'max-h-96 pb-6' : 'max-h-0',
          )}
        >
          <div className="flex flex-col gap-1 border-t border-warm-200/60 pt-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="rounded-lg px-4 py-3 text-base font-medium text-warm-500 transition-colors hover:bg-cream-200 hover:text-royal-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="mt-4 px-4">
              <Button
                asChild
                className="w-full bg-royal-700 text-white hover:bg-royal-600"
              >
                <Link href="/thailand/lawyers">Find a Lawyer</Link>
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </header>
  )
}
