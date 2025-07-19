

import { NextResponse } from 'next/server';
import { readMessages } from '@/lib/message-store';
import { getCurrentUser } from '@/lib/session-helper';

export async function GET(
  req: Request,
  context: { params: Promise<{ userId: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { userId } = await context.params;
  const otherId = Number(userId);
  const msgs = await readMessages();
  const convo = msgs
    .filter(m =>
      (m.from === user.id && m.to === otherId) ||
      (m.from === otherId && m.to === user.id)
    )
    .sort((a, b) => a.timestamp - b.timestamp);

  return NextResponse.json(convo);
}