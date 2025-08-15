'use client';


   'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

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


/**
 * Session management page.
 * 
 * This component provides a interface for managing learning sessions
 * from both teacher and student perspectives. 
 * 
 * @component
 * @features
 * - **Organized Tabs**: Pending requests, upcoming sessions, and history
 * - **Responsive Design**: Mobile-optimized layout with adaptive components
 * - **Quick Actions**: Direct booking links and session management tools
 * 
 * @dependencies
 * - React hooks for state and effect management
 * - Next.js router for navigation and authentication
 * - Lucide React for consistent iconography
 * - shadcn/ui components for tabs, cards, and badges
 * - Custom session management utilities
 * 
 * @returns {JSX.Element} The rendered session management interface with tabs and controls
 */

function statusBadgeVariant(s: Session['status']) {
  switch (s) {
    case 'requested': return 'default';
    case 'accepted':  return 'default';
    case 'declined':  return 'destructive';
    case 'cancelled': return 'secondary';
    case 'completed': return 'default';
    default:          return 'secondary';
  }
}


function toDateFromDb(v: string | Date | null | undefined) {
  if (!v) return null;
  if (v instanceof Date) return isNaN(v.getTime()) ? null : v;

  const s = String(v).trim();
  // If it's already ISO or has timezone info, trust Date to parse it
  if (s.endsWith('Z') || s.includes('T') || /[+\-]\d{2}:?\d{2}$/.test(s)) {
    const d = new Date(s);
    return isNaN(d.getTime()) ? null : d;
  }
  // MySQL DATETIME "YYYY-MM-DD HH:MM:SS" (no TZ) → treat as UTC
  const d = new Date(s.replace(' ', 'T') + 'Z');
  return isNaN(d.getTime()) ? null : d;
}

function fmtRangeUTC(startUtc: string | Date, endUtc: string | Date) {
  const s = toDateFromDb(startUtc);
  const e = toDateFromDb(endUtc);
  if (!s || !e) return '—';

  const dateFmt: Intl.DateTimeFormatOptions = { month: 'numeric', day: 'numeric', year: '2-digit' };
  const timeFmt: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: '2-digit', hour12: true };

  const sDate = s.toLocaleDateString(undefined, dateFmt);
  const sTime = s.toLocaleTimeString(undefined, timeFmt).replace(':00', ''); // drop :00
  const eTime = e.toLocaleTimeString(undefined, timeFmt).replace(':00', '');

  return `${sDate}, ${sTime} → ${eTime}`;
}

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
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold">Your Sessions</h1>
        <Tabs value={role} onValueChange={(value) => setRole(value as Role)} className="w-auto">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="teacher">As Teacher</TabsTrigger>
            <TabsTrigger value="student">As Student</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {loading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-4 w-1/3 mb-3" />
                <Skeleton className="h-3 w-2/3 mb-2" />
                <Skeleton className="h-3 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {err && !loading && (
        <Card className="border-destructive">
          <CardContent className="p-4 text-destructive">
            {err}
          </CardContent>
        </Card>
      )}

      {!loading && !err && (
        <Tabs defaultValue="requests" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="requests">
              Requests ({grouped.requested.length})
            </TabsTrigger>
            <TabsTrigger value="upcoming">
              Upcoming ({grouped.upcoming.length})
            </TabsTrigger>
            <TabsTrigger value="history">
              History ({grouped.past.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="requests" className="space-y-4">
            <Section
              title="Requests"
              empty="No requests."
              items={grouped.requested}
              highlightId={highlightId}
              onAccept={(id) => act(id, 'accept')}
              onDecline={(id) => act(id, 'decline')}
              onCancel={(id) => act(id, 'cancel')}
              onComplete={(id) => act(id, 'complete')}
              onDelete={del}
            />
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-4">
            <Section
              title="Upcoming"
              empty="No upcoming sessions."
              items={grouped.upcoming}
              highlightId={highlightId}
              onAccept={(id) => act(id, 'accept')}
              onDecline={(id) => act(id, 'decline')}
              onCancel={(id) => act(id, 'cancel')}
              onComplete={(id) => act(id, 'complete')}
              onDelete={del}
            />
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Section
              title="History"
              empty="No past sessions."
              items={grouped.past}
              highlightId={highlightId}
              onAccept={(id) => act(id, 'accept')}
              onDecline={(id) => act(id, 'decline')}
              onCancel={(id) => act(id, 'cancel')}
              onComplete={(id) => act(id, 'complete')}
              onDelete={del}
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

function Section(props: {
  title: string;
  empty: string;
  items: Session[];
  highlightId: number | null;
  onAccept: (id: number) => void;
  onDecline: (id: number) => void;
  onCancel: (id: number) => void;
  onComplete: (id: number) => void;
  onDelete: (id: number) => void;
}) {
  const { empty, items } = props;

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          {empty}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((s) => (
        <CardSession
          key={s.id}
          s={s}
          highlight={props.highlightId === s.id}
          onAccept={() => props.onAccept(s.id)}
          onDecline={() => props.onDecline(s.id)}
          onCancel={() => props.onCancel(s.id)}
          onComplete={() => props.onComplete(s.id)}
          onDelete={() => props.onDelete(s.id)}
        />
      ))}
    </div>
  );
}

function CardSession({
  s,
  highlight,
  onAccept,
  onDecline,
  onCancel,
  onComplete,
  onDelete,
}: {
  s: Session;
  highlight?: boolean;
  onAccept: () => void;
  onDecline: () => void;
  onCancel: () => void;
  onComplete: () => void;
  onDelete: () => void;
}) {
  return (
    <Card className={`h-full ${highlight ? 'ring-2 ring-primary shadow-md' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-1">
            <CardTitle className="text-sm font-medium truncate">
              Teacher: {s.teacher_name}
            </CardTitle>
            <div className="text-sm font-medium truncate text-muted-foreground">
              Student: {s.student_name}
            </div>
          </div>
          <Badge variant={statusBadgeVariant(s.status)} className="whitespace-nowrap">
            {s.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          {fmtRangeUTC(s.start_utc, s.end_utc)}
        </div>

        {s.notes && (
          <div className="text-sm bg-muted/50 rounded-md px-3 py-2">
            <span className="font-medium">Notes:</span> {s.notes}
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {s.status === 'requested' && (
            <>
              <Button onClick={onAccept} className="flex-1 sm:flex-none">
                Accept
              </Button>
              <Button variant="outline" onClick={onDecline} className="flex-1 sm:flex-none">
                Decline
              </Button>
            </>
          )}

          {s.status === 'accepted' && (
            <>
              <Button variant="outline" onClick={onCancel} className="flex-1 sm:flex-none">
                Cancel
              </Button>
              <Button onClick={onComplete} className="flex-1 sm:flex-none">
                Mark Complete
              </Button>
            </>
          )}

          {['declined', 'cancelled', 'completed'].includes(s.status) && (
            <Button variant="destructive" onClick={onDelete} className="flex-1 sm:flex-none">
              Delete
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
