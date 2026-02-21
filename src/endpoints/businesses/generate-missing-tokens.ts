import { randomUUID } from 'crypto'
import type { Endpoint } from 'payload'

const MAX_PROCESS_RECORDS = 5000

const isAdmin = (user: unknown) =>
  Boolean(user && typeof user === 'object' && 'role' in user && user.role === 'admin')

const hasMissingClaimToken = (value: unknown) => {
  if (typeof value !== 'string') return true
  return value.trim().length === 0
}

const UNIQUE_ERROR_PATTERN = /duplicate key value|unique constraint|already exists/i

export const generateMissingTokensEndpoint: Endpoint = {
  path: '/generate-missing-tokens',
  method: 'post',
  handler: async (req) => {
    if (!isAdmin(req.user)) {
      return Response.json({ message: 'Admin access required.' }, { status: 403 })
    }

    const result = await req.payload.find({
      collection: 'businesses',
      where: {
        or: [
          {
            claimToken: {
              exists: false,
            },
          },
          {
            claimToken: {
              equals: '',
            },
          },
        ],
      },
      depth: 0,
      page: 1,
      limit: MAX_PROCESS_RECORDS,
      overrideAccess: true,
      sort: 'id',
      select: {
        id: true,
        claimToken: true,
      },
    })

    const businessesWithMissingTokens = result.docs.filter((business) =>
      hasMissingClaimToken(business.claimToken),
    )

    let generated = 0

    for (const business of businessesWithMissingTokens) {
      let updated = false

      for (let attempt = 0; attempt < 3 && !updated; attempt += 1) {
        try {
          await req.payload.update({
            collection: 'businesses',
            id: business.id,
            depth: 0,
            overrideAccess: true,
            data: {
              claimToken: randomUUID(),
            },
          })

          generated += 1
          updated = true
        } catch (error) {
          const message = error instanceof Error ? error.message : ''
          if (UNIQUE_ERROR_PATTERN.test(message)) {
            continue
          }

          throw error
        }
      }

      if (!updated) {
        return Response.json(
          {
            message: 'Failed to generate unique claim tokens for some records.',
          },
          { status: 500 },
        )
      }
    }

    return Response.json({
      generated,
      totalMatched: businessesWithMissingTokens.length,
      truncated: result.totalDocs > result.docs.length,
      maxRecords: MAX_PROCESS_RECORDS,
    })
  },
}
