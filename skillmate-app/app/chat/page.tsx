
'use client';

import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { AppSidebar } from '@/components/app-sidebar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

interface Message {
  id: string;
  userEmail: string;
  text: string;
  createdAt: string;
}

export default function ChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  // Load initial messages
  useEffect(() => {
    fetch('/api/chat/history')
      .then(r => r.json())
      .then((msgs: Message[]) => setMessages(msgs))
      .catch(() => {});
  }, []);

  // Poll every 3s
  useEffect(() => {
    const iv = setInterval(() => {
      fetch('/api/chat/history')
        .then(r => r.json())
        .then((msgs: Message[]) => setMessages(msgs))
        .catch(() => {});
    }, 3000);
    return () => clearInterval(iv);
  }, []);

  // Scroll on new
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSend(e: FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;

    const res = await fetch('/api/chat/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    if (res.ok) {
      setInput('');
      // Immediately fetch updated list
      fetch('/api/chat/history')
        .then(r => r.json())
        .then((msgs: Message[]) => setMessages(msgs));
    } else if (res.status === 401) {
      router.push('/login?callbackUrl=/chat');
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <AppSidebar />

      {/* Chat content */}
      <main className="flex-1 ml-64 px-6 py-8 flex flex-col">
        {/* Header */}
        <div className="flex items-center space-x-2 mb-4">
          <MessageCircle className="text-blue-600" size={28} />
          <h1 className="text-2xl font-bold">Community Chat</h1>
        </div>

        {/* Messages container */}
        <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map(msg => (
              <div
                key={msg.id}
                className="break-words px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700"
              >
                <div className="text-xs text-gray-600 dark:text-gray-300">
                  {msg.userEmail}{' '}
                  <span className="text-gray-500 dark:text-gray-400">
                    {new Date(msg.createdAt).toLocaleTimeString()}
                  </span>
                </div>
                <div>{msg.text}</div>
              </div>
            ))}
            <div ref={endRef} />
          </div>

          {/* Input area */}
          <form onSubmit={handleSend} className="px-4 py-3 border-t dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <Input
                type="text"
                placeholder="Type your message…"
                value={input}
                onChange={e => setInput(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" className={undefined} variant={undefined} size={undefined}>Send</Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
