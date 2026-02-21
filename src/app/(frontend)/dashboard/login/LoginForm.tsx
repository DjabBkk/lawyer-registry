'use client'

import { useActionState } from 'react'

import {
  initialDashboardLoginActionState,
  signInDashboardUserAction,
} from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export const DashboardLoginForm = () => {
  const [state, formAction, isPending] = useActionState(
    signInDashboardUserAction,
    initialDashboardLoginActionState,
  )

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="name@firm.com"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </div>

      {state.error ? <p className="text-sm font-medium text-red-700">{state.error}</p> : null}

      <Button
        type="submit"
        disabled={isPending}
        className="w-full bg-royal-700 text-white hover:bg-royal-600 disabled:opacity-60"
      >
        {isPending ? 'Signing In...' : 'Sign In'}
      </Button>
    </form>
  )
}
