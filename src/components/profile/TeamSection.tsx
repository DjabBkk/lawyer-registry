'use client'

import Image from 'next/image'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Linkedin, Mail, User, X } from 'lucide-react'

import type { LawFirm, Media } from '@/payload-types'
import { cn } from '@/utilities/ui'
import { isLeadTeamRole } from './profile-helpers'

type TeamMember = NonNullable<LawFirm['teamMembers']>[number]

interface TeamSectionProps {
  teamMembers: Array<TeamMember & { photo?: Media | number | null }>
  className?: string
}

const TeamCard = ({
  member,
  onOpen,
}: {
  member: TeamMember & { photo?: Media | number | null }
  onOpen: () => void
}) => {
  const photo = typeof member.photo === 'object' ? member.photo : null
  const isLeadRole = isLeadTeamRole(member.role)
  const isFoundingPartner = member.role === 'Founding Partner'

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex gap-5 overflow-hidden rounded-xl border border-border/50 bg-white p-5 text-left shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="shrink-0">
        <div className="relative aspect-[2/3] w-32 overflow-hidden rounded-lg bg-royal-50">
          {photo?.url ? (
            <Image
              src={photo.url}
              alt={member.name}
              fill
              className="object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <User className="h-12 w-12 text-royal-200" />
            </div>
          )}
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <h3 className="font-heading text-base font-semibold text-royal-900">{member.name}</h3>
        <div className="mt-1.5 flex flex-wrap items-center gap-2">
          {isFoundingPartner ? (
            <span className="rounded-full bg-royal-100 px-2 py-0.5 text-xs font-medium text-royal-700">
              {member.role}
            </span>
          ) : member.role ? (
            <span className="text-sm font-medium text-royal-600">{member.role}</span>
          ) : null}
          {isLeadRole && (
            <span className="rounded-full bg-gold-100 px-2 py-0.5 text-xs font-medium text-gold-700">
              Lead Contact
            </span>
          )}
        </div>

        {member.bio && (
          <p className="mt-2.5 flex-1 text-xs leading-relaxed text-royal-700/80 line-clamp-4">{member.bio}</p>
        )}

        <div className="mt-3 flex items-center gap-2.5">
          <span className="text-xs font-medium text-royal-700">View full profile</span>
          {member.linkedIn && (
            <a
              href={member.linkedIn}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center justify-center rounded border border-warm-200 bg-white p-1 text-royal-700 transition-colors hover:bg-cream-50"
              aria-label="LinkedIn profile"
            >
              <Linkedin className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </div>
    </button>
  )
}

export function TeamSection({ teamMembers, className }: TeamSectionProps) {
  if (!teamMembers || teamMembers.length === 0) return null

  const [activeMemberIndex, setActiveMemberIndex] = useState<number | null>(null)
  const sliderRef = useRef<HTMLDivElement | null>(null)

  const sortedMembers = useMemo(
    () =>
      [...teamMembers].sort((a, b) => {
        const aLead = isLeadTeamRole(a.role) ? 1 : 0
        const bLead = isLeadTeamRole(b.role) ? 1 : 0
        return bLead - aLead
      }),
    [teamMembers],
  )

  const hasSlider = sortedMembers.length > 2

  useEffect(() => {
    if (activeMemberIndex === null) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveMemberIndex(null)
      if (event.key === 'ArrowLeft') {
        setActiveMemberIndex((prev) => (prev === null ? prev : prev === 0 ? sortedMembers.length - 1 : prev - 1))
      }
      if (event.key === 'ArrowRight') {
        setActiveMemberIndex((prev) =>
          prev === null ? prev : prev === sortedMembers.length - 1 ? 0 : prev + 1,
        )
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [activeMemberIndex, sortedMembers.length])

  const activeMember =
    typeof activeMemberIndex === 'number' ? sortedMembers[activeMemberIndex] : null

  const scrollByPage = (direction: 'left' | 'right') => {
    const scroller = sliderRef.current
    if (!scroller) return

    const delta = Math.round(scroller.clientWidth * 0.9)
    scroller.scrollBy({
      left: direction === 'left' ? -delta : delta,
      behavior: 'smooth',
    })
  }

  return (
    <div className={cn(className)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-royal-900">Our Team</h2>
        </div>

        {hasSlider && (
          <div className="hidden items-center gap-2 sm:flex">
            <button
              type="button"
              onClick={() => scrollByPage('left')}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-warm-200 bg-white text-royal-700 transition-colors hover:bg-cream-50"
              aria-label="Previous team members"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollByPage('right')}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-warm-200 bg-white text-royal-700 transition-colors hover:bg-cream-50"
              aria-label="Next team members"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {hasSlider ? (
        <div
          ref={sliderRef}
          className="mt-4 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {sortedMembers.map((member, index) => (
            <div key={`${member.name}-${index}`} className="w-[90%] shrink-0 snap-start sm:w-[48%]">
              <TeamCard member={member} onOpen={() => setActiveMemberIndex(index)} />
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-4 grid gap-6 sm:grid-cols-2">
          {sortedMembers.map((member, index) => (
            <TeamCard
              key={`${member.name}-${index}`}
              member={member}
              onOpen={() => setActiveMemberIndex(index)}
            />
          ))}
        </div>
      )}

      {activeMember && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setActiveMemberIndex(null)
            }
          }}
        >
          <div className="relative mx-auto max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white shadow-xl">
            <button
              type="button"
              onClick={() => setActiveMemberIndex(null)}
              className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-warm-200 bg-white text-royal-700 transition-colors hover:bg-cream-50"
              aria-label="Close lawyer profile"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="grid gap-6 p-6 sm:grid-cols-[220px_1fr]">
              <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-royal-50">
                {typeof activeMember.photo === 'object' && activeMember.photo?.url ? (
                  <Image
                    src={activeMember.photo.url}
                    alt={activeMember.name}
                    fill
                    className="object-cover object-top"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <User className="h-16 w-16 text-royal-200" />
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-heading text-2xl font-bold text-royal-900">{activeMember.name}</h3>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {activeMember.role === 'Founding Partner' ? (
                    <span className="rounded-full bg-royal-100 px-2 py-0.5 text-xs font-medium text-royal-700">
                      {activeMember.role}
                    </span>
                  ) : activeMember.role ? (
                    <span className="text-sm font-medium text-royal-600">{activeMember.role}</span>
                  ) : null}
                  {isLeadTeamRole(activeMember.role) && (
                    <span className="rounded-full bg-gold-100 px-2 py-0.5 text-xs font-medium text-gold-700">
                      Lead Contact
                    </span>
                  )}
                </div>

                {activeMember.bio && (
                  <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-royal-700">{activeMember.bio}</p>
                )}

                {(activeMember.email || activeMember.linkedIn) && (
                  <div className="mt-5 flex flex-wrap gap-3">
                    {activeMember.email && (
                      <a
                        href={`mailto:${activeMember.email}`}
                        className="inline-flex items-center gap-2 rounded-lg border border-warm-200 px-3 py-2 text-sm font-medium text-royal-700 transition-colors hover:bg-cream-50"
                      >
                        <Mail className="h-4 w-4" />
                        {activeMember.email}
                      </a>
                    )}
                    {activeMember.linkedIn && (
                      <a
                        href={activeMember.linkedIn}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg border border-warm-200 px-3 py-2 text-sm font-medium text-royal-700 transition-colors hover:bg-cream-50"
                      >
                        <Linkedin className="h-4 w-4" />
                        LinkedIn
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>

            {sortedMembers.length > 1 && (
              <div className="flex items-center justify-between border-t border-warm-200 px-6 py-3">
                <button
                  type="button"
                  onClick={() =>
                    setActiveMemberIndex((prev) =>
                      prev === null ? prev : prev === 0 ? sortedMembers.length - 1 : prev - 1,
                    )
                  }
                  className="inline-flex items-center gap-1 text-sm font-medium text-royal-700 hover:text-royal-900"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setActiveMemberIndex((prev) =>
                      prev === null ? prev : prev === sortedMembers.length - 1 ? 0 : prev + 1,
                    )
                  }
                  className="inline-flex items-center gap-1 text-sm font-medium text-royal-700 hover:text-royal-900"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
