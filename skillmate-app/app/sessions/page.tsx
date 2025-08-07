
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { CalendarCheck, GraduationCap } from 'lucide-react';
import {
  CheckCircle,
  XCircle,
  CalendarPlus,
  Clock,
  Loader2,
} from 'lucide-react';


type Status =
  | 'requested'
  | 'accepted'
  | 'declined'
  | 'cancelled'
  | 'completed';

export type Session = {
  id: number;
  teacher_id: number;
  student_id: number;
  start_utc: string;
  end_utc: string;
  status: Status;
  teacherName: string;
  studentName: string;
  skillName: string | null;
};

const badgeColor: Record<Status, 'secondary' | 'destructive' | 'success'> = {
  requested: 'secondary',
  accepted: 'success',
  declined: 'destructive',
  cancelled: 'destructive',
  completed: 'secondary',
};


const fmt = (ts: string) => {
  const d = ts.includes('T')
    ? new Date(ts)
    : new Date(ts.replace(' ', 'T') + 'Z');
  return d.toLocaleString(undefined, {
    dateStyle: 'short',
    timeStyle: 'short',
  });
};


export default function SessionsPage() {
  const router = useRouter();


  const [role, setRole] = useState<'all' | 'teacher' | 'student'>('all');
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

 
  useEffect(() => {
    fetch('/api/auth/session')
      .then((r) => r.json())
      .then((d) => setCurrentUserId(d?.session?.id ?? null))
      .catch(() => {});
  }, []);

  
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const qs = role === 'all' ? '' : `?role=${role}`;
      const res = await fetch(`/api/sessions${qs}`, { cache: 'no-store' });
      if (res.status === 401) {
        router.push('/login?callbackUrl=/sessions');
        return;
      }
      let data: unknown = [];
try {
  
  const text = await res.text();
  data = text ? JSON.parse(text) : [];
} catch {
  data = [];
}
+setSessions(Array.isArray(data) ? (data as Session[]) : []);
      setLoading(false);
    };
    load();
  }, [role, router]);

  /* helper for patching status */
  const patch = async (
    id: number,
    action: 'accept' | 'decline' | 'cancel'
  ) => {
    await fetch(`/api/sessions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    });
    setSessions((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              status:
                action === 'accept'
                  ? 'accepted'
                  : action === 'decline'
                  ? 'declined'
                  : 'cancelled',
            }
          : s
      )
    );
  };

  /* splits */
  const pending = sessions.filter((s) => s.status === 'requested');
  const upcoming = sessions.filter((s) => s.status === 'accepted');
  const history = sessions.filter(
    (s) => s.status !== 'requested' && s.status !== 'accepted'
  );

  /* ---------------------------------------------------------------- */
  return (
    <main className='max-w-3xl mx-auto p-6 space-y-8'>
      {/* Page header */}
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-bold'>My Sessions</h1>

        {/* role switch */}
        <Tabs
          defaultValue='all'
          value={role}
          onValueChange={(v: any) => setRole(v)}
        >
          <TabsList>
            <TabsTrigger value='all'>All</TabsTrigger>
            <TabsTrigger value='teacher'>Teacher</TabsTrigger>
            <TabsTrigger value='student'>Student</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {loading && (
        <p className='flex items-center gap-2 text-muted-foreground'>
          <Loader2 className='animate-spin w-4 h-4' />
          Loading…
        </p>
      )}

      {!loading && sessions.length === 0 && (
        <p className='text-muted-foreground'>You have no sessions yet.</p>
      )}

      {!loading && sessions.length > 0 && (
        <Tabs defaultValue='pending'>
          <TabsList className='mb-4'>
            <TabsTrigger value='pending'>Pending ({pending.length})</TabsTrigger>
            <TabsTrigger value='upcoming'>
              Upcoming ({upcoming.length})
            </TabsTrigger>
            <TabsTrigger value='history'>
              History ({history.length})
            </TabsTrigger>
          </TabsList>

          {/* ---------- Pending ---------- */}
          <TabsContent value='pending'>
            {pending.map((s) => {
              const meIsTeacher = currentUserId === s.teacher_id;
              const counterName = meIsTeacher ? s.studentName : s.teacherName;

              return (
                <Card key={s.id} className='mb-4'>
                  <CardHeader className='flex flex-row items-center justify-between gap-4'>
                    <div>
                      <h3 className='font-semibold'>
                        Lesson with {counterName}
                      </h3>
                      <p className='text-xs text-muted-foreground'>
                        {s.skillName ?? 'Skill'} • {fmt(s.start_utc)} →{' '}
                        {fmt(s.end_utc)}
                      </p>
                    </div>
                    <Badge variant={badgeColor[s.status]} className='capitalize'>
                      {s.status}
                    </Badge>
                  </CardHeader>

                  {/* teacher sees accept / decline ; student sees cancel */}
                  <CardContent className='flex gap-2'>
                    {meIsTeacher ? (
                      <>
                        <Button
                          size='sm'
                          onClick={() => patch(s.id, 'accept')}
                          className='flex items-center gap-1' variant={undefined}                        >
                          <CheckCircle size={16} />
                          Accept
                        </Button>
                        <Button
                          size='sm'
                          variant='destructive'
                          onClick={() => patch(s.id, 'decline')}
                          className='flex items-center gap-1'
                        >
                          <XCircle size={16} />
                          Decline
                        </Button>
                      </>
                    ) : (
                      <Button
                        size='sm'
                        variant='destructive'
                        onClick={() => patch(s.id, 'cancel')}
                        className='flex items-center gap-1'
                      >
                        <XCircle size={16} />
                        Cancel
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}

            {pending.length === 0 && (
              <p className='text-muted-foreground'>No pending sessions.</p>
            )}
          </TabsContent>

          {/*  Upcoming ---------- */}
          <TabsContent value='upcoming'>
            {upcoming.map((s) => {
              const meIsTeacher = currentUserId === s.teacher_id;
              const counterName = meIsTeacher ? s.studentName : s.teacherName;
              return (
                <Card key={s.id} className='mb-4'>
                  <CardHeader className='flex flex-row items-center justify-between gap-4'>
                    <div>
                      <h3 className='font-semibold'>
                        Lesson with {counterName}
                      </h3>
                      <p className='text-xs text-muted-foreground'>
                        {s.skillName ?? 'Skill'} • {fmt(s.start_utc)} →{' '}
                        {fmt(s.end_utc)}
                      </p>
                    </div>
                    <Badge variant={badgeColor[s.status]} className='capitalize'>
                      {s.status}
                    </Badge>
                  </CardHeader>
                  <CardContent className={undefined}>
                    <Badge variant='outline' className='flex gap-1 items-center'>
                      <Clock size={14} />
                      Starts {fmt(s.start_utc)}
                    </Badge>
                  </CardContent>
                </Card>
              );
            })}
            {upcoming.length === 0 && (
              <p className='text-muted-foreground'>No upcoming sessions.</p>
            )}
          </TabsContent>

          {/* History  */}
          <TabsContent value='history'>
            {history.map((s) => {
              const meIsTeacher = currentUserId === s.teacher_id;
              const counterName = meIsTeacher ? s.studentName : s.teacherName;
              return (
                <Card key={s.id} className='mb-4'>
                  <CardHeader className='flex flex-row items-center justify-between gap-4'>
                    <div>
                      <h3 className='font-semibold'>
                        Lesson with {counterName}
                      </h3>
                      <p className='text-xs text-muted-foreground'>
                        {s.skillName ?? 'Skill'} • {fmt(s.start_utc)} →{' '}
                        {fmt(s.end_utc)}
                      </p>
                    </div>
                    <Badge variant={badgeColor[s.status]} className='capitalize'>
                      {s.status}
                    </Badge>
                  </CardHeader>
                </Card>
              );
            })}
            {history.length === 0 && (
              <p className='text-muted-foreground'>No past sessions.</p>
            )}
          </TabsContent>
        </Tabs>
      )}
    </main>
  );
}
