
'use client';

import { useEffect, useState } from 'react';
import { NavButton } from '@/components/NavButton';

export default function ChatIndexPage() {
  const [users, setUsers] = useState<{ id: number; email: string }[]>([]);

  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(setUsers)
      .catch(() => setUsers([]));
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Chats</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {users.map(user => (
          <div key={user.id} className="p-4 border rounded hover:shadow">
            <p className="font-medium mb-2 truncate">{user.email}</p>
            <NavButton href={`/chat/${user.id}`} label="Message" />
          </div>
        ))}
      </div>
    </div>
  );
}