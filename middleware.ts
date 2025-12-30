import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Redirect lowercase /amenities to the desired uppercase /Amenities path
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // If the user requests lowercase /amenities, redirect visibly to /Amenities
  if (pathname === '/amenities' || pathname.startsWith('/amenities/')) {
    const url = req.nextUrl.clone()
    url.pathname = pathname.replace(/^\/amenities/i, '/Amenities')
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/amenities', '/amenities/:path*'],
}
