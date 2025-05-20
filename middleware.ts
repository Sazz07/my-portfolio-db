import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isPublicPath = path === '/login';

  const refreshToken = request.cookies.get('refreshToken')?.value;

  if (!isPublicPath && !refreshToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isPublicPath && refreshToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Configure which paths this middleware will run on
export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};
