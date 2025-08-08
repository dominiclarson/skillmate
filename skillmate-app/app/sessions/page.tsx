

   'use client';

   import { useEffect, useState } from 'react';
   import { Badge } from '@/components/ui/badge';
import router from 'next/router';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import { CheckCircle, Clock, Loader2, XCircle } from 'lucide-react';
import { CardHeader, CardContent } from '@/components/ui/card';
import { Card, Button } from '@radix-ui/themes';
   
   
   type Status =
     | 'requested'
     | 'accepted'
     | 'declined'
     | 'cancelled'
     | 'completed';
   
   interface Session {
    
     id: number;
     teacher_id: number;
     student_id: number;
     teacherName: string;
     studentName: string;
     start_utc: string;
     end_utc: string;
     status: Status;
   }
   
   const colour: Record<Status, 'secondary' | 'success' | 'destructive'> = {
     requested: 'secondary',
     accepted: 'success',
     declined: 'destructive',
     cancelled: 'destructive',
     completed: 'secondary',
   };

   const fmt = (ts: string) =>
     new Date(ts.replace(' ', 'T') + 'Z').toLocaleString(undefined, {
       dateStyle: 'short',
       timeStyle: 'short',
     });
   
  
   export default function SessionsPage() {
     const [sessions, setSessions] = useState<Session[]>([]);
     const [currentUserId, setCurrentUserId] = useState<number | null>(null);
     const [role, setRole] = useState<'all' | 'teacher' | 'student'>('all');
     const [loading, setLoading] = useState(true);
   
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
    <main className="container mx-auto px-4 py-8">
      <div className="space-y-6 sm:space-y-8">
        <header className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:justify-between">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
              <CalendarCheck className="w-6 h-6 text-primary" />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Lessons
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base">Manage your skill sessions</p>
            </div>
          </div>
          <Button asChild className="w-full sm:w-auto" variant="default" size="default">
            <a href="/featured" className="flex items-center justify-center gap-2">
              <GraduationCap size={16} />
              <span className="sm:inline">Book a lesson</span>
            </a>
          </Button>
        </header>

        <div className="flex flex-wrap gap-2">
          {(['all', 'student', 'teacher'] as const).map((r) => (
            <Button
              key={r}
              variant={role === r ? 'default' : 'secondary'}
              size="sm"
              className=""
              onClick={() => setRole(r)}
            >
              {r === 'all' ? 'All Sessions' : r === 'student' ? 'As Student' : 'As Teacher'}
            </Button>
          ))}
        </div>

        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="pending" className="flex items-center gap-1 px-2 sm:px-4">
              <span className="truncate">Pending</span> 
              <Badge variant="secondary" className="text-xs">{pending.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="flex items-center gap-1 px-2 sm:px-4">
              <span className="truncate">Upcoming</span> 
              <Badge variant="secondary" className="text-xs">{upcoming.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-1 px-2 sm:px-4">
              <span className="truncate">History</span> 
              <Badge variant="secondary" className="text-xs">{history.length}</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {pending.length === 0 ? (
              <div className="text-center py-12">
                <CalendarCheck className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No pending requests</p>
                <p className="text-sm text-muted-foreground mt-1">New session requests will appear here</p>
              </div>
            ) : (
              pending.map((s) => (
                <Card key={s.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:justify-between pb-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-semibold text-base sm:text-lg truncate">Session #{s.id}</span>
                    </div>
                    <Badge variant={badgeColor[s.status]} className="capitalize self-start">{s.status}</Badge>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-2 text-muted-foreground">
                      <CalendarCheck className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span className="font-medium text-sm break-all">{fmt(s.start_utc)} → {fmt(s.end_utc)}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button size="sm" variant="default" onClick={() => patch(s.id, 'accept')} className="flex-1">Accept</Button>
                      <Button size="sm" variant="destructive" onClick={() => patch(s.id, 'decline')} className="flex-1">Decline</Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-4">
            {upcoming.length === 0 ? (
              <div className="text-center py-12">
                <GraduationCap className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No upcoming lessons</p>
                <p className="text-sm text-muted-foreground mt-1">Accepted sessions will appear here</p>
              </div>
            ) : (
              upcoming.map((s) => (
                <Card key={s.id} className="hover:shadow-md transition-shadow border-l-4 border-l-green-500">
                  <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:justify-between pb-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-semibold text-base sm:text-lg truncate">Session #{s.id}</span>
                    </div>
                    <Badge variant={badgeColor[s.status]} className="capitalize self-start">{s.status}</Badge>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-2 text-muted-foreground">
                      <CalendarCheck className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span className="font-medium text-sm break-all">{fmt(s.start_utc)} → {fmt(s.end_utc)}</span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => patch(s.id, 'cancel')}
                    >
                      Cancel Session
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            {history.length === 0 ? (
              <div className="text-center py-12">
                <CalendarCheck className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No session history</p>
                <p className="text-sm text-muted-foreground mt-1">Completed and cancelled sessions will appear here</p>
              </div>
            ) : (
              history.map((s) => (
                <Card key={s.id} className="opacity-80 hover:opacity-100 transition-opacity">
                  <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:justify-between pb-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-semibold text-base sm:text-lg truncate">Session #{s.id}</span>
                    </div>
                    <Badge variant={badgeColor[s.status]} className="capitalize self-start">{s.status}</Badge>
                  </CardHeader>
                  <CardContent className="">
                    <div className="flex items-start gap-2 text-muted-foreground">
                      <CalendarCheck className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span className="text-sm break-all">{fmt(s.start_utc)} → {fmt(s.end_utc)}</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>

        {loading && (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="ml-2 text-sm text-muted-foreground">Refreshing...</span>
          </div>
        )}
      </div>
    </main>
  );
}
