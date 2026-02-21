import { NextResponse } from 'next/server'

import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const requestURL = new URL(request.url)
  const code = requestURL.searchParams.get('code')
  const loginURL = new URL('/dashboard/login', requestURL.origin)
  const profileURL = new URL('/dashboard/profile', requestURL.origin)

  if (!code) {
    return NextResponse.redirect(loginURL)
  }

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error('Supabase auth callback session exchange failed:', error)
    return NextResponse.redirect(loginURL)
  }

  return NextResponse.redirect(profileURL)
}
