

import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth-utils';

export const runtime = 'nodejs';             

export async function PATCH(
  _req: Request,
  ctx: { params: { id: string } }
) {
  try {
    const me = await getSession();
    if (!me)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

 
    const { id } = await ctx.params;

    await pool.execute(
      `UPDATE Notifications
          SET read_at = UTC_TIMESTAMP()
        WHERE id = ? AND user_id = ?`,
      [Number(id), me.id],
    );

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('PATCH /notifications/:id', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  ctx: { params: { id: string } }
) {
  try {
    const me = await getSession();
    if (!me)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

   
    const { id } = await ctx.params;

    await pool.execute(
      `UPDATE Notifications
          SET dismissed_at = UTC_TIMESTAMP()
        WHERE id = ? AND user_id = ?`,
      [Number(id), me.id],
    );

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('DELETE /notifications/:id', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
