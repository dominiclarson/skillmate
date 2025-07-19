export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { createUser, setAuthCookie } from '@/lib/auth-file';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const user = await createUser(email, password);
    await setAuthCookie({ id: user.id, email: user.email });
    return NextResponse.json({ message: 'User registered' });
  } catch (err: any) {
    const msg = err.message === 'exists' ? 'Email already registered' : 'Registration failed';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}