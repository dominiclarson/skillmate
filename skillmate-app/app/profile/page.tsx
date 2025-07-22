




'use client';

import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';

interface SessionUser {
  name: string;
  email: string;
  bio?: string;
  notificationsEnabled: boolean;
}

export default function ProfilePage() {
  const router = useRouter();
  const pathname = usePathname();

  
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  // account' or 'security'
  const [tab, setTab] = useState<'account' | 'security'>('account');

  // Account tab fields
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [savingAccount, setSavingAccount] = useState(false);

  // Security tab fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  // Load session
  useEffect(() => {
    fetch('/api/auth/session')
      .then(res => {
        if (!res.ok) {
          router.replace(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
          throw new Error('Not authenticated');
        }
        return res.json();
      })
      .then(session => {
        const u = session.user as SessionUser;
        setUser(u);
        setName(u.name);
        setBio(u.bio || '');
        setNotificationsEnabled(u.notificationsEnabled);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [pathname, router]);

  // Save account info
  async function handleAccountSave(e: FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSavingAccount(true);
    try {
      const res = await fetch('/api/user/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, bio, notificationsEnabled }),
      });
      if (!res.ok) throw new Error('Update failed');
      const data = await res.json();
      setUser(data.user);
      toast.success('Account updated');
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || 'Error updating account');
    } finally {
      setSavingAccount(false);
    }
  }

  // Change password
  async function handleChangePassword(e: FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setChangingPassword(true);
    try {
      const res = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Password change failed');
      }
      toast.success('Password changed');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setChangingPassword(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <main className="flex-1 max-w-3xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Your Profile</h1>

        {/* Tabs */}
        <div className="flex space-x-4 mb-8">
          {(['account', 'security'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-t-lg ${
                tab === t
                  ? 'bg-white dark:bg-gray-800 shadow'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              {t === 'account' ? 'Account' : 'Security'}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="bg-white dark:bg-gray-800 rounded-b-lg p-6 shadow-inner">
          {tab === 'account' ? (
            <form onSubmit={handleAccountSave} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <Input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required className={undefined} type={undefined}                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium mb-1">Bio</label>
                <textarea
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  rows={3}
                  className="w-full rounded border p-2"
                  placeholder="Tell us about yourself"
                />
              </div>

              {/* Notifications */}
              <div className="flex items-center space-x-2">
                <input
                  id="notif"
                  type="checkbox"
                  checked={notificationsEnabled}
                  onChange={e => setNotificationsEnabled(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="notif" className="text-sm">
                  Email Notifications
                </label>
              </div>

              <Button type="submit" disabled={savingAccount} className={undefined} variant={undefined} size={undefined}>
                {savingAccount ? 'Saving…' : 'Save Changes'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleChangePassword} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Current Password
                </label>
                <Input
                    type="password"
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    required className={undefined}                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  New Password
                </label>
                <Input
                    type="password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    required
                    minLength={6} className={undefined}                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Confirm Password
                </label>
                <Input
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                    minLength={6} className={undefined}                />
              </div>
              <Button type="submit" disabled={changingPassword} className={undefined} variant={undefined} size={undefined}>
                {changingPassword ? 'Changing…' : 'Change Password'}
              </Button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
