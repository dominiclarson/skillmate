


import { NextResponse } from 'next/server';
import { createUser, setAuthCookie } from '@/lib/auth-utils';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Create the user 
    const user = await createUser(email, password);

    // Set a JWT cookie 
    await setAuthCookie({ id: user.id, email: user.email });

    return NextResponse.json({ ok: true, user: { id: user.id, email: user.email } });
  } catch (err: any) {
    if (err.message === 'exists') {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
