

'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash, Check } from 'lucide-react';

type Notif = {
  id: number;
  type: string;
  payload: any;
  created_at: string;
  read_at: string | null;
};

const safeParse = async (res: Response) => {
  const ct = res.headers.get('content-type') || '';
  return ct.includes('application/json') ? res.json() : res.text();
};

export default function NotificationsPage() {
  const [items, setItems] = useState<Notif[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    const res = await fetch('/api/notifications', { cache: 'no-store' });
    const data = await safeParse(res);
    if (res.ok && Array.isArray(data)) setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const markRead = async (id: number) => {
    await fetch(`/api/notifications/${id}`, { method: 'PATCH' });
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n))
    );
  };

  const deleteNotif = async (id: number) => {
    await fetch(`/api/notifications/${id}`, { method: 'DELETE' });
    setItems((prev) => prev.filter((n) => n.id !== id));
  };

  const respondFriend = async (notif: Notif, accepted: boolean) => {
    const requestId = notif.payload?.requestId;
    if (!requestId) return;
    await fetch('/api/friends/incoming', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestId, accepted }),
    });
    deleteNotif(notif.id); 
  };

  const title = (t: string) =>
    ({
      session_requested: 'New session request',
      session_accepted: 'Session confirmed',
      session_declined: 'Session declined',
      session_cancelled: 'Session cancelled',
      reminder_24h: 'Upcoming session (24 h)',
      reminder_1h: 'Upcoming session (1 h)',
      friend_request_received: 'New friend request',
      friend_request_accepted: 'Friend request accepted',
      friend_request_rejected: 'Friend request rejected',
    }[t] || t);

  return (
    <main className="w-full lg:max-w-2xl lg:mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={load} disabled={loading} className={undefined} size={undefined}>
            {loading ? 'Loading…' : 'Refresh'}
          </Button>
          <Button
            variant="outline"
            onClick={async () => {
              await Promise.all(items.map((n) => markRead(n.id)));
            } } className={undefined} size={undefined}          >
            Mark all read
          </Button>
        </div>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No notifications.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((n) => (
            <li key={n.id} className={`border rounded p-3 ${!n.read_at ? 'bg-accent/20' : ''}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-medium">{title(n.type)}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(n.created_at).toLocaleString()}
                  </div>

                  {n.type === 'friend_request_received' && (
                    <div className="mt-2 flex gap-2">
                      <Button size="sm" onClick={() => respondFriend(n, true)} className={undefined} variant={undefined}>
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => respondFriend(n, false)} className={undefined}                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1">
                  {!n.read_at && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="w-6 h-6"
                      onClick={() => markRead(n.id)}
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    size="icon"
                    variant="ghost"
                    className="w-6 h-6"
                    onClick={() => deleteNotif(n.id)}
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
