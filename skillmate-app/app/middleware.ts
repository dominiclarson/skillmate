

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const cookieName = process.env.COOKIE_NAME || 'skm_token';
const secret     = process.env.JWT_SECRET || 'dev_secret';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  
  if (pathname.startsWith('/login') || pathname.startsWith('/signup') ||
      pathname.startsWith('/api')   || pathname.includes('.')) {
    return NextResponse.next();
  }

  
  const token = req.cookies.get(cookieName)?.value;
  if (!token) {
    
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    jwt.verify(token, secret);        
    return NextResponse.next();       
  } catch {
   
    const res = NextResponse.redirect(new URL('/login', req.url));
    res.cookies.delete(cookieName);
    return res;
  }
}


export const config = {
  matcher: ['/', '/((?!api/).*)'],   
};
