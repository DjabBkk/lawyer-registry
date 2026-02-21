import { Container } from '@/components/layout/Container'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import { DashboardLoginForm } from './LoginForm'

export default function DashboardLoginPage() {
  return (
    <section className="py-16 sm:py-20">
      <Container className="max-w-xl">
        <Card className="border-border/70 bg-white">
          <CardHeader className="space-y-3">
            <CardTitle className="font-heading text-3xl text-royal-900">Firm Dashboard Login</CardTitle>
            <CardDescription className="text-base text-royal-700/85">
              Sign in to manage your firm profile.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DashboardLoginForm />
          </CardContent>
        </Card>
      </Container>
    </section>
  )
}
