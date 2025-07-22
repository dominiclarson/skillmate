



'use client';

import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Message {
  id: string;
  userEmail: string;
  text: string;
  createdAt: string;
}

export default function ChatPanel({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  // Fetch messages function
  async function fetchMessages() {
    const res = await fetch('/api/chat/history');
    if (res.ok) {
      const data: Message[] = await res.json();
      setMessages(data);
    }
  }

  // Poll every 3s
  useEffect(() => {
    fetchMessages();
    const iv = setInterval(fetchMessages, 3000);
    return () => clearInterval(iv);
  }, []);

  // Scroll on new messages
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send a message
  async function sendMessage(e: FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    const res = await fetch('/api/chat/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: input.trim() }),
    });
    if (res.ok) {
      setInput('');
      fetchMessages();
    } else if (res.status === 401) {
      router.push('/login');
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-end">
      <div className="w-full max-w-md h-full bg-white dark:bg-gray-800 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-semibold">Chat</h2>
          <button onClick={onClose} aria-label="Close chat"><X size={20} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map(m => (
            <div key={m.id} className="break-words px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-700">
              <span className="block text-xs text-gray-600">{m.userEmail}</span>
              <span>{m.text}</span>
              <span className="block text-xs text-gray-500 mt-1">
                {new Date(m.createdAt).toLocaleTimeString()}
              </span>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        <form onSubmit={sendMessage} className="p-4 border-t dark:border-gray-700">
          <div className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type a message…"
              className="flex-1 rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2">
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
