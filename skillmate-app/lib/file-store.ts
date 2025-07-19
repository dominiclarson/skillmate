import fs from 'fs/promises';
import path from 'path';
const filePath = path.join(process.cwd(), 'data', 'users.json');
export type User = { id: number; email: string; hash: string };
export async function readUsers(): Promise<User[]> {
  try { const raw = await fs.readFile(filePath, 'utf-8'); return JSON.parse(raw); }
  catch { return []; }
}
export async function writeUsers(users: User[]) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(users, null, 2), 'utf-8');
}