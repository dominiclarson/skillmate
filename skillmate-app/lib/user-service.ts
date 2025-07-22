





import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function updateUserProfile(
  email: string,
  data: { name: string; bio?: string; notificationsEnabled: boolean }
) {
  return prisma.user.update({
    where: { email },
    data: {
      name: data.name,
      bio: data.bio,
      notificationsEnabled: data.notificationsEnabled,
    },
    select: {
      id: true,
      email: true,
      name: true,
      bio: true,
      notificationsEnabled: true,
    },
  });
}

export async function changeUserPassword(
  email: string,
  currentPassword: string,
  newPassword: string
) {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { password: true },
  });
  if (!user) throw new Error('User not found');

  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid) throw new Error('Incorrect password');

  const hashed = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { email },
    data: { password: hashed },
  });
}
