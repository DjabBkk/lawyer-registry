'use client'

import { useEffect, useState } from 'react'
import { Phone, Send } from 'lucide-react'

import type { LawFirm, Location } from '@/payload-types'

interface MobileContactBarProps {
  firm: LawFirm & {
    primaryLocation?: Location | number | null
  }
}

export function MobileContactBar({ firm }: MobileContactBarProps) {
  const [showBar, setShowBar] = useState(false)

  const hasPhone = Boolean(firm.phone)
  const hasEmail = Boolean(firm.email)

  useEffect(() => {
    const hero = document.getElementById('profile-hero-anchor')
    if (!hero) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowBar(!entry.isIntersecting)
      },
      {
        threshold: 0.05,
      },
    )

    observer.observe(hero)

    return () => {
      observer.disconnect()
    }
  }, [])

  if (!showBar || (!hasPhone && !hasEmail)) return null

  const scrollToContactForm = () => {
    const formElement = document.getElementById('profile-contact-form')
    if (!formElement) return
    formElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-warm-200 bg-white px-4 py-3 shadow-lg lg:hidden">
      <div className="flex gap-3">
        {hasPhone && (
          <a
            href={`tel:${firm.phone}`}
            className={`inline-flex items-center justify-center gap-2 rounded-lg bg-royal-900 py-2.5 font-semibold text-white ${hasEmail ? 'flex-1' : 'w-full'}`}
          >
            <Phone className="h-4 w-4" />
            Call
          </a>
        )}

        {hasEmail && (
          <button
            type="button"
            onClick={scrollToContactForm}
            className={`inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-gold-500 to-gold-600 py-2.5 font-semibold text-white ${hasPhone ? 'flex-1' : 'w-full'}`}
          >
            <Send className="h-4 w-4" />
            Send Inquiry
          </button>
        )}
      </div>
    </div>
  )
}
