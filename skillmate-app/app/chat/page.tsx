
// app/chat/page.tsx
'use client';

import React from 'react';
import ChatPanel from '@/components/ChatPanel';

export default function ChatPage() {
  return <ChatPanel onClose={() => { /* maybe navigate back */ }} />;
}
