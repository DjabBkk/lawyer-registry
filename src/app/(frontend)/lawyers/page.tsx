import Link from 'next/link'
import type { Metadata } from 'next'

import { Container } from '@/components/layout/Container'
import { DarkHero } from '@/components/layout/DarkHero'
import { getActiveCountries } from '@/utilities/countries'

export const metadata: Metadata = {
  title: 'Lawyers Directory',
  description: 'Browse lawyers and law offices by country.',
}

export default async function LawyersDirectoryPage() {
  const countries = await getActiveCountries()

  return (
    <>
      <DarkHero
        title="Lawyers Directory"
        description="Browse law firms by country. More locations coming soon."
      />

      <section className="bg-cream-100 py-12">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {countries.map((country) => (
              <Link
                key={country.slug}
                href={`/${country.slug}/lawyers`}
                className="group rounded-2xl border border-warm-200 bg-white p-6 shadow-sm transition-all hover:border-royal-300 hover:shadow-md"
              >
                <div className="font-heading text-xl font-bold text-royal-900 group-hover:text-royal-700">
                  {country.name}
                </div>
                <div className="mt-2 text-sm text-royal-700/80">
                  View law firms in {country.name}
                </div>
              </Link>
            ))}
          </div>

          {countries.length === 0 && (
            <p className="mt-8 text-sm text-royal-700/80">
              No countries configured yet.
            </p>
          )}
        </Container>
      </section>
    </>
  )
}
