import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'

import { Container } from '@/components/layout/Container'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createSupabaseServerClient, createSupabaseServiceRoleClient } from '@/lib/supabase/server'
import type { Business, Currency, PracticeArea } from '@/payload-types'

import { ProfileForm } from './ProfileForm'
import type {
  DashboardBusinessProfileData,
  DashboardPracticeAreaOption,
  SupportedCurrencyCode,
} from './types'

type FirmUserRow = {
  payload_business_id: number
}

const SUPPORTED_CURRENCIES: SupportedCurrencyCode[] = ['THB', 'USD', 'EUR']

const getLocalizedString = (value: unknown): string => {
  if (typeof value === 'string') {
    return value
  }

  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const localizedValue = value as Record<string, unknown>
    const english = localizedValue.en

    if (typeof english === 'string') {
      return english
    }

    const firstString = Object.values(localizedValue).find(
      (localizedEntry): localizedEntry is string => typeof localizedEntry === 'string',
    )

    if (firstString) {
      return firstString
    }
  }

  return ''
}

const extractLexicalPlainText = (value: unknown): string => {
  if (!value || typeof value !== 'object') {
    return ''
  }

  const textParts: string[] = []

  const walkNodes = (nodes: unknown[]) => {
    nodes.forEach((node) => {
      if (!node || typeof node !== 'object') {
        return
      }

      const lexicalNode = node as Record<string, unknown>
      if (typeof lexicalNode.text === 'string') {
        textParts.push(lexicalNode.text)
      }

      if (Array.isArray(lexicalNode.children)) {
        walkNodes(lexicalNode.children)
        textParts.push('\n')
      }
    })
  }

  const root = (value as Record<string, unknown>).root
  if (root && typeof root === 'object') {
    const children = (root as Record<string, unknown>).children
    if (Array.isArray(children)) {
      walkNodes(children)
    }
  }

  return textParts.join('').replace(/\n{3,}/g, '\n\n').trim()
}

const getMediaForForm = (media: Business['logo'] | Business['coverImage']) => {
  if (!media) {
    return null
  }

  if (typeof media === 'number') {
    return {
      id: media,
      url: null,
    }
  }

  return {
    id: media.id,
    url: media.url || null,
  }
}

const getCurrencyCode = ({
  currencyMapById,
  value,
}: {
  currencyMapById: Map<number, SupportedCurrencyCode>
  value: unknown
}): SupportedCurrencyCode | null => {
  if (!value) {
    return null
  }

  if (typeof value === 'number') {
    return currencyMapById.get(value) || null
  }

  if (value && typeof value === 'object') {
    const currency = value as Partial<Currency>

    if (typeof currency.code === 'string') {
      const code = currency.code.toUpperCase()
      if (SUPPORTED_CURRENCIES.includes(code as SupportedCurrencyCode)) {
        return code as SupportedCurrencyCode
      }
    }

    if (typeof currency.id === 'number') {
      return currencyMapById.get(currency.id) || null
    }
  }

  return null
}

export default async function DashboardProfilePage() {
  const supabase = await createSupabaseServerClient()
  const { data: authData, error: authError } = await supabase.auth.getUser()

  if (authError || !authData.user) {
    redirect('/dashboard/login')
  }

  const serviceRoleClient = createSupabaseServiceRoleClient()
  const { data: firmUser, error: firmUserError } = await serviceRoleClient
    .from('firm_users')
    .select('payload_business_id')
    .eq('supabase_user_id', authData.user.id)
    .maybeSingle<FirmUserRow>()

  if (firmUserError || !firmUser?.payload_business_id) {
    redirect('/dashboard/login')
  }

  const payload = await getPayload({ config })

  try {
    const [businessRecord, practiceAreasResult, currenciesResult] = await Promise.all([
      payload.findByID({
        collection: 'businesses',
        id: firmUser.payload_business_id,
        depth: 1,
        overrideAccess: true,
        select: {
          id: true,
          name: true,
          logo: true,
          coverImage: true,
          description: true,
          address: true,
          phone: true,
          email: true,
          website: true,
          practiceAreas: true,
          practiceAreaDetails: true,
          servicePricing: true,
          feeRangeMin: true,
          feeRangeMax: true,
          feeCurrency: true,
        },
      }),
      payload.find({
        collection: 'practice-areas',
        depth: 0,
        limit: 500,
        sort: 'name',
        overrideAccess: true,
      }),
      payload.find({
        collection: 'currencies',
        depth: 0,
        limit: 20,
        where: {
          code: {
            in: SUPPORTED_CURRENCIES,
          },
        },
        overrideAccess: true,
      }),
    ])

    const currencyMapById = new Map<number, SupportedCurrencyCode>()
    currenciesResult.docs.forEach((currency) => {
      const code = currency.code?.toUpperCase()
      if (SUPPORTED_CURRENCIES.includes(code as SupportedCurrencyCode)) {
        currencyMapById.set(currency.id, code as SupportedCurrencyCode)
      }
    })

    const safeBusiness: DashboardBusinessProfileData = {
      id: businessRecord.id,
      name: getLocalizedString(businessRecord.name),
      logo: getMediaForForm(businessRecord.logo),
      coverImage: getMediaForForm(businessRecord.coverImage),
      description: extractLexicalPlainText(businessRecord.description),
      address: getLocalizedString(businessRecord.address),
      phone: businessRecord.phone || '',
      email: businessRecord.email || '',
      website: businessRecord.website || '',
      practiceAreas: (businessRecord.practiceAreas || [])
        .map((practiceArea) => {
          if (typeof practiceArea === 'number') return practiceArea
          if (practiceArea && typeof practiceArea === 'object' && typeof practiceArea.id === 'number') {
            return practiceArea.id
          }
          return null
        })
        .filter((value): value is number => typeof value === 'number'),
      practiceAreaDetails: (businessRecord.practiceAreaDetails || [])
        .map((entry) => {
          const practiceAreaId =
            typeof entry.practiceArea === 'number'
              ? entry.practiceArea
              : entry.practiceArea && typeof entry.practiceArea === 'object'
                ? entry.practiceArea.id
                : null

          if (!practiceAreaId) {
            return null
          }

          return {
            practiceArea: practiceAreaId,
            description: entry.description || '',
            priceMin: typeof entry.priceMin === 'number' ? entry.priceMin : null,
          }
        })
        .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry)),
      servicePricing: (businessRecord.servicePricing || []).map((entry) => ({
        serviceName: entry.serviceName || '',
        price:
          typeof entry.priceMin === 'number'
            ? entry.priceMin
            : typeof entry.priceMax === 'number'
              ? entry.priceMax
              : null,
        currency: getCurrencyCode({ currencyMapById, value: entry.currency }) || 'THB',
      })),
      feeRangeMin: typeof businessRecord.feeRangeMin === 'number' ? businessRecord.feeRangeMin : null,
      feeRangeMax: typeof businessRecord.feeRangeMax === 'number' ? businessRecord.feeRangeMax : null,
      feeCurrency: getCurrencyCode({ currencyMapById, value: businessRecord.feeCurrency }),
    }

    const practiceAreas: DashboardPracticeAreaOption[] = practiceAreasResult.docs.map(
      (practiceArea: PracticeArea) => ({
        id: practiceArea.id,
        name: getLocalizedString(practiceArea.name),
      }),
    )

    return (
      <section className="py-10 sm:py-14">
        <Container className="max-w-5xl">
          <Card className="border-border/70 bg-white">
            <CardHeader className="space-y-3">
              <CardTitle className="font-heading text-3xl text-royal-900">Firm Profile</CardTitle>
              <CardDescription className="text-base text-royal-700/85">
                Update your listing details, services, and pricing information.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileForm business={safeBusiness} practiceAreas={practiceAreas} />
            </CardContent>
          </Card>
        </Container>
      </section>
    )
  } catch (error) {
    console.error('Failed to load dashboard profile:', error)
    redirect('/dashboard/login')
  }
}
