




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
  (await cookies()).set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, 
  });
}


export async function clearAuthCookie() {
  (await cookies()).set({
    name: COOKIE_NAME,
    value: '',
    httpOnly: true,
    path: '/',
    maxAge: 0,
  });
}


export async function getSession() {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET) as { id: number; email: string };
  } catch {
    return null; 
  }
}
