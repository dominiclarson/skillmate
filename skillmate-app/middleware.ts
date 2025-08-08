

import { NextRequest, NextResponse } from 'next/server';

const publicRoutes = ['/', '/login', '/signup'];

export async function middleware(req: NextRequest) {
  const cookieName = process.env.COOKIE_NAME || 'authToken';
  const token = req.cookies.get(cookieName)?.value;

  // デバッグログ（本番環境で問題特定後は削除）
  if (process.env.NODE_ENV === 'production') {
    console.log('Middleware Debug:', {
      pathname: req.nextUrl.pathname,
      cookieName,
      hasToken: !!token,
      allCookies: Object.fromEntries(req.cookies.getAll().map(c => [c.name, c.value ? 'exists' : 'empty']))
    });
  }

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
