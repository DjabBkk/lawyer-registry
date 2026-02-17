'use client'

import { useEffect, useState } from 'react'
import { RowLabelProps, useRowLabel } from '@payloadcms/ui'

import type { LawFirm } from '@/payload-types'

type RelationValue =
  | number
  | string
  | {
      id?: number | string
      name?: string | null
      title?: string | null
    }
  | null
  | undefined

const truncate = (value: string, max = 48) =>
  value.length > max ? `${value.slice(0, max).trimEnd()}...` : value

function useRelationshipName(value: RelationValue, collectionSlug: string) {
  const [name, setName] = useState<string>('')

  useEffect(() => {
    let active = true

    const fromObject =
      typeof value === 'object' && value
        ? String(value.name || value.title || '').trim()
        : ''

    if (fromObject) {
      setName(fromObject)
      return () => {
        active = false
      }
    }

    if (typeof value !== 'number' && typeof value !== 'string') {
      setName('')
      return () => {
        active = false
      }
    }

    const id = String(value).trim()
    if (!id) {
      setName('')
      return () => {
        active = false
      }
    }

    fetch(`/api/${collectionSlug}/${id}?depth=0`)
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (!active || !json) return
        const resolved = String(json?.name || json?.title || '').trim()
        if (resolved) setName(resolved)
      })
      .catch(() => {
        // no-op: keep fallback label
      })

    return () => {
      active = false
    }
  }, [collectionSlug, value])

  return name
}

export const HighlightRowLabel: React.FC<RowLabelProps> = () => {
  const row = useRowLabel<NonNullable<LawFirm['highlights']>[number]>()
  const value = row?.data?.label || row?.data?.value

  return <div>{value ? truncate(value) : 'Row'}</div>
}

export const PracticeAreaDetailRowLabel: React.FC<RowLabelProps> = () => {
  const row = useRowLabel<NonNullable<LawFirm['practiceAreaDetails']>[number]>()
  const practiceAreaName = useRelationshipName(row?.data?.practiceArea as RelationValue, 'practice-areas')

  const fallback =
    row?.data?.description ||
    (typeof row?.data?.practiceArea === 'number' || typeof row?.data?.practiceArea === 'string'
      ? `#${String(row?.data?.practiceArea)}`
      : '')

  const value = practiceAreaName || fallback

  return <div>{value ? truncate(value) : 'Row'}</div>
}

export const PracticeAreaServiceRowLabel: React.FC<RowLabelProps> = () => {
  const row =
    useRowLabel<NonNullable<NonNullable<LawFirm['practiceAreaDetails']>[number]['services']>[number]>()
  const value = row?.data?.name || row?.data?.price || ''

  return <div>{value ? truncate(value) : 'Row'}</div>
}

export const CaseHighlightRowLabel: React.FC<RowLabelProps> = () => {
  const row = useRowLabel<NonNullable<LawFirm['caseHighlights']>[number]>()
  const value = row?.data?.title || row?.data?.metric || ''

  return <div>{value ? truncate(value) : 'Row'}</div>
}

export const TestimonialRowLabel: React.FC<RowLabelProps> = () => {
  const row = useRowLabel<NonNullable<LawFirm['testimonials']>[number]>()
  const value = row?.data?.authorName || row?.data?.quote || ''

  return <div>{value ? truncate(value) : 'Row'}</div>
}

export const FAQRowLabel: React.FC<RowLabelProps> = () => {
  const row = useRowLabel<NonNullable<LawFirm['faq']>[number]>()
  const value = row?.data?.question || ''

  return <div>{value ? truncate(value) : 'Row'}</div>
}

export const OfficeLocationRowLabel: React.FC<RowLabelProps> = () => {
  const row = useRowLabel<NonNullable<LawFirm['officeLocations']>[number]>()
  const locationName = useRelationshipName(row?.data?.location as RelationValue, 'locations')
  const value = locationName || row?.data?.address || ''

  return <div>{value ? truncate(value) : 'Row'}</div>
}

export const TeamMemberRowLabel: React.FC<RowLabelProps> = () => {
  const row = useRowLabel<NonNullable<LawFirm['teamMembers']>[number]>()
  const value = row?.data?.name || row?.data?.role || ''

  return <div>{value ? truncate(value) : 'Row'}</div>
}
