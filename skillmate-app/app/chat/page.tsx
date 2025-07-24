

'use client';

import { useEffect, useState } from 'react';
import { SendHorizonal } from 'lucide-react';

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
  timestamp: string;
}

export default function ChatPage() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  // Fetch session and friends
  useEffect(() => {
    fetch('/api/auth/session')
      .then(res => res.json())
      .then(data => {
        if (data?.session?.id) {
          setCurrentUserId(data.session.id);
          fetch('/api/chat/connections')
            .then(res => res.json())
            .then(setFriends)
            .catch(err => console.error('Failed to load friends:', err));
        } else {
          console.error('Session data is missing or malformed:', data);
        }
      })
      .catch(err => console.error('Failed to fetch session:', err));
  }, []);

  // Load messages 
  useEffect(() => {
    if (!selectedFriend) return;
    fetch(`/api/chat/messages?userId=${selectedFriend.id}`)
      .then(res => res.json())
      .then(setMessages)
      .catch(err => console.error('Failed to fetch messages:', err));
  }, [selectedFriend]);

  // Send a message
  const handleSend = async () => {
    if (!newMessage.trim() || !selectedFriend || !currentUserId) return;

    const res = await fetch('/api/chat/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        toUserId: selectedFriend.id,
        content: newMessage.trim(),
      }),
    });

    if (res.ok) {
      const msg = {
        id: Date.now(),
        content: newMessage.trim(),
        sender_id: currentUserId,
        receiver_id: selectedFriend.id,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, msg]);
      setNewMessage('');
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Sidebar  */}
      <div className="w-1/3 border-r overflow-y-auto p-4 bg-gray-100 dark:bg-gray-900">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Friends</h2>
        {friends.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No connections</p>
        ) : (
          <ul className="space-y-2">
            {friends.map(friend => (
              <li
                key={friend.id}
                className={`cursor-pointer p-2 rounded hover:bg-blue-100 dark:hover:bg-gray-700 ${
                  selectedFriend?.id === friend.id ? 'bg-blue-200 dark:bg-gray-700' : ''
                }`}
                onClick={() => setSelectedFriend(friend)}
              >
                <div className="font-medium text-gray-800 dark:text-white">{friend.name}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{friend.email}</div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Chat window */}
      <div className="flex-1 flex flex-col p-4">
        {selectedFriend ? (
          <>
            <div className="border-b pb-2 mb-4">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                Chat with {selectedFriend.name}
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 mb-4 px-2">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`max-w-xs px-3 py-2 rounded-lg ${
                    msg.sender_id === currentUserId
                      ? 'ml-auto bg-blue-500 text-white'
                      : 'mr-auto bg-gray-200 text-gray-900'
                  }`}
                >
                  {msg.content}
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                className="flex-1 border px-3 py-2 rounded dark:bg-gray-800 dark:text-white"
                placeholder="Type a message..."
              />
              <button
                onClick={handleSend}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-1"
              >
                <SendHorizonal size={16} />
              </button>
            </div>
          </>
        ) : (
          <div className="text-gray-500 dark:text-gray-400 text-center mt-20">
            Select a friend to start chatting.
          </div>
        )}
      </div>
    </div>
  );
}
