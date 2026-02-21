import { createServerClient } from '@supabase/ssr'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { DEFAULT_LOCALE, isValidLocalePrefix } from '@/utilities/locales'

const addLocaleHeaders = ({
  locale,
  request,
  requestHeaders,
}: {
  locale: string
  request: NextRequest
  requestHeaders: Headers
}) => {
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })

  response.headers.set('x-locale', locale)
  return response
}

const addLocaleHeaderToResponse = (response: NextResponse, locale: string) => {
  response.headers.set('x-locale', locale)
  return response
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const segments = pathname.split('/').filter(Boolean)
  const firstSegment = (segments[0] || '').toLowerCase()
  const locale = isValidLocalePrefix(firstSegment) ? firstSegment : DEFAULT_LOCALE.code

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-locale', locale)

  let response = addLocaleHeaders({ locale, request, requestHeaders })
  const isDashboardLoginPath = pathname === '/dashboard/login'

  if (isDashboardLoginPath) {
    return response
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    const loginURL = new URL('/dashboard/login', request.url)
    loginURL.searchParams.set('next', pathname)
    return addLocaleHeaderToResponse(NextResponse.redirect(loginURL), locale)
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value)
        })

        response = addLocaleHeaders({ locale, request, requestHeaders })
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options)
        })
      },
    },
  })

  const { data, error } = await supabase.auth.getUser()

  if (error || !data.user) {
    const loginURL = new URL('/dashboard/login', request.url)
    const nextPath = `${pathname}${request.nextUrl.search}`
    loginURL.searchParams.set('next', nextPath)

    return addLocaleHeaderToResponse(NextResponse.redirect(loginURL), locale)
  }

  return response
}

export const config = {
  matcher: ['/dashboard', '/dashboard/((?!login(?:/|$)|api(?:/|$)|_next/static|_next/image|.*\\.[^/]+$).*)'],
}
