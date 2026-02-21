import Link from 'next/link'

import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function ClaimConfirmPage() {
  return (
    <section className="py-16 sm:py-20">
      <Container className="max-w-3xl">
        <Card className="border-border/70 bg-white">
          <CardHeader className="space-y-3">
            <CardTitle className="font-heading text-3xl text-royal-900">Check Your Email</CardTitle>
            <CardDescription className="text-base text-royal-700/85">
              Your account has been created. Please confirm your email address using the confirmation
              link sent by Supabase before you can access the dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 text-royal-800">
            <p className="mb-0 text-sm sm:text-base">
              After confirming your email, return to the firm dashboard login page and sign in.
            </p>
            <Button asChild className="bg-royal-700 text-white hover:bg-royal-600">
              <Link href="/dashboard/login">Go to Dashboard Login</Link>
            </Button>
          </CardContent>
        </Card>
      </Container>
    </section>
  )
}
