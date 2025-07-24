

'use client';

import { ChatMessage } from '@/types/chat';

export function ChatMessageList({
  messages,
  currentUserId,
}: {
  messages: ChatMessage[];
  currentUserId: number;
}) {
  return (
    <div className="space-y-2 overflow-y-auto max-h-[400px]">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`px-4 py-2 rounded w-fit ${
            msg.sender_id === currentUserId
              ? 'bg-blue-500 text-white self-end ml-auto'
              : 'bg-gray-200 text-black'
          }`}
        >
          {msg.content}
        </div>
      ))}
    </div>
  );
}
