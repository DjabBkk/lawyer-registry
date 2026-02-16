'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Scale } from 'lucide-react'

import { Container } from './Container'
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
    <header className="dark-surface sticky top-0 z-50 w-full border-b border-royal-700/30 shadow-md shadow-royal-950/20">
      <Container>
        <nav className="flex h-16 items-center justify-between lg:h-[72px]">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-gold-400 to-gold-500 shadow-sm transition-shadow group-hover:shadow-md">
              <Scale className="h-5 w-5 text-royal-900" />
            </div>
            <div className="hidden sm:block">
              <span className="font-heading text-lg font-bold text-white">
                Top Lawyers
              </span>
              <span className="font-heading text-lg font-medium text-white">
                {' '}Thailand
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="relative text-[15px] font-medium text-white transition-colors hover:text-white after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-gold-400 after:transition-all hover:after:w-full"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:flex lg:items-center lg:gap-4">
            <Button
              asChild
              className="bg-gradient-to-r from-gold-500 to-gold-600 px-5 font-semibold text-white shadow-sm transition-all hover:from-gold-400 hover:to-gold-500 hover:shadow-md"
            >
              <Link href="/thailand/lawyers">Find a Lawyer</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden inline-flex items-center justify-center rounded-lg p-2.5 text-white transition-colors hover:bg-royal-800"
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
      </Container>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-royal-700/40 bg-royal-900 lg:hidden">
          <Container>
            <div className="space-y-1 py-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block rounded-lg px-4 py-3 text-base font-medium text-white transition-colors hover:bg-royal-800 hover:text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-3">
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-gold-500 to-gold-600 font-semibold text-white"
                >
                  <Link href="/thailand/lawyers" onClick={() => setMobileMenuOpen(false)}>
                    Find a Lawyer
                  </Link>
                </Button>
              </div>
            </div>
          </Container>
        </div>
      )}
    </header>
  )
}
