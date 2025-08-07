



import { NextResponse } from 'next/server';
import { createUser, setAuthCookie } from '@/lib/auth-utils';

export async function POST(req: Request) {
  try {
    const { firstName, lastName, email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
    }

    const user = await createUser({ firstName, lastName, email, password });
    await setAuthCookie(user);

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error('Registration error:', err); 
    if (err.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
