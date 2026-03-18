import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/** Редирект /ru и /ru/* на корень (без локали) */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (pathname === '/ru' || pathname === '/ru/') {
    return NextResponse.redirect(new URL('/', request.url))
  }
  if (pathname.startsWith('/ru/')) {
    return NextResponse.redirect(new URL(pathname.slice(3) || '/', request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
