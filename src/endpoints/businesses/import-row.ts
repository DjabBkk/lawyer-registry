import { APIError } from 'payload'
import type { Endpoint } from 'payload'
import { randomUUID } from 'crypto'

import type { User } from '@/payload-types'
import { toKebabCase } from '@/utilities/toKebabCase'

type ImportRowRequestBody = {
  name?: string
  address?: string
  city?: string
  zipCode?: string
  country?: string
  email?: string
  website?: string
  phone?: string
  googleMapsUrl?: string
}

const MAX_SLUG_ATTEMPTS = 50
const UNIQUE_ERROR_PATTERN = /duplicate key value|unique constraint|already exists/i

const sanitize = (value?: string) => {
  if (!value) return undefined
  const trimmed = value.trim()
  return trimmed.length ? trimmed : undefined
}

const ensureAdmin = (user: User | null | undefined) => {
  if (!user || user.role !== 'admin') {
    throw new APIError('Admin authentication required', 403)
  }
}

const buildAddress = ({
  address,
  city,
  zipCode,
  country,
}: Pick<ImportRowRequestBody, 'address' | 'city' | 'zipCode' | 'country'>) => {
  const lines: string[] = []

  if (address) lines.push(address)

  const locality = [city, zipCode].filter(Boolean).join(' ')
  if (locality) lines.push(locality)

  if (country) lines.push(country)

  return lines.length ? lines.join(', ') : undefined
}

const getSlugCandidate = (baseSlug: string, attempt: number) =>
  attempt === 0 ? baseSlug : `${baseSlug}-${attempt}`

const slugExists = async (req: Parameters<Endpoint['handler']>[0], slug: string) => {
  const result = await req.payload.find({
    collection: 'businesses',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
    depth: 0,
  })

  return result.docs.length > 0
}

const getDefaultCountryId = async (req: Parameters<Endpoint['handler']>[0]) => {
  const bySlug = await req.payload.find({
    collection: 'countries',
    where: {
      slug: {
        equals: 'thailand',
      },
      active: {
        equals: true,
      },
    },
    depth: 0,
    limit: 1,
    locale: 'en',
  })

  if (bySlug.docs.length > 0) {
    return bySlug.docs[0].id
  }

  const activeCountries = await req.payload.find({
    collection: 'countries',
    where: {
      active: {
        equals: true,
      },
    },
    depth: 0,
    limit: 1,
    sort: '-updatedAt',
    locale: 'en',
  })

  return activeCountries.docs[0]?.id || null
}

export const importBusinessRowEndpoint: Endpoint = {
  path: '/import-business-row',
  method: 'post',
  handler: async (req) => {
    try {
      ensureAdmin(req.user as User | null | undefined)

      const body = (req.json ? await req.json() : null) as ImportRowRequestBody | null

      const name = sanitize(body?.name)
      if (!name) {
        return Response.json({ success: false, error: 'Firm name is required.' }, { status: 400 })
      }

      const email = sanitize(body?.email)
      if (!email) {
        return Response.json(
          { success: false, error: 'An email address is required for import.' },
          { status: 400 },
        )
      }

      const address = buildAddress({
        address: sanitize(body?.address),
        city: sanitize(body?.city),
        zipCode: sanitize(body?.zipCode),
        country: sanitize(body?.country),
      })
      const defaultCountryId = await getDefaultCountryId(req)
      if (!defaultCountryId) {
        return Response.json(
          {
            success: false,
            error: 'No active country is configured. Create and activate a country first.',
          },
          { status: 400 },
        )
      }

      const baseSlug = toKebabCase(name) || 'business'

      for (let attempt = 0; attempt < MAX_SLUG_ATTEMPTS; attempt += 1) {
        const slug = getSlugCandidate(baseSlug, attempt)

        if (await slugExists(req, slug)) {
          continue
        }

        try {
          const created = await req.payload.create({
            collection: 'businesses',
            draft: false,
            locale: 'en',
            data: {
              name,
              slug,
              email,
              country: defaultCountryId,
              address,
              phone: sanitize(body?.phone),
              website: sanitize(body?.website),
              googleMapsUrl: sanitize(body?.googleMapsUrl),
              businessType: 'law-firm',
              listingTier: 'free',
              verified: false,
              claimToken: randomUUID(),
              claimTokenUsedAt: null,
              _status: 'published',
            },
          })

          return Response.json({
            success: true,
            business: {
              id: created.id,
              name: created.name,
              email: created.email,
              slug: created.slug,
              claimToken: created.claimToken,
            },
          })
        } catch (error) {
          const message = error instanceof Error ? error.message : ''

          if (UNIQUE_ERROR_PATTERN.test(message)) {
            continue
          }

          throw error
        }
      }

      return Response.json(
        {
          success: false,
          error: `Unable to generate a unique slug for "${name}" after ${MAX_SLUG_ATTEMPTS} attempts.`,
        },
        { status: 409 },
      )
    } catch (error) {
      console.error('Business import row failed:', error)
      return Response.json(
        {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to import business row.',
        },
        { status: error instanceof APIError ? error.status : 500 },
      )
    }
  },
}
