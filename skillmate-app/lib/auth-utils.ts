




import pool from './db'; 
import bcrypt from 'bcryptjs'; 
import jwt from 'jsonwebtoken'; 
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET!;
const COOKIE_NAME = process.env.COOKIE_NAME!;

// Registeruser
export async function createUser({
  firstName,
  lastName,
  email,
  password,
}: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) {
  const hashed = await bcrypt.hash(password, 10);

  const [result]: any = await pool.execute(
    `INSERT INTO Users (first_name, last_name, email, password)
           VALUES (?, ?, ?, ?)`,
    [firstName, lastName, email, hashed],
  );

  return {
    id: result.insertId,
    firstName,
    lastName,
    email,
  };
}


// user by email
export async function findUserByEmail(email: string) {
  const [rows] = await pool.execute(
    'SELECT id, email, password FROM Users WHERE email = ? LIMIT 1',
    [email]
  );
  const list = rows as Array<{ id: number; email: string; password: string }>;
  return list[0] || null;
}


export async function verifyPassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}


export async function setAuthCookie(user: { id: number; email: string }) {
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
  
  // 常にデバッグログを出力
  console.log('Setting auth cookie:', {
    cookieName: COOKIE_NAME,
    tokenExists: !!token,
    userId: user.id,
    secure: process.env.NODE_ENV === 'production',
    nodeEnv: process.env.NODE_ENV
  });
  
  (await cookies()).set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
    ...(process.env.NODE_ENV === 'production' && { domain: undefined })
  });
}


export async function clearAuthCookie() {
  (await cookies()).set({
    name: COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
    ...(process.env.NODE_ENV === 'production' && { domain: undefined })
  });
}


export async function getSession() {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  
  // 常にデバッグログを出力
  console.log('Getting session:', {
    cookieName: COOKIE_NAME,
    hasToken: !!token,
    allCookieNames: Array.from(store.getAll()).map(c => c.name),
    nodeEnv: process.env.NODE_ENV
  });
  
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET) as { id: number; email: string };
  } catch (error) {
    console.log('JWT verification failed:', error);
    return null; 
  }
}
