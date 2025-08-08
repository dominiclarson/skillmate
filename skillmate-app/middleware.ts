

import { NextRequest, NextResponse } from 'next/server';

const publicRoutes = ['/', '/login', '/signup'];

export async function middleware(req: NextRequest) {
  const token = req.cookies.get(process.env.COOKIE_NAME || '')?.value;

  if (!publicRoutes.some(path => req.nextUrl.pathname === path)) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
