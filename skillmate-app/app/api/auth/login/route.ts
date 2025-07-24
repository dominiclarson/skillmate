


import { NextResponse } from 'next/server';
import { findUserByEmail, verifyPassword, setAuthCookie } from '@/lib/auth-utils';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const user = await findUserByEmail(email);
    if (!user) {
      console.error('Login failed: user not found');
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const valid = await verifyPassword(password, user.password); 
    if (!valid) {
      console.error('Login failed: incorrect password');
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    await setAuthCookie({ id: user.id, email: user.email });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
