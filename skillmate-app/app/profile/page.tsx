




'use client';

import { useEffect, useState } from 'react';
import {
  Pencil, Save, UserPlus, CheckCircle,
  ThumbsUp, ThumbsDown, Users
} from 'lucide-react';
import { toast } from 'react-toastify';

export default function ProfilePage() {
  const [profile, setProfile] = useState({ name: '', bio: '', email: '' });
  const [editing, setEditing] = useState(false);
  const [otherUsers, setOtherUsers] = useState([]);
  const [pendingRequests, setPendingRequests] = useState<number[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<any[]>([]);
  const [confirmedFriends, setConfirmedFriends] = useState<any[]>([]);

  useEffect(() => {
    // Fetch logged-in user profile
    fetch('/api/profile')
      .then(res => res.json())
      .then(data => setProfile({
        name: data?.name || '',
        bio: data?.bio || '',
        email: data?.email || ''
      }))
      .catch(err => console.error('Failed to load profile:', err));

    // Fetch other users
    fetch('/api/users')
      .then(res => res.json())
      .then(data => setOtherUsers(data))
      .catch(err => console.error('Failed to load users:', err));

    // Fetch pending requests (sent by me)
    fetch('/api/friends/pending')
      .then(res => res.json())
      .then(data => setPendingRequests(data.map((req: any) => req.receiver_id)))
      .catch(err => console.error('Failed to fetch pending:', err));

    // Fetch incoming requests (sent to me)
    fetch('/api/friends/incoming')
      .then(res => res.json())
      .then(data => {
        console.log('Incoming:', data); // DEBUGGING
        setIncomingRequests(data);
      })
      .catch(err => console.error('Failed to fetch incoming:', err));

    // Fetch confirmed friends
    fetch('/api/friends/confirmed')
      .then(res => res.json())
      .then(data => setConfirmedFriends(data))
      .catch(err => console.error('Failed to fetch friends:', err));
  }, []);

  // Save updated profile
  const handleSave = async () => {
    await fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: profile.name, bio: profile.bio }),
    });
    setEditing(false);
    toast.success('Profile updated');
  };

  // Send a friend request
  const handleConnect = async (receiverId: number) => {
    try {
      const res = await fetch('/api/friends/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiverId }),
      });
      if (res.ok) {
        toast.success('Friend request sent!');
        setPendingRequests(prev => [...prev, receiverId]);
      } else {
        const error = await res.json();
        toast.error(`Failed to connect: ${error.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Connection error:', err);
      toast.error('An error occurred while connecting.');
    }
  };

  // Accept or reject incoming request
  const handleRespond = async (requestId: number, accepted: boolean) => {
    await fetch('/api/friends/incoming', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestId, accepted }),
    });
    setIncomingRequests(prev => prev.filter(req => req.id !== requestId));
    toast.success(`Request ${accepted ? 'accepted' : 'rejected'}`);
  };

  return (
    <div className="max-w-3xl mx-auto mt-12 p-6 rounded-xl bg-white dark:bg-gray-800 shadow">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">My Profile</h1>
      <div className="space-y-6">
        {/* Profile Info */}
        <div>
          <label className="block font-semibold text-gray-700 dark:text-gray-300">Email</label>
          <div className="border px-3 py-2 rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white">{profile.email}</div>
        </div>

        <div>
          <label className="block font-semibold text-gray-700 dark:text-gray-300">Name</label>
          <input
            value={profile.name || ''}
            onChange={e => setProfile({ ...profile, name: e.target.value })}
            className="border px-3 py-2 rounded w-full dark:bg-gray-700 dark:text-white"
            disabled={!editing}
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-700 dark:text-gray-300">Bio</label>
          <textarea
            value={profile.bio || ''}
            onChange={e => setProfile({ ...profile, bio: e.target.value })}
            className="border px-3 py-2 rounded w-full dark:bg-gray-700 dark:text-white"
            rows={4}
            disabled={!editing}
          />
        </div>

        <div className="flex justify-end gap-4">
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow"
            >
              <Pencil size={16} /> Edit
            </button>
          ) : (
            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md shadow"
            >
              <Save size={16} /> Save
            </button>
          )}
        </div>

        {/* Incoming Requests */}
        <hr className="my-8 border-t" />
        <div>
          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Incoming Friend Requests</h2>
          {incomingRequests.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">No requests.</p>
          ) : (
            <ul className="space-y-4">
              {incomingRequests.map((req: any) => (
                <li key={req.id} className="flex justify-between items-center border rounded px-4 py-2 dark:bg-gray-700">
                  <div>
                    <div className="font-semibold text-white">{req.name}</div>
                    <div className="text-sm text-gray-400">{req.email}</div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRespond(req.id, true)}
                      className="px-2 py-1 bg-green-600 text-white rounded flex items-center gap-1"
                    >
                      <ThumbsUp size={16} /> Accept
                    </button>
                    <button
                      onClick={() => handleRespond(req.id, false)}
                      className="px-2 py-1 bg-red-600 text-white rounded flex items-center gap-1"
                    >
                      <ThumbsDown size={16} /> Reject
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Other Users */}
        <hr className="my-8 border-t" />
        <div>
          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Connect With Other Users</h2>
          {otherUsers.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">No other users available.</p>
          ) : (
            <ul className="space-y-4">
              {otherUsers.map((user: any) => (
                <li key={user.id} className="flex items-center justify-between border rounded px-4 py-2 dark:bg-gray-700">
                  <div>
                    <div className="font-semibold text-gray-800 dark:text-white">{user.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-300">{user.email}</div>
                  </div>
                  {pendingRequests.includes(user.id) ? (
                    <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
                      <CheckCircle size={16} /> Requested
                    </span>
                  ) : (
                    <button
                      onClick={() => handleConnect(user.id)}
                      className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded"
                    >
                      <UserPlus size={16} /> Connect
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Confirmed Friends */}
        <hr className="my-8 border-t" />
        <div>
          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Friends</h2>
          {confirmedFriends.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">No confirmed friends yet.</p>
          ) : (
            <ul className="space-y-4">
              {confirmedFriends.map((friend: any) => (
                <li key={friend.id} className="flex items-center justify-between border rounded px-4 py-2 dark:bg-gray-700">
                  <div>
                    <div className="font-semibold text-white">{friend.name}</div>
                    <div className="text-sm text-gray-400">{friend.email}</div>
                  </div>
                  <div className="text-blue-400 flex items-center gap-1">
                    <Users size={16} /> Connected
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
