import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { readUsers, writeUsers, User } from './file-store';

const saltRounds = 10;
const secret     = process.env.JWT_SECRET || 'dev_secret_key';
const cookieName = process.env.COOKIE_NAME || 'skm_token';


export async function createUser(email: string, password: string): Promise<User> {
  const users = await readUsers();
  if (users.some(u => u.email === email)) throw new Error('exists');

  const hash = await bcrypt.hash(password, saltRounds);
  const user = { id: Date.now(), email, hash };
  await writeUsers([...users, user]);
  return user;
}

export async function findUserByEmail(email: string) {
  const users = await readUsers();
  return users.find(u => u.email === email);
}


export async function verifyPassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}

export async function setAuthCookie(payload: object) {
  const token = jwt.sign(payload, secret, { expiresIn: '7d' });
  (await cookies()).set({
    name:     cookieName,
    value:    token,
    httpOnly: true,
    sameSite: 'lax',
    path:     '/',
    maxAge:   60 * 60 * 24 * 7,
  });
}

export async function clearAuthCookie() {
  (await cookies()).set({
    name:   cookieName,
    value:  '',
    path:   '/',
    maxAge: 0,
  });
}
