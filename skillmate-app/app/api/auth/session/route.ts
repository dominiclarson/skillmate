export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
const secret = process.env.JWT_SECRET || 'dev_secret_key';
const cookieName = process.env.COOKIE_NAME || 'skm_token';
export async function GET() {
  const store = await cookies();
  const token = store.get(cookieName)?.value;
  if (!token) return NextResponse.json({ authenticated: false }, { status: 401 });
  try { jwt.verify(token, secret); return NextResponse.json({ authenticated: true }); }
  catch { return NextResponse.json({ authenticated: false }, { status: 401 }); }
}