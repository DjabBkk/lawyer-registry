import Link from 'next/link'
import type { Metadata } from 'next'

import { Container } from '@/components/layout/Container'
import { getSupportedCountry, SUPPORTED_COUNTRIES } from '@/utilities/countries'

export const metadata: Metadata = {
  title: 'Lawyers Directory',
  description: 'Browse lawyers and law offices by country.',
}

export default async function LawyersDirectoryPage() {
  // Today we only support Thailand, but keep the page global for future expansion.
  const thailand = getSupportedCountry('thailand')

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-royal-900 via-royal-700 to-royal-600">
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-gold-500/5 to-gold-400/10" />
        <Container className="relative py-16 lg:py-20">
          <h1 className="font-heading text-4xl font-bold text-white lg:text-5xl">
            Lawyers Directory
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-cream-200/80">
            Browse law firms by country. More locations coming soon.
          </p>
        </Container>
      </section>

      <section className="bg-cream-100 py-12">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Object.values(SUPPORTED_COUNTRIES).map((country) => (
              <Link
                key={country.slug}
                href={`/${country.slug}/lawyers`}
                className="group rounded-2xl border border-warm-200 bg-white p-6 shadow-sm transition-all hover:border-royal-300 hover:shadow-md"
              >
                <div className="font-heading text-xl font-bold text-royal-900 group-hover:text-royal-700">
                  {country.name}
                </div>
                <div className="mt-2 text-sm text-warm-600">
                  View law firms in {country.name}
                </div>
              </Link>
            ))}
          </div>

          {!thailand && (
            <p className="mt-8 text-sm text-warm-600">
              No countries configured yet.
            </p>
          )}
        </Container>
      </section>
    </>
  )
}

