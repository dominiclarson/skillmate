


import { NextResponse } from 'next/server';
import { findUserByEmail, verifyPassword, setAuthCookie } from '@/lib/auth-utils';

/**
 * Handles user login authentication
 * @param req - Request object containing email and password
 * @returns JSON response indicating success or error
 */
export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    console.log('Login attempt:', { email, nodeEnv: process.env.NODE_ENV });

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

    console.log('Setting auth cookie for user:', user.id);
    await setAuthCookie({ id: user.id, email: user.email });
    console.log('Auth cookie set successfully');
    
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
