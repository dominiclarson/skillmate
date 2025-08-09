



import { sendMessage } from '@/lib/chat-utils';
import { NextResponse } from 'next/server';


export async function POST(req: Request) {
  const { toUserId, content } = await req.json();
  const result = await sendMessage(toUserId, content);
  return NextResponse.json(result);
}
