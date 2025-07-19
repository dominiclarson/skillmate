import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const secret     = process.env.JWT_SECRET  || 'dev_secret_key';
const cookieName = process.env.COOKIE_NAME || 'skm_token';

export async function getCurrentUser(): Promise<{ id: number; email: string } | null> {
  const cookieStore = cookies();
  const token = (await cookieStore).get(cookieName)?.value;
  if (!token) return null;
  try {
    return jwt.verify(token, secret) as { id: number; email: string };
  } catch {
    return null;
  }
}