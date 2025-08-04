
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { CalendarCheck, GraduationCap } from 'lucide-react';


type Status =
  | 'requested'
  | 'accepted'
  | 'declined'
  | 'cancelled'
  | 'completed';

type Session = {
  id: number;
  teacher_id: number;
  student_id: number;
  start_utc: string;
  end_utc: string;
  status: Status;
};

const fmt = (iso: string) =>
  new Date(iso + 'Z').toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

const badgeColor: Record<Status, 'secondary' | 'destructive' | 'success'> = {
  requested: 'secondary',
  accepted: 'success',
  declined: 'destructive',
  cancelled: 'destructive',
  completed: 'secondary',
};


export default function SessionsPage() {
  const router = useRouter();
  const [role, setRole] = useState<'all' | 'student' | 'teacher'>('all');
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);

 
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const qs = role === 'all' ? '' : `?role=${role}`;
      const res = await fetch(`/api/sessions${qs}`, { cache: 'no-store' });

      if (res.status === 401) {
        router.push('/login?callbackUrl=/sessions');
        return;
      }
      const data = (await res.json().catch(() => [])) as Session[];
      setSessions(Array.isArray(data) ? data : []);
      setLoading(false);
    };
    load();
  }, [role, router]);

  
  const patch = (id: number, action: 'accept' | 'decline' | 'cancel') =>
    fetch(`/api/sessions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    }).then(() =>
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
      )
    );

  
  const pending = sessions.filter((s) => s.status === 'requested');
  const upcoming = sessions.filter((s) => s.status === 'accepted');
  const history = sessions.filter(
    (s) => s.status === 'completed' || s.status === 'declined' || s.status === 'cancelled'
  );

  return (
    <main className="w-full lg:max-w-2xl lg:mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <CalendarCheck className="w-7 h-7" />
          Lessons
        </h1>
        <Button asChild variant="secondary" className={undefined} size={undefined}>
          <a href="/featured" className="flex items-center gap-2">
            <GraduationCap size={16} />
            Book a lesson
          </a>
        </Button>
      </header>

      {}
      <div className="flex gap-2">
        {(['all', 'student', 'teacher'] as const).map((r) => (
          <Button
            key={r}
            variant={role === r ? 'default' : 'outline'}
            size="sm"
            onClick={() => setRole(r)} className={undefined}          >
            {r === 'all' ? 'All' : r === 'student' ? 'As Student' : 'As Teacher'}
          </Button>
        ))}
      </div>

      {/* tabs */}
      <Tabs defaultValue="pending">
        <TabsList className="mb-4">
          <TabsTrigger value="pending">Pending ({pending.length})</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming ({upcoming.length})</TabsTrigger>
          <TabsTrigger value="history">History ({history.length})</TabsTrigger>
        </TabsList>

        {/* PENDING */}
        <TabsContent value="pending">
          {pending.length === 0 ? (
            <p className="text-muted-foreground text-sm">No pending requests.</p>
          ) : (
            pending.map((s) => (
              <Card key={s.id} className={undefined}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <span className="font-medium">#{s.id}</span>
                  <Badge variant={badgeColor[s.status]} className={undefined}>{s.status}</Badge>
                </CardHeader>
                <CardContent className="space-y-1">
                  <p>{fmt(s.start_utc)} → {fmt(s.end_utc)}</p>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" onClick={() => patch(s.id, 'accept')} className={undefined} variant={undefined}>Accept</Button>
                    <Button size="sm" variant="destructive" onClick={() => patch(s.id, 'decline')} className={undefined}>Decline</Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/*UPCOMING */}
        <TabsContent value="upcoming">
          {upcoming.length === 0 ? (
            <p className="text-muted-foreground text-sm">No upcoming lessons.</p>
          ) : (
            upcoming.map((s) => (
              <Card key={s.id} className={undefined}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <span className="font-medium">#{s.id}</span>
                  <Badge variant={badgeColor[s.status]} className={undefined}>{s.status}</Badge>
                </CardHeader>
                <CardContent className="space-y-1">
                  <p>{fmt(s.start_utc)} → {fmt(s.end_utc)}</p>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="mt-3"
                    onClick={() => patch(s.id, 'cancel')}
                  >
                    Cancel
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/*  HISTORY */}
        <TabsContent value="history">
          {history.length === 0 ? (
            <p className="text-muted-foreground text-sm">No past lessons.</p>
          ) : (
            history.map((s) => (
              <Card key={s.id} className={undefined}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <span className="font-medium">#{s.id}</span>
                  <Badge variant={badgeColor[s.status]} className={undefined}>{s.status}</Badge>
                </CardHeader>
                <CardContent className={undefined}>
                  <p>{fmt(s.start_utc)} → {fmt(s.end_utc)}</p>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      {loading && <p className="text-sm">Refreshing…</p>}
    </main>
  );
}
