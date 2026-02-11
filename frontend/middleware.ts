import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const LOCALES = ['ru', 'be', 'en', 'pl', 'zh']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const firstSegment = pathname.split('/').filter(Boolean)[0]
  const isLocale = firstSegment && LOCALES.includes(firstSegment)
  if (isLocale) return NextResponse.next()
  if (pathname === '/' || pathname === '') {
    return NextResponse.redirect(new URL('/ru', request.url))
  }
  return NextResponse.redirect(new URL(`/ru${pathname}`, request.url))
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
