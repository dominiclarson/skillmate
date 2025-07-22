

import { NextResponse } from 'next/server';
import { findUserByEmail, verifyPassword, setAuthCookie } from '@/lib/auth-utils';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const user = await findUserByEmail(email);

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const valid = await verifyPassword(password, user.hash);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    
    await setAuthCookie({ id: user.id, email: user.email });

    return NextResponse.json({ ok: true, user: { id: user.id, email: user.email } });
  } catch {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
