import Link from 'next/link'

import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getServerSideURL } from '@/utilities/getURL'
import { ClaimForm } from './ClaimForm'

type ValidateClaimResponse = {
  id: number
  name: string
}

type ClaimTokenState =
  | { kind: 'valid'; business: ValidateClaimResponse }
  | { kind: 'used' }
  | { kind: 'invalid' }

interface ClaimPageProps {
  params: Promise<{ token: string }>
}

const validateClaimToken = async (token: string): Promise<ClaimTokenState> => {
  const endpoint = `${getServerSideURL()}/api/businesses/validate-claim?token=${encodeURIComponent(token)}`

  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      cache: 'no-store',
    })

    if (response.status === 200) {
      const payload = (await response.json()) as ValidateClaimResponse
      return { kind: 'valid', business: payload }
    }

    if (response.status === 410) {
      return { kind: 'used' }
    }

    return { kind: 'invalid' }
  } catch {
    return { kind: 'invalid' }
  }
}

export default async function ClaimPage({ params }: ClaimPageProps) {
  const { token } = await params
  const claimState = await validateClaimToken(token)

  return (
    <section className="py-16 sm:py-20">
      <Container className="max-w-3xl">
        <Card className="border-border/70 bg-white">
          {claimState.kind === 'valid' ? (
            <>
              <CardHeader className="space-y-3">
                <CardTitle className="font-heading text-3xl text-royal-900">Is this your firm?</CardTitle>
                <CardDescription className="text-base text-royal-700/85">
                  Claim access to manage the profile for{' '}
                  <span className="font-semibold text-royal-900">{claimState.business.name}</span>.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ClaimForm token={token} firmName={claimState.business.name} />
              </CardContent>
            </>
          ) : null}

          {claimState.kind === 'used' ? (
            <>
              <CardHeader className="space-y-3">
                <CardTitle className="font-heading text-3xl text-royal-900">Profile Already Claimed</CardTitle>
                <CardDescription className="text-base text-royal-700/85">
                  This claim link has already been used. If you own this firm profile, sign in to your
                  dashboard to continue.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="bg-royal-700 text-white hover:bg-royal-600">
                  <Link href="/dashboard/login">Go to Dashboard Login</Link>
                </Button>
              </CardContent>
            </>
          ) : null}

          {claimState.kind === 'invalid' ? (
            <>
              <CardHeader className="space-y-3">
                <CardTitle className="font-heading text-3xl text-royal-900">Invalid Or Expired Link</CardTitle>
                <CardDescription className="text-base text-royal-700/85">
                  This claim link is invalid or has expired. Please contact support so we can issue a new
                  claim invitation.
                </CardDescription>
              </CardHeader>
            </>
          ) : null}
        </Card>
      </Container>
    </section>
  )
}
