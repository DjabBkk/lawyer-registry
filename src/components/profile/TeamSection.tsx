import Image from 'next/image'
import { Mail, Linkedin, User } from 'lucide-react'

import { Container } from '@/components/layout/Container'
import type { LawFirm, Media } from '@/payload-types'

type TeamMember = NonNullable<LawFirm['teamMembers']>[number]

interface TeamSectionProps {
  teamMembers: Array<TeamMember & { photo?: Media | number | null }>
}

export function TeamSection({ teamMembers }: TeamSectionProps) {
  if (!teamMembers || teamMembers.length === 0) return null

  return (
    <section className="py-12">
      <Container>
        <h2 className="font-heading text-2xl font-bold text-royal-900 lg:text-3xl">
          Our Team
        </h2>
        <p className="mt-2 text-royal-700/80">
          Meet the legal professionals dedicated to serving your needs
        </p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {teamMembers.map((member, index) => {
            const photo = typeof member.photo === 'object' ? member.photo : null

            return (
              <div
                key={index}
                className="group overflow-hidden rounded-xl border border-border/50 bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                {/* Photo */}
                <div className="relative aspect-[4/3] bg-royal-50">
                  {photo?.url ? (
                    <Image
                      src={photo.url}
                      alt={member.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <User className="h-16 w-16 text-royal-200" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-5">
                  <h3 className="font-heading text-lg font-semibold text-royal-900">
                    {member.name}
                  </h3>
                  {member.role && (
                    <p className="mt-0.5 text-sm font-medium text-royal-600">
                      {member.role}
                    </p>
                  )}
                  {member.bio && (
                    <p className="mt-3 line-clamp-3 text-sm text-royal-700/80">
                      {member.bio}
                    </p>
                  )}

                  {/* Contact Links */}
                  {(member.email || member.linkedIn) && (
                    <div className="mt-4 flex gap-3">
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-royal-50 text-royal-600 transition-colors hover:bg-royal-100"
                          title={`Email ${member.name}`}
                        >
                          <Mail className="h-4 w-4" />
                        </a>
                      )}
                      {member.linkedIn && (
                        <a
                          href={member.linkedIn}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-royal-50 text-royal-600 transition-colors hover:bg-royal-100"
                          title={`${member.name}'s LinkedIn`}
                        >
                          <Linkedin className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
