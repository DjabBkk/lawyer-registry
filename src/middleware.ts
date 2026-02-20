import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { DEFAULT_LOCALE, isValidLocalePrefix } from '@/utilities/locales'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const segments = pathname.split('/').filter(Boolean)
  const firstSegment = (segments[0] || '').toLowerCase()
  const locale = isValidLocalePrefix(firstSegment) ? firstSegment : DEFAULT_LOCALE.code

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-locale', locale)

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })

  response.headers.set('x-locale', locale)

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.[^/]+$).*)'],
}
