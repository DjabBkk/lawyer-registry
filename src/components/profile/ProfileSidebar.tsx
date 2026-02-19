'use client'

import { type FormEvent, useMemo, useState } from 'react'
import { Phone, Send } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type { Business, Location } from '@/payload-types'

interface ProfileSidebarProps {
  firm: Business & {
    primaryLocation?: Location | number | null
  }
}

const inputClassName =
  'h-11 rounded-lg border border-warm-200 bg-white px-4 py-2.5 text-sm focus-visible:ring-2 focus-visible:ring-royal-500 focus-visible:border-royal-500'

const truncate = (value: string, maxLength: number) =>
  value.length > maxLength ? `${value.slice(0, maxLength).trimEnd()}...` : value

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

export function ProfileSidebar({ firm }: ProfileSidebarProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [isPrepared, setIsPrepared] = useState(false)

  const hasPhone = Boolean(firm.phone)

  const canSubmit = useMemo(
    () => Boolean(firm.email && name.trim() && isValidEmail(email.trim()) && message.trim()),
    [email, firm.email, message, name],
  )

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!canSubmit || !firm.email) return

    const subject = `Inquiry from TopLawyersThailand — ${name.trim()}`
    const body = [
      `Name: ${name.trim()}`,
      `Email: ${email.trim()}`,
      `Phone: ${phone.trim() || 'N/A'}`,
      '',
      'Message:',
      message.trim(),
    ].join('\n')

    const mailtoLink = `mailto:${firm.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

    setIsPrepared(true)
    window.location.href = mailtoLink
  }

  const resetForm = () => {
    setIsPrepared(false)
    setName('')
    setEmail('')
    setPhone('')
    setMessage('')
  }

  if (!firm.email && !hasPhone) return null

  return (
    <div id="profile-contact-form" className="space-y-4">
      <div className="rounded-xl border border-border/50 bg-white p-6 shadow-sm">
        <h2 className="font-heading text-xl font-bold text-royal-900">
          Contact {truncate(firm.name, 30)}
        </h2>

        {!firm.email ? (
          <p className="mt-4 text-sm text-royal-700">Email contact is currently unavailable for this firm.</p>
        ) : isPrepared ? (
          <div className="mt-4 space-y-2 text-sm text-royal-700">
            <p>Thank you! Your inquiry has been prepared. Please send the email that just opened.</p>
            <button
              type="button"
              onClick={resetForm}
              className="font-medium text-royal-700 transition-colors hover:text-royal-900"
            >
              Send another
            </button>
          </div>
        ) : (
          <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
            <Input
              type="text"
              placeholder="Your name"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              className={inputClassName}
            />
            <Input
              type="email"
              placeholder="Your email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={inputClassName}
            />
            <Input
              type="tel"
              placeholder="Phone (optional)"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className={inputClassName}
            />
            <Textarea
              placeholder="How can we help?"
              required
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              className="min-h-[120px] resize-y rounded-lg border border-warm-200 bg-white px-4 py-2.5 text-sm focus-visible:ring-2 focus-visible:ring-royal-500 focus-visible:border-royal-500"
            />

            <button
              type="submit"
              disabled={!canSubmit}
              className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-gold-500 to-gold-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:from-gold-400 hover:to-gold-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Send className="h-4 w-4" />
              Send Inquiry
            </button>
          </form>
        )}
      </div>

      {hasPhone && (
        <div className="rounded-xl bg-royal-900 p-5">
          <a
            href={`tel:${firm.phone}`}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 font-semibold text-royal-900 transition-colors hover:bg-cream-50"
          >
            <Phone className="h-4 w-4" />
            {firm.phone}
          </a>
        </div>
      )}
    </div>
  )
}
