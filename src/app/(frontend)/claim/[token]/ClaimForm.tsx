'use client'

import { useActionState } from 'react'

import { submitClaimAction, initialClaimActionState } from '../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type ClaimFormProps = {
  token: string
  firmName: string
}

export const ClaimForm = ({ token, firmName }: ClaimFormProps) => {
  const [state, formAction, isPending] = useActionState(submitClaimAction, initialClaimActionState)

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="token" value={token} />

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
          autoComplete="new-password"
          required
          minLength={8}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
        />
      </div>

      {state.error ? <p className="text-sm font-medium text-red-700">{state.error}</p> : null}

      <Button
        type="submit"
        disabled={isPending}
        className="w-full bg-royal-700 text-white hover:bg-royal-600 disabled:opacity-60"
      >
        {isPending ? 'Submitting...' : `Claim ${firmName}`}
      </Button>
    </form>
  )
}
