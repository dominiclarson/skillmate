



import { sendMessage } from '@/lib/chat-utils';
import { NextResponse } from 'next/server';

/**
 * Sends a message to specified user
 * @param req - Request object containing toUserId and content
 * @returns JSON response indicating success or error
 */
export async function POST(req: Request) {
  const { toUserId, content } = await req.json();
  const result = await sendMessage(toUserId, content);
  return NextResponse.json(result);
}
