

import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession, clearAuthCookie } from '@/lib/auth-utils';

export const runtime = 'nodejs';            

/**
 * Deletes the current user's account and all associated data
 * @returns JSON response indicating success or error
 */
export async function DELETE() {
  const me = await getSession();
  if (!me)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
  
    await pool.execute('DELETE FROM Messages       WHERE sender_id   = ? OR receiver_id = ?', [me.id, me.id]);
    await pool.execute('DELETE FROM FriendRequests WHERE sender_id   = ? OR receiver_id = ?', [me.id, me.id]);
    await pool.execute('DELETE FROM Sessions       WHERE teacher_id  = ? OR student_id  = ?', [me.id, me.id]);
    await pool.execute('DELETE FROM Notifications  WHERE user_id = ?', [me.id]);
    await pool.execute('DELETE FROM user_has_skill  WHERE user_id = ?', [me.id]);
    await pool.execute('DELETE FROM user_wants_skill WHERE user_id = ?', [me.id]);
  
    
    await pool.execute('DELETE FROM Users WHERE id = ?', [me.id]);
  
    await clearAuthCookie();
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('Delete account error', e);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
  