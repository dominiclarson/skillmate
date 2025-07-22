 

 
'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get('callbackUrl') || '/';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        router.push(callbackUrl);
      } else {
        const data = await res.json();
        setError(data.error || 'Signup failed');
      }
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto py-8">
      <h1 className="mb-6 text-3xl font-bold text-center">Sign Up</h1>
      {error && <p className="text-red-600 text-center">{error}</p>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        className="w-full rounded border px-3 py-2"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
        minLength={6}
        className="w-full rounded border px-3 py-2"
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded bg-blue-600 px-3 py-2 text-white disabled:opacity-60"
      >
        {loading ? 'Signing up…' : 'Sign Up'}
      </button>
    </form>
  );
}
