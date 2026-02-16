import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

import { Container } from './Container'

type Breadcrumb = {
  label: string
  href?: string
}

interface DarkHeroProps {
  title: string
  description?: string
  meta?: string
  breadcrumbs?: Breadcrumb[]
  children?: React.ReactNode
  className?: string
}

export function DarkHero({
  title,
  description,
  meta,
  breadcrumbs = [],
  children,
  className,
}: DarkHeroProps) {
  return (
    <section className={['dark-surface py-12 lg:py-16', className].filter(Boolean).join(' ')}>
      <Container>
        {breadcrumbs.length > 0 && (
          <nav className="on-dark-muted mb-6 flex flex-wrap items-center gap-2 text-sm">
            {breadcrumbs.map((crumb, idx) => (
              <div key={`${crumb.label}-${idx}`} className="contents">
                {crumb.href ? (
                  <Link href={crumb.href} className="transition-opacity hover:opacity-100">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="on-dark-primary">{crumb.label}</span>
                )}
                {idx < breadcrumbs.length - 1 && <ChevronRight className="h-4 w-4" />}
              </div>
            ))}
          </nav>
        )}

        <h1 className="on-dark-primary font-heading text-3xl font-bold lg:text-4xl">{title}</h1>

        {description && <p className="on-dark-secondary mt-3 max-w-2xl">{description}</p>}
        {meta && <p className="on-dark-muted mt-4 text-sm">{meta}</p>}
        {children}
      </Container>
    </section>
  )
}
