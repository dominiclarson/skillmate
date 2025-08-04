

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const safeParse = async (res: Response) => {
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) {
    try { return await res.json(); } catch { return null; }
  }
  try { return await res.text(); } catch { return null; }
};

export function QuickScheduleDialog({
  teacher,
}: {
  teacher: { id: number; name?: string | null; email: string };
}) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [startLocal, setStartLocal] = useState('');
  const [note, setNote] = useState('');
  const [err, setErr] = useState('');
  const [posting, setPosting] = useState(false);

  const submit = async () => {
    setErr('');
    if (!startLocal) {
      setErr('Pick a start time');
      return;
    }

    setPosting(true);
    try {
      const res = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacherId: teacher.id,
          startUtc: new Date(startLocal).toISOString(), 
          notes: note || null,
        }),
      });

      
      if (res.status === 401) {
        router.push('/login?callbackUrl=/skills/' + teacher.id);
        return;
      }

      const payload = await safeParse(res);

      if (!res.ok) {
        setErr(
          (typeof payload === 'string' ? payload : payload?.error) ||
          `Error ${res.status}`
        );
        return;
      }

      alert('Lesson requested! The teacher will confirm.');
      setOpen(false);
      setStartLocal('');
      setNote('');
    } catch (e: any) {
      setErr('Request failed. Check your connection.');
    } finally {
      setPosting(false);
    }
  };

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)} className={undefined} variant={undefined}>
        Book lesson
      </Button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-5 w-[380px]">
            <h3 className="text-lg font-semibold mb-4">
              {teacher.name || teacher.email}
            </h3>

            <label className="block text-sm mb-1">Start (1-hour lesson)</label>
            <Input
              type="datetime-local"
              value={startLocal}
              onChange={(e) => setStartLocal(e.target.value)} className={undefined}            />

            <label className="block text-sm mt-3 mb-1">Notes (optional)</label>
            <Input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Anything the teacher should know" className={undefined} type={undefined}            />

            {err && <p className="text-red-600 text-sm mt-2">{err}</p>}

            <div className="mt-4 flex justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => {
                  setOpen(false);
                  setErr('');
                } } className={undefined} size={undefined}              >
                Cancel
              </Button>
              <Button onClick={submit} disabled={posting || !startLocal} className={undefined} variant={undefined} size={undefined}>
                {posting ? 'Sending…' : 'Request'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
