

import { NextResponse } from 'next/server';
import { readMessages, writeMessages, Message } from '@/lib/message-store';
import { getCurrentUser } from '@/lib/session-helper';

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { to, text } = await req.json();
  const msgs = await readMessages();
  const newMsg: Message = {
    id: Date.now(),
    from: user.id,
    to,
    text,
    timestamp: Date.now(),
  };
  await writeMessages([...msgs, newMsg]);
  return NextResponse.json(newMsg);
}