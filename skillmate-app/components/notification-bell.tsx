

'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Bell,
  Check,
  X,
  Calendar,
  MessageCircle,
  UserPlus,
  Trash,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type Notif = {
  id: number;
  user_id: number;
  type: string;
  payload: any;
  channel: 'in_app' | 'email';
  created_at: string;
  read_at: string | null;
};


const safeParse = async (res: Response) => {
  const ct = res.headers.get('content-type') || '';
  return ct.includes('application/json') ? res.json() : res.text();
};


export function NotificationBell() {
  const [items, setItems] = useState<Notif[]>([]);
  const [open, setOpen] = useState(false);

  const unread = useMemo(
    () => items.filter((n) => !n.read_at).length,
    [items]
  );

  const load = async () => {
    const res = await fetch('/api/notifications', { cache: 'no-store' });
    const data = await safeParse(res);
    if (res.ok && Array.isArray(data)) setItems(data);
  };

  useEffect(() => {
    load();
    const t = setInterval(load, 30000); 
    return () => clearInterval(t);
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
    const res = await fetch('/api/friends/incoming', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestId, accepted }),
    });
    if (res.ok) deleteNotif(notif.id); 
  };

  
  const label = (n: Notif) => {
    switch (n.type) {
      case 'session_requested':
        return 'New session request';
      case 'session_accepted':
        return 'Session confirmed';
      case 'session_declined':
        return 'Session declined';
      case 'session_cancelled':
        return 'Session cancelled';
      case 'reminder_24h':
        return 'Upcoming session (24 h)';
      case 'reminder_1h':
        return 'Upcoming session (1 h)';
      case 'friend_request_received':
        return 'New friend request';
      case 'friend_request_accepted':
        return 'Friend request accepted';
      case 'friend_request_rejected':
        return 'Friend request rejected';
      default:
        return n.type;
    }
  };

  const Icon = (n: Notif) => {
    switch (n.type) {
      case 'friend_request_received':
        return <UserPlus className="w-4 h-4" />;
      case 'session_requested':
        return <Calendar className="w-4 h-4" />;
      case 'session_accepted':
      case 'friend_request_accepted':
        return <Check className="w-4 h-4" />;
      case 'session_declined':
      case 'friend_request_rejected':
      case 'session_cancelled':
        return <X className="w-4 h-4" />;
      case 'reminder_24h':
      case 'reminder_1h':
        return <Bell className="w-4 h-4" />;
      default:
        return <MessageCircle className="w-4 h-4" />;
    }
  };

  
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
          <Bell className="w-5 h-5" />
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-96 max-h-[70vh] overflow-y-auto">
        <DropdownMenuLabel className="flex items-center justify-between" inset={undefined}>
          <span>Notifications</span>
          {unread > 0 && (
            <Button
              size="sm"
              variant="ghost"
              onClick={async () => {
                await Promise.all(items.map((n) => markRead(n.id)));
              } } className={undefined}            >
              Mark all read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className={undefined} />

        {items.length === 0 ? (
          <DropdownMenuItem disabled className={undefined} inset={undefined}>No notifications</DropdownMenuItem>
        ) : (
          items.slice(0, 20).map((n) => (
            <div key={n.id} className={`px-3 py-2 border-b last:border-0 ${!n.read_at ? 'bg-accent/30' : ''}`}>
              <div className="flex items-start gap-2">
                <div className="mt-1">{Icon(n)}</div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{label(n)}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(n.created_at).toLocaleString()}
                  </div>

                  {/* inline friend actions */}
                  {n.type === 'friend_request_received' && (
                    <div className="mt-2 flex gap-2">
                      <Button size="sm" onClick={() => respondFriend(n, true)} className={undefined} variant={undefined}>Accept</Button>
                      <Button size="sm" variant="destructive" onClick={() => respondFriend(n, false)} className={undefined}>Reject</Button>
                    </div>
                  )}
                </div>

                {/* right-side controls */}
                <div className="flex flex-col items-end gap-1">
                  {!n.read_at && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="w-5 h-5"
                      onClick={() => markRead(n.id)}
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    size="icon"
                    variant="ghost"
                    className="w-5 h-5"
                    onClick={() => deleteNotif(n.id)}
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}

        {items.length > 0 && (
          <>
            <DropdownMenuSeparator className={undefined} />
            <DropdownMenuItem asChild className={undefined} inset={undefined}>
              <a href="/notifications">Open all notifications</a>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
