



import { NextResponse } from 'next/server';
import { createUser, setAuthCookie } from '@/lib/auth-utils';

/**
 * User registration endpoint
 * 
 * Creates a new user account with provided credentials and automatically logs them in.
 * 
 * @route POST /api/auth/register
 * @param req - Request object containing user registration data
 * @param req.firstName - User's first name
 * @param req.lastName - User's last name  
 * @param req.email - User's email address (must be unique)
 * @param req.password - User's password
 * @returns JSON response with success status or error message
 * @throws {400} When required credentials are missing
 * @throws {409} When email is already in use
 * @throws {500} When registration process fails 
 * 
 */
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
