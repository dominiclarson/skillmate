

'use client';

import { useState } from 'react';

export function ChatInput({
  onSend,
}: {
  onSend: (message: string) => void;
}) {
  const [text, setText] = useState('');

  return (
    <div className="mt-4 flex gap-2">
      <input
        type="text"
        className="flex-1 border px-4 py-2 rounded"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your message..."
      />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={() => {
          if (text.trim()) {
            onSend(text);
            setText('');
          }
        }}
      >
        Send
      </button>
    </div>
  );
}
