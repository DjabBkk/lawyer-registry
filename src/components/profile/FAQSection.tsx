'use client'

import { useMemo, useState } from 'react'
import { Minus, Plus } from 'lucide-react'

interface FAQSectionProps {
  faq?: Array<{
    question?: string | null
    answer?: string | null
  }> | null
}

export function FAQSection({ faq }: FAQSectionProps) {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({})

  const entries = useMemo(
    () =>
      (faq || []).filter((item) => item?.question && item?.answer) as Array<{
        question: string
        answer: string
      }>,
    [faq],
  )

  if (!entries.length) return null

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: entries.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }

  const toggle = (key: string) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <h2 className="font-heading text-2xl font-bold text-royal-900">Frequently Asked Questions</h2>

      <div className="mt-4 border-b border-warm-200">
        {entries.map((item, index) => {
          const key = `${item.question}-${index}`
          const isOpen = Boolean(openItems[key])

          return (
            <div key={key} className="border-t border-warm-200">
              <button
                type="button"
                onClick={() => toggle(key)}
                className="flex w-full items-center justify-between gap-4 py-4 text-left"
              >
                <span className="text-base font-medium text-royal-900">{item.question}</span>
                {isOpen ? (
                  <Minus className="h-4 w-4 shrink-0 text-royal-600" />
                ) : (
                  <Plus className="h-4 w-4 shrink-0 text-royal-600" />
                )}
              </button>

              {isOpen && <p className="pb-4 text-sm leading-relaxed text-royal-700">{item.answer}</p>}
            </div>
          )
        })}
      </div>
    </section>
  )
}

