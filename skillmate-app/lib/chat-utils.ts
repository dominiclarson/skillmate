


import pool from './db';
import { getSession } from './auth-utils';

export async function getConnections() {
  const session = await getSession();
  if (!session) return [];

  const [rows] = await pool.execute(
    `SELECT DISTINCT 
       CASE 
         WHEN sender_id = ? THEN receiver_id 
         ELSE sender_id 
       END AS user_id 
     FROM FriendRequests 
     WHERE (sender_id = ? OR receiver_id = ?) AND status = 'accepted'`,
    [session.id, session.id, session.id]
  );

  return rows as { user_id: number }[];
}


export async function getMessages(withUserId: number) {
  const session = await getSession();
  if (!session) return [];

  const [rows] = await pool.execute(
    `SELECT * FROM Messages 
     WHERE (sender_id = ? AND receiver_id = ?) 
        OR (sender_id = ? AND receiver_id = ?)
     ORDER BY created_at ASC`,
    [session.id, withUserId, withUserId, session.id]
  );

  return rows;
}

// Send message
export async function sendMessage(toUserId: number, content: string) {
  const session = await getSession();
  if (!session) return { success: false };

  await pool.execute(
    `INSERT INTO Messages (sender_id, receiver_id, content) VALUES (?, ?, ?)`,
    [session.id, toUserId, content]
  );

  return { success: true };
}
