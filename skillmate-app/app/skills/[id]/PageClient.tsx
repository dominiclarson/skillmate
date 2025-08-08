


   'use client';

import { useRouter } from 'next/navigation';
import QuickScheduleDialog from '@/components/QuickScheduleDialog';

interface Teacher {
  id: number;
  name: string | null;
}

export default function PageClient({ teacher }: { teacher: Teacher }) {
  const router = useRouter();

  return (
    <QuickScheduleDialog
      teacher={{ id: teacher.id, name: teacher.name ?? 'Unnamed teacher' }}
      onCreated={(sid) => router.push(`/sessions?new=${sid}`)}
    />
  );
}
