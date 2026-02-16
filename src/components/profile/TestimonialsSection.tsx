'use client'

import { useMemo, useState } from 'react'
import { Star } from 'lucide-react'

interface TestimonialsSectionProps {
  testimonials?: Array<{
    quote?: string | null
    authorName?: string | null
    authorTitle?: string | null
    rating?: number | null
  }> | null
}

const Stars = ({ rating }: { rating: number }) => (
  <div className="mt-3 flex items-center gap-1" aria-label={`${rating} out of 5 stars`}>
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'fill-gold-500 text-gold-500' : 'text-warm-300'}`}
      />
    ))}
  </div>
)

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const [showAll, setShowAll] = useState(false)

  const testimonialItems = useMemo(
    () =>
      (testimonials || []).filter((item: any) => item?.quote && item?.authorName) as Array<{
        quote: string
        authorName: string
        authorTitle?: string
        rating?: number
      }>,
    [testimonials],
  )

  if (!testimonialItems.length) return null

  const visibleTestimonials = showAll ? testimonialItems : testimonialItems.slice(0, 3)

  return (
    <section>
      <h2 className="font-heading text-2xl font-bold text-royal-900">
        Client Testimonials
      </h2>

      <div className="mt-5 space-y-4">
        {visibleTestimonials.map((item, index) => (
          <article
            key={`${item.authorName}-${index}`}
            className="relative rounded-xl border border-border/50 bg-white p-5 shadow-sm"
          >
            <span className="pointer-events-none absolute left-4 top-2 font-heading text-6xl text-gold-500/20">
              “
            </span>
            <p className="relative text-sm italic leading-relaxed text-royal-700">{item.quote}</p>
            {typeof item.rating === 'number' && item.rating >= 1 && item.rating <= 5 && (
              <Stars rating={item.rating} />
            )}
            <div className="mt-4">
              <p className="text-sm font-semibold text-royal-900">{item.authorName}</p>
              {item.authorTitle && <p className="text-xs text-royal-600">{item.authorTitle}</p>}
              <p className="mt-1 text-xs text-royal-400">Testimonial provided by the firm</p>
            </div>
          </article>
        ))}
      </div>

      {testimonialItems.length > 3 && (
        <button
          type="button"
          onClick={() => setShowAll((prev) => !prev)}
          className="mt-4 text-sm font-medium text-royal-700 transition-colors hover:text-royal-900"
        >
          {showAll ? 'Show fewer testimonials' : `Show all ${testimonialItems.length} testimonials`}
        </button>
      )}
    </section>
  )
}
