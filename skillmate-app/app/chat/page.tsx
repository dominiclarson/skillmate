
'use client';

import {
  useEffect,
  useState,
  useCallback,
  useRef,
  useLayoutEffect,
} from 'react';
import useSocket from '@/lib/useSocket';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';


interface Friend {
  id: number;
  name: string;
  email: string;
}


interface Message {
  id: number;
  content: string;
  sender_id: number;
  receiver_id: number;
  ts: number;          
  failed?: boolean;    
}

/**
 * Chat interface component.
 * 
 * This component provides a messaging system that allows authenticated
 * users to communicate with their confirmed friends and connections. It features
 * a two-pane interface with a friend list sidebar and an active chat window.
 * 
 * @component
 * @features
 * - **Messaging**: Send and receive messages with confirmed connections
 * - **Friend Management**: View and select from confirmed friends
 * - **Message History**: Load and display conversation history
 * 
 * @dependencies
 * - React hooks for state and effect management
 * - Lucide React for consistent iconography
 * - shadcn/ui components for polished interface
 * - Custom API endpoints for chat functionality
 * 
 * @returns {JSX.Element} The rendered chat interface with friend list and messaging
 */
export default function ChatPage() {
 
  const [me, setMe]           = useState<number | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [sel, setSel]         = useState<Friend | null>(null);
  const [msgs, setMsgs]       = useState<Msg[]>([]);
  const [text, setText]       = useState('');
  const [typingFromFriend, setTypingFromFriend] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  /* session + friends */
  useEffect(() => {
    fetch('/api/auth/session')
      .then((r) => r.json())
      .then((d) => setMe(d?.session?.id ?? null));

    fetch('/api/chat/connections')
      .then((r) => r.json())
      .then(setFriends)
      .catch(() => {});
  }, []);

  /*load history */
  useEffect(() => {
    if (!sel) return;
    fetch(`/api/chat/messages?userId=${sel.id}`)
      .then((r) => r.json())
      .then((d) => setMsgs(Array.isArray(d) ? d : []))
      .catch(() => setMsgs([]));
  }, [sel]);

  /*socket setup */
  const r = sel && me ? room(me, sel.id) : 'noop';
  const { send } = useSocket<any>(r, (payload) => {
    if (payload.type === 'msg') {
      setMsgs((p) => [...p, payload.data as Msg]);
    } else if (payload.type === 'typing') {
      setTypingFromFriend(true);
      setTimeout(() => setTypingFromFriend(false), 3000);
    }
  });

  /* scroll on new msgs  */
  useLayoutEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs, typingFromFriend]);

  /* ───── send helpers  */
  const emitTyping = useCallback(() => {
    if (sel) send({ type: 'typing' });
  }, [sel, send]);

  const handleSend = useCallback(() => {
    if (!text.trim() || !sel || !me) return;

    const optimistic: Msg = {
      sender_id: me,
      receiver_id: sel.id,
      content: text.trim(),
      ts: Date.now(),
    };
    setMsgs((p) => [...p, optimistic]);
    setText('');

    /* websocket broadcast */
    send({ type: 'msg', data: optimistic });

    
    fetch('/api/chat/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ toUserId: sel.id, content: optimistic.content }),
    }).catch(() => {
      // flag failure
      setMsgs((p) =>
        p.map((m) =>
          m === optimistic ? { ...m, failed: true } : m
        )
      );
    });
  }, [text, sel, me, send]);

  /*  UI */
  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* friends list */}
      <aside className="w-64 shrink-0 border-r px-4 py-6 bg-muted/40 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Friends</h2>
        {friends.length === 0 && (
          <p className="text-sm text-muted-foreground">No connections yet.</p>
        )}
        <ul className="space-y-2">
          {friends.map((f) => (
            <li
              key={f.id}
              onClick={() => setSel(f)}
              className={`cursor-pointer p-2 rounded hover:bg-accent transition
                ${sel?.id === f.id ? 'bg-accent text-accent-foreground' : ''}`}
            >
              <div className="font-medium">{f.name}</div>
              <div className="text-xs text-muted-foreground">{f.email}</div>
            </li>
          ))}
        </ul>
      </aside>

      {/* chat panel */}
      <main className="flex-1 flex flex-col">
        {!sel ? (
          <div className="m-auto text-muted-foreground">
            Select a friend to start chatting.
          </div>
        ) : (
          <>
            {/* header */}
            <header className="border-b px-6 py-3">
              <h3 className="text-xl font-bold">Chat with {sel.name}</h3>
            </header>

            {/* message list */}
            <section className="flex-1 overflow-y-auto px-6 py-4 space-y-2 bg-background">
              {msgs.map((m, i) => (
                <div
                  key={i}
                  className={`max-w-xs px-3 py-2 rounded relative ${
                    m.sender_id === me
                      ? 'ml-auto bg-primary text-primary-foreground'
                      : 'mr-auto bg-muted'
                  } ${m.failed ? 'ring-2 ring-red-500' : ''}`}
                >
                  {m.content}
                </div>
              ))}

              {/* typing indicator */}
              {typingFromFriend && (
                <div className="mr-auto text-sm text-muted-foreground">
                  {sel.name} is typing…
                </div>
              )}

              <div ref={bottomRef} />
            </section>

            {/* input bar */}
            <footer className="border-t px-6 py-3">
              <div className="flex gap-2">
                <Input
                    value={text}
                    onChange={(e) => {
                      setText(e.target.value);
                      emitTyping();
                    } }
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Type a message…" className={undefined} type={undefined}                />
                <Button disabled={!text.trim()} onClick={handleSend} className={undefined} variant={undefined} size={undefined}>
                  <SendHorizonal size={16} />
                </Button>
              </div>
            </footer>
          </>
        )}
      </main>
    </div>
  );
}
