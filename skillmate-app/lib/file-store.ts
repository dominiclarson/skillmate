import fs from 'fs/promises';
import path from 'path';

const file = path.join(process.cwd(), 'data', 'users.json');

export type User = {
  id: number;
  email: string;
  hash: string;
};

export async function readUsers(): Promise<User[]> {
  try {
    const raw = await fs.readFile(file, 'utf-8');
    return JSON.parse(raw) as User[];
  } catch {
    return [];                      
  }
}

export async function writeUsers(users: User[]) {
  
  await fs.mkdir(path.dirname(file), { recursive: true });
  
  await fs.writeFile(file, JSON.stringify(users, null, 2), 'utf-8');
}
