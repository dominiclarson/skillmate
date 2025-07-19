

'use client';

import { useState, useEffect, useRef, FormEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Message as MsgType } from '@/lib/message-store';

export default function ChatPage() {
  const { userId } = useParams();
  const router = useRouter();
  const [msgs, setMsgs] = useState<MsgType[]>([]);
  const [text, setText] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!userId) return;
    let alive = true;

    async function load() {
      const res = await fetch(`/api/messages/${userId}`);
      if (!alive) return;
      if (res.ok) setMsgs(await res.json());
      else router.push('/login');
    }

    load();
    const iv = setInterval(load, 2000);
    return () => { alive = false; clearInterval(iv); };
  }, [userId, router]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!text.trim() || !userId) return;
    await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: Number(userId), text }),
    });
    setText('');
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-auto p-4 space-y-2 bg-gray-50 dark:bg-gray-800">
        {msgs.map(m => (
          <div key={m.id} className={`max-w-xs p-2 rounded ${m.from === 1 ? 'bg-blue-600 text-white self-end' : 'bg-gray-200 text-black self-start'}`}>
            {m.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={handleSubmit} className="p-2 flex">
        <input value={text} onChange={e => setText(e.target.value)} placeholder="Type a message…" className="flex-grow border rounded px-3 py-2 mr-2" />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Send</button>
      </form>
    </div>
  );
}