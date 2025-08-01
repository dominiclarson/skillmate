





import pool from './db';
import bcrypt from 'bcryptjs';

export async function updateUserProfile(
  email: string,
  data: { name: string; bio?: string }
) {
  const [result] = await pool.execute(
    'UPDATE Users SET name = ?, bio = ? WHERE email = ?',
    [data.name, data.bio || null, email]
  );
  
  const [rows] = await pool.execute(
    'SELECT id, email, name, bio FROM Users WHERE email = ? LIMIT 1',
    [email]
  );
  const users = rows as Array<{ id: number; email: string; name: string; bio: string }>;
  return users[0] || null;
}

export async function changeUserPassword(
  email: string,
  currentPassword: string,
  newPassword: string
) {
  const [rows] = await pool.execute(
    'SELECT password FROM Users WHERE email = ? LIMIT 1',
    [email]
  );
  const users = rows as Array<{ password: string }>;
  if (!users[0]) throw new Error('User not found');

  const valid = await bcrypt.compare(currentPassword, users[0].password);
  if (!valid) throw new Error('Incorrect password');

  const hashed = await bcrypt.hash(newPassword, 10);
  await pool.execute(
    'UPDATE Users SET password = ? WHERE email = ?',
    [hashed, email]
  );
}
