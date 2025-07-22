


'use client';

import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import ChatPanel from './ChatPanel';

export function ChatFloatingButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating toggle button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 z-50"
        aria-label="Toggle chat"
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat panel */}
      {open && <ChatPanel onClose={() => setOpen(false)} />}
    </>
  );
}
