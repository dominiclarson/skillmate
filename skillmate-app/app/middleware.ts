

import { NextRequest, NextResponse } from 'next/server';

const protectedRoutes = ['/profile', '/chat'];

export async function middleware(req: NextRequest) {
  const token = req.cookies.get(process.env.COOKIE_NAME || '')?.value;

  if (protectedRoutes.some(path => req.nextUrl.pathname.startsWith(path))) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile', '/chat'], // Adjust as needed
};
