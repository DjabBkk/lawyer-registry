import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Scale } from 'lucide-react'

import { Container } from './Container'

const footerLinks = {
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ],
}

async function getPracticeAreas() {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'practice-areas',
    where: { featured: { equals: true } },
    limit: 6,
    sort: 'featuredOrder',
  })
  return docs
}

async function getLocations() {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'locations',
    where: { featured: { equals: true } },
    limit: 5,
    sort: 'featuredOrder',
  })
  return docs
}

export async function SiteFooter() {
  const [practiceAreas, locations] = await Promise.all([
    getPracticeAreas(),
    getLocations(),
  ])

  return (
    <footer className="border-t border-royal-800 bg-gradient-to-b from-royal-900 to-royal-950 text-white">
      <Container className="py-14 lg:py-20">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="group inline-flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-gold-400 to-gold-500 shadow-lg transition-shadow group-hover:shadow-xl">
                <Scale className="h-6 w-6 text-royal-900" />
              </div>
              <div>
                <span className="font-heading text-xl font-bold text-white">
                  Top Lawyers
                </span>
                <span className="font-heading text-xl font-medium text-cream-300">
                  {' '}Thailand
                </span>
              </div>
            </Link>
            <p className="mt-5 max-w-xs text-[15px] leading-relaxed text-cream-200/70">
              Thailand&apos;s premier directory for finding qualified legal professionals.
              Connect with experienced lawyers across all practice areas.
            </p>
          </div>

          {/* Practice Areas */}
          <div>
            <h3 className="font-heading text-lg font-semibold text-white">Practice Areas</h3>
            <ul className="mt-5 space-y-3">
              {practiceAreas.map((area) => (
                <li key={area.id}>
                  <Link
                    href={`/${area.slug}`}
                    className="text-[15px] text-cream-200/70 transition-colors hover:text-gold-400"
                  >
                    {area.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/#practice-areas"
                  className="inline-flex items-center gap-1 text-[15px] font-medium text-gold-400 hover:text-gold-300"
                >
                  View All
                  <span className="text-lg">→</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Locations */}
          <div>
            <h3 className="font-heading text-lg font-semibold text-white">Locations</h3>
            <ul className="mt-5 space-y-3">
              {locations.map((location) => (
                <li key={location.id}>
                  <Link
                    href={`/locations/${location.slug}`}
                    className="text-[15px] text-cream-200/70 transition-colors hover:text-gold-400"
                  >
                    {location.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/#locations"
                  className="inline-flex items-center gap-1 text-[15px] font-medium text-gold-400 hover:text-gold-300"
                >
                  View All
                  <span className="text-lg">→</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-heading text-lg font-semibold text-white">Company</h3>
            <ul className="mt-5 space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-[15px] text-cream-200/70 transition-colors hover:text-gold-400"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 border-t border-royal-800/50 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-cream-200/50">
              © {new Date().getFullYear()} Top Lawyers Thailand. All rights reserved.
            </p>
            <div className="flex gap-8">
              <Link
                href="/privacy"
                className="text-sm text-cream-200/50 transition-colors hover:text-cream-200"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-cream-200/50 transition-colors hover:text-cream-200"
              >
                Terms
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  )
}
