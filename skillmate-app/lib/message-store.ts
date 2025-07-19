import fs from 'fs/promises';
import path from 'path';

export type Message = {
  id: number;
  from: number;
  to: number;
  text: string;
  timestamp: number;
};

const filePath = path.join(process.cwd(), 'data', 'messages.json');

export async function readMessages(): Promise<Message[]> {
  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(raw) as Message[];
  } catch {
    return [];
  }
}

export async function writeMessages(msgs: Message[]) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(msgs, null, 2), 'utf-8');
}
