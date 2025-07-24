

import pool from './db';
import { getSession } from './auth-utils';

export async function sendFriendRequest(toUserId: number) {
  const session = await getSession();
  if (!session) return { success: false, error: 'Not authenticated' };

  await pool.execute(
    `INSERT INTO FriendRequests (sender_id, receiver_id, status) VALUES (?, ?, 'pending')`,
    [session.id, toUserId]
  );

  return { success: true };
}
