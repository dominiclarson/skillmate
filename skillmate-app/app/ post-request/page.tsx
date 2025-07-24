

'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';

export default function PostRequestPage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  // Check auth
  useEffect(() => {
    fetch('/api/auth/session')
      .then(res => setIsAuth(res.ok))
      .catch(() => setIsAuth(false));
  }, []);

  
  useEffect(() => {
    if (isAuth === false) {
      router.push('/login?callbackUrl=/post-request');
    }
  }, [isAuth]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast.error('Please fill out all fields');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/skills/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      });

      if (res.ok) {
        toast.success('Skill posted successfully!');
        setTitle('');
        setDescription('');
        router.push('/profile');
      } else {
        const data = await res.json();
        toast.error(data.error || 'Something went wrong');
      }
    } catch (err) {
      toast.error('Failed to post skill');
    } finally {
      setLoading(false);
    }
  };

  if (isAuth === null) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading…
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow">
      <h1 className="text-3xl font-bold mb-6">Post a Skill</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-1 font-medium">Skill Title</label>
          <Input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Piano Lessons"
            required className={undefined} type={undefined}          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Description</label>
          <Textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={5}
            placeholder="Describe what you're offering..."
            required
          />
        </div>

        <Button type="submit" disabled={loading} className={undefined} variant={undefined} size={undefined}>
          {loading ? 'Posting…' : 'Post Skill'}
        </Button>
      </form>
    </div>
  );
}
