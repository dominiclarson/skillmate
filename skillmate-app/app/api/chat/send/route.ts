



import { sendMessage } from '@/lib/chat-utils';
import { NextResponse } from 'next/server';

/**
 * Chat message sending endpoint
 * 
 * Sends a message from the authenticated user to a specified recipient.
 * 
 * @route POST /api/chat/send
 * @param req - Request object containing message data
 * @param req.toUserId - Target recipient's user ID
 * @param req.content - Message content/text
 * @returns JSON response with message sending result
 * 
 */
export async function POST(req: Request) {
  const { toUserId, content } = await req.json();
  const result = await sendMessage(toUserId, content);
  return NextResponse.json(result);
}
