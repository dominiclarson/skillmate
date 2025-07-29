

'use client';

import { useEffect, useState } from 'react';
import { SendHorizonal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
      <div className="w-1/3 border-r border-border overflow-y-auto p-4 bg-muted/30">
        <h2 className="text-lg font-semibold mb-4 text-foreground">Friends</h2>
        {friends.length === 0 ? (
          <p className="text-muted-foreground">No connections</p>
        ) : (
          <ul className="space-y-2">
            {friends.map(friend => (
              <li
                key={friend.id}
                className={`cursor-pointer p-2 rounded hover:bg-accent transition-colors ${
                  selectedFriend?.id === friend.id ? 'bg-accent text-accent-foreground' : ''
                }`}
                onClick={() => setSelectedFriend(friend)}
              >
                <div className="font-medium text-foreground">{friend.name}</div>
                <div className="text-sm text-muted-foreground">{friend.email}</div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Chat window */}
      <div className="flex-1 flex flex-col p-4 bg-background">
        {selectedFriend ? (
          <>
            <div className="border-b border-border pb-2 mb-4">
              <h3 className="text-xl font-bold text-foreground">
                Chat with {selectedFriend.name}
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 mb-4 px-2">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`max-w-xs px-3 py-2 rounded-lg ${
                    msg.sender_id === currentUserId
                      ? 'ml-auto bg-primary text-primary-foreground'
                      : 'mr-auto bg-muted text-muted-foreground'
                  }`}
                >
                  {msg.content}
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                type="default"
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                className="flex-1"
                placeholder="Type a message..."
                onKeyPress={e => e.key === 'Enter' && handleSend()}
              />
              <Button
                variant="default"
                size="default"
                onClick={handleSend}
                className="px-4 py-2 flex items-center gap-1"
                disabled={!newMessage.trim()}
              >
                <SendHorizonal size={16} />
              </Button>
            </div>
          </>
        ) : (
          <div className="text-muted-foreground text-center mt-20">
            Select a friend to start chatting.
          </div>
        )}
      </div>
    </div>
  );
}
