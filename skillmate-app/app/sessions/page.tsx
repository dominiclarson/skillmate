'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type Role = 'all' | 'teacher' | 'student';

type Session = {
  id: number;
  teacher_id: number;
  student_id: number;
  teacher_name: string;
  student_name: string;
  start_utc: string; 
  end_utc: string;  
  status: 'requested' | 'accepted' | 'declined' | 'cancelled' | 'completed';
  notes?: string | null;
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

function statusBadgeColor(s: Session['status']) {
  switch (s) {
    case 'requested': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
    case 'accepted':  return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300';
    case 'declined':  return 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300';
    case 'cancelled': return 'bg-zinc-200 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200';
    case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    default:          return 'bg-zinc-200 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200';
  }
}

function fmtRangeUTC(startUtc: string, endUtc: string) {

  const s = new Date(startUtc + 'Z');
  const e = new Date(endUtc + 'Z');

  const left = s.toLocaleString(undefined, {
    month: 'numeric',
    day: 'numeric',
    year: '2-digit',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).replace(':00', ''); 

  const right = e.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).replace(':00', '');

  return `${left} → ${right}`;
}

export default function SessionsPage() {
  const [role, setRole] = useState<Role>('all');
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [highlightId, setHighlightId] = useState<number | null>(null);

  // Load sessions by role
  const load = async (r: Role) => {
    setLoading(true);
    setErr(null);
    try {
      const qs = r === 'all' ? '' : `?role=${r}`;
      const res = await fetch(`/api/sessions${qs}`, { cache: 'no-store' });
      if (!res.ok) {
        const j = await res.json().catch(() => null);
        setErr(j?.error || `Error ${res.status}`);
        setSessions([]);
        return;
      }
      const data = await res.json().catch(() => []);
      setSessions(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setErr(e?.message || 'Failed to load');
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(role);
   
  }, [role]);

  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    const n = url.searchParams.get('new');
    if (n) {
      setHighlightId(Number(n));
      
      url.searchParams.delete('new');
      window.history.replaceState({}, '', url.toString());
    }
  }, []);

  const grouped = useMemo(() => {
    return {
      requested: sessions.filter(s => s.status === 'requested'),
      upcoming: sessions.filter(s => s.status === 'accepted'),
      past: sessions.filter(s => ['declined', 'cancelled', 'completed'].includes(s.status)),
    };
  }, [sessions]);

  // Actions
  const act = async (id: number, action: 'accept' | 'decline' | 'cancel' | 'complete') => {
    const res = await fetch(`/api/sessions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => null);
      alert(j?.error || 'Action failed');
      return;
    }
    await load(role);
  };

  const del = async (id: number) => {
    if (!confirm('Delete this session?')) return;
    const res = await fetch(`/api/sessions/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const j = await res.json().catch(() => null);
      alert(j?.error || 'Delete failed');
      return;
    }
    await load(role);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      {}
      <div className="sticky top-0 z-10 -mx-4 mb-4 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 py-3 border-b">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold">Your Sessions</h1>
          <div
            role="tablist"
            aria-label="Filter by role"
            className="inline-flex rounded-lg border overflow-hidden"
          >
            {(['all', 'teacher', 'student'] as Role[]).map((r) => (
              <button
                key={r}
                role="tab"
                aria-selected={role === r}
                onClick={() => setRole(r)}
                className={`px-3 sm:px-4 py-2 text-sm capitalize transition
                  ${role === r
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background hover:bg-accent text-foreground'}`}
              >
                {r === 'all' ? 'All' : r === 'teacher' ? 'As Teacher' : 'As Student'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading*/}
      {loading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="border rounded-xl p-4 animate-pulse">
              <div className="h-4 w-1/3 bg-muted rounded mb-3" />
              <div className="h-3 w-2/3 bg-muted rounded mb-2" />
              <div className="h-3 w-1/2 bg-muted rounded" />
            </div>
          ))}
        </div>
      )}

      {err && !loading && (
        <div className="rounded-lg border border-rose-300 bg-rose-50 dark:border-rose-900/40 dark:bg-rose-900/10 p-4 text-rose-700 dark:text-rose-300">
          {err}
        </div>
      )}

      {!loading && !err && (
        <div className="space-y-10">
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
        </div>
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
  const { title, empty, items } = props;

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg sm:text-xl font-semibold">{title}</h2>
        <span className="text-xs sm:text-sm text-muted-foreground">{items.length} total</span>
      </div>

      {items.length === 0 ? (
        <div className="rounded-lg border p-6 text-muted-foreground">{empty}</div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((s) => (
            <li key={s.id}>
              <CardSession
                s={s}
                highlight={props.highlightId === s.id}
                onAccept={() => props.onAccept(s.id)}
                onDecline={() => props.onDecline(s.id)}
                onCancel={() => props.onCancel(s.id)}
                onComplete={() => props.onComplete(s.id)}
                onDelete={() => props.onDelete(s.id)}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
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
    <div
      className={`rounded-xl border p-4 h-full flex flex-col gap-3 transition-shadow ${
        highlight ? 'ring-2 ring-primary shadow-md' : 'hover:shadow-sm'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="font-medium truncate">
            Teacher: <span className="font-semibold">{s.teacher_name}</span>
          </div>
          <div className="font-medium truncate">
            Student: <span className="font-semibold">{s.student_name}</span>
          </div>
        </div>
        <Badge className={`${statusBadgeColor(s.status)} whitespace-nowrap`} variant={undefined}>
          {s.status}
        </Badge>
      </div>

      <div className="text-sm text-muted-foreground">
        {fmtRangeUTC(s.start_utc, s.end_utc)}
      </div>

      {s.notes && (
        <div className="text-sm bg-muted/50 rounded-md px-3 py-2">
          <span className="font-medium">Notes:</span> {s.notes}
        </div>
      )}

      {/* Actions */}
      <div className="mt-auto flex flex-wrap gap-2 pt-2">
        {s.status === 'requested' && (
          <>
            <Button onClick={onAccept} className="flex-1 sm:flex-none" variant={undefined} size={undefined}>
              Accept
            </Button>
            <Button variant="outline" onClick={onDecline} className="flex-1 sm:flex-none" size={undefined}>
              Decline
            </Button>
          </>
        )}

        {s.status === 'accepted' && (
          <>
            <Button variant="outline" onClick={onCancel} className="flex-1 sm:flex-none" size={undefined}>
              Cancel
            </Button>
            <Button onClick={onComplete} className="flex-1 sm:flex-none" variant={undefined} size={undefined}>
              Mark Complete
            </Button>
          </>
        )}

        {['declined', 'cancelled', 'completed'].includes(s.status) && (
          <Button variant="destructive" onClick={onDelete} className="flex-1 sm:flex-none" size={undefined}>
            Delete
          </Button>
        )}
      </div>
    </div>
  );
}
