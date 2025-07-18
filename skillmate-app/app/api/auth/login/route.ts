
import { NextResponse } from 'next/server';
import {
  findUserByEmail,
  verifyPassword,
  setAuthCookie,
} from '../../../../lib/auth-file';   


export async function POST(req: Request) {
  const { email, password } = await req.json();

  const user = await findUserByEmail(email);
  const ok   = user && (await verifyPassword(password, user.hash));

  if (!ok) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  
  setAuthCookie({ id: user.id, email: user.email });

  return NextResponse.json({ message: 'Login successful' });
}
