


import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-file';
import { updateUserProfile } from '@/lib/user-service';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { name, bio, notificationsEnabled } = await req.json();

  try {
    const updated = await updateUserProfile(session.user.email, {
      name,
      bio,
      notificationsEnabled,
    });
    return NextResponse.json({ user: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
