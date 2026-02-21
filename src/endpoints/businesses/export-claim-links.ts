import type { Endpoint, Where } from 'payload'

const MAX_EXPORT_RECORDS = 5000

const getFirmName = (value: unknown): string => {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value
  }

  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const localizedName = value as Record<string, unknown>
    const englishName = localizedName.en

    if (typeof englishName === 'string' && englishName.trim().length > 0) {
      return englishName
    }

    const firstString = Object.values(localizedName).find(
      (localizedValue): localizedValue is string =>
        typeof localizedValue === 'string' && localizedValue.trim().length > 0,
    )

    if (firstString) {
      return firstString
    }
  }

  return ''
}

const parseIds = (rawIds: string): number[] => {
  const values = rawIds
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)
    .map((value) => Number.parseInt(value, 10))
    .filter((value) => Number.isInteger(value) && value > 0)

  return [...new Set(values)]
}

const isAdmin = (user: unknown) =>
  Boolean(user && typeof user === 'object' && 'role' in user && user.role === 'admin')

const getSiteURL = () =>
  (process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_SERVER_URL ||
    'http://localhost:3000'
  ).replace(/\/$/, '')

export const exportClaimLinksEndpoint: Endpoint = {
  path: '/export-claim-links',
  method: 'get',
  handler: async (req) => {
    if (!isAdmin(req.user)) {
      return Response.json({ message: 'Admin access required.' }, { status: 403 })
    }

    const search = req.searchParams?.get('search')?.trim()
    const idsParam = req.searchParams?.get('ids')?.trim()
    const ids = idsParam ? parseIds(idsParam) : []

    if (idsParam && ids.length === 0) {
      return Response.json({ message: 'Invalid ids parameter.' }, { status: 400 })
    }

    const whereClauses: Where[] = []

    if (search) {
      whereClauses.push({
        name: {
          contains: search,
        },
      })
    }

    if (ids.length > 0) {
      whereClauses.push({
        id: {
          in: ids,
        },
      })
    }

    const where: Where | undefined =
      whereClauses.length === 0
        ? undefined
        : whereClauses.length === 1
          ? whereClauses[0]
          : { and: whereClauses }

    const result = await req.payload.find({
      collection: 'businesses',
      where,
      depth: 0,
      page: 1,
      limit: MAX_EXPORT_RECORDS,
      overrideAccess: true,
      sort: 'name',
      select: {
        id: true,
        name: true,
        email: true,
        claimToken: true,
        claimTokenUsedAt: true,
        listingTier: true,
        verified: true,
      },
    })

    const siteURL = getSiteURL()
    const rows = result.docs.map((business) => {
      const claimToken = typeof business.claimToken === 'string' ? business.claimToken.trim() : ''

      return {
        id: business.id,
        name: getFirmName(business.name),
        email: business.email || '',
        claimURL: claimToken ? `${siteURL}/claim/${claimToken}` : '',
        listingTier: business.listingTier || '',
        verified: Boolean(business.verified),
        claimTokenUsedAt: business.claimTokenUsedAt || null,
      }
    })

    return Response.json({
      rows,
      total: rows.length,
      truncated: result.totalDocs > rows.length,
      maxRecords: MAX_EXPORT_RECORDS,
    })
  },
}
