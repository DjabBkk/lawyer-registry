import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'

import './globals.css'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { SiteFooter } from '@/components/layout/SiteFooter'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: {
    default: 'Top Lawyers Thailand | Find Your Legal Expert',
    template: '%s | Top Lawyers Thailand',
  },
  description:
    'Find the best lawyers and law firms in Thailand. Search by practice area, location, and expertise. Criminal law, immigration, real estate, corporate law and more.',
  keywords: [
    'lawyer Thailand',
    'attorney Thailand',
    'law firm Bangkok',
    'legal services Thailand',
    'criminal lawyer Thailand',
    'immigration lawyer Thailand',
  ],
}

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="flex min-h-screen flex-col bg-cream-100 font-body antialiased">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  )
}
