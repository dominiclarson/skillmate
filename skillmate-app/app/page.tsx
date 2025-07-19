
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { skills } from '@/lib/skills';

export default function HomePage() {
  const router = useRouter();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Redirect to login 
    fetch('/api/auth/session')
      .then(res => {
        if (!res.ok) router.push('/login');
      })
      .catch(() => router.push('/login'));

    // list of users 
    fetch('/api/users')
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(() => setUsers([]));
  }, [router]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Featured Skills</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
        {skills.map(skill => (
          <Card key={skill.name} className="hover:shadow-lg transition w-full h-24">
            <CardContent className="p-4 h-full flex items-center justify-center">
              <Link href={`/search?skill=${encodeURIComponent(skill.name)}`}>
                <h2 className="text-lg font-semibold text-center line-clamp-2">
                  <span className="mr-2" role="img" aria-label={skill.name}>{skill.emoji}</span>
                  {skill.name}
                </h2>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <h2 className="text-xl font-semibold mb-4">Your Connections</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {users.map(user => (
          <Card key={user.id} className="p-4 flex flex-col justify-between">
            <div>
              <p className="font-medium break-words text-center">{user.email}</p>
            </div>
            <Link href={`/chat/${user.id}`}>
              <button className="mt-2 w-full rounded bg-blue-600 px-3 py-2 text-white hover:bg-blue-700">
                Message
              </button>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
