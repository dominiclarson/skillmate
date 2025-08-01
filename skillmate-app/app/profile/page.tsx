

'use client';

import { useEffect, useState } from 'react';
import {
  Pencil, Save, UserPlus, CheckCircle,
  ThumbsUp, ThumbsDown, Users
} from 'lucide-react';
import { toast } from 'react-toastify';
import { skills, Skill } from '@/lib/skills';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

export default function ProfilePage() {
  const [profile, setProfile] = useState({ name: '', bio: '', email: '' ,selectedSkills:''});
  const [skillIDs] = useState([]);
  const [editing, setEditing] = useState(false);
  const [otherUsers, setOtherUsers] = useState([]);
  const [pendingRequests, setPendingRequests] = useState<number[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<any[]>([]);
  const [confirmedFriends, setConfirmedFriends] = useState<any[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  useEffect(() => {
    // Fetch logged-in user profile
    fetch('/api/profile')
      .then(res => res.json())
      .then(data => setProfile({
        name: data?.name || '',
        bio: data?.bio || '',
        email: data?.email || '',
        selectedSkills:data?.skill_id
      }))
      .catch(err => console.error('Failed to load profile:', err));

    //fetch('/api/skills')
     // .then(res = res.json())
      //.then(data => skillIDs)

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
      body: JSON.stringify({ name: profile.name, bio: profile.bio, skills: profile.selectedSkills}), // Need to add skills to user profiles on database
    }
  );

    setEditing(false);
    toast.success('Profile updated');
    console.log(selectedSkills);
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
    <div className="container mx-auto p-12 px-4">
      <div className="space-y-8">
        <div className="text-center pb-6">
          <h1 className="text-3xl font-bold">My Profile</h1>
        </div>
            {/* Profile Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="block font-semibold">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  disabled
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className="block font-semibold">Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={profile.name || ''}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  disabled={!editing}
                  className=""
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio" className="block font-semibold">Bio</Label>
              <Textarea
                id="bio"
                value={profile.bio || ''}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                rows={4}
                disabled={!editing}
              />
            </div>

            <div className="space-y-3">
              <Label className="block font-semibold">Skills I'm interested in</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {skills.map(skill => (
                  <div key={skill.name} className="flex items-center space-x-2">
                    <Checkbox
                      id={skill.id}
                      checked={selectedSkills.includes(skill.name)}
                      onCheckedChange={() => {
                        setSelectedSkills(prev =>
                          prev.includes(skill.name)
                            ? prev.filter(s => s !== skill.name)
                            : [...prev, skill.name]
                        );
                      }}
                      disabled={!editing}
                      className=""
                    />
                    <Label
                      htmlFor={skill.id}
                      className="text-sm font-normal cursor-pointer flex-1"
                    >
                      {skill.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-4">
              {!editing ? (
                <Button
                  onClick={() => setEditing(true)}
                  variant="default"
                  size="default"
                  className="flex items-center gap-2, text-white"
                >
                  <Pencil size={16} /> Edit
                </Button>
              ) : (
                <Button
                  onClick={handleSave}
                  variant="default"
                  size="default"
                  className="flex items-center gap-2 text-white"
                >
                  <Save size={16} /> Save
                </Button>
              )}
            </div>

        {/* Incoming Requests */}
        <Separator className="my-8" />
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Incoming Friend Requests</h2>
          {incomingRequests.length === 0 ? (
            <p className="text-muted-foreground">No requests.</p>
          ) : (
            <div className="space-y-3">
              {incomingRequests.map((req: any) => (
                <div key={req.id} className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <div className="font-semibold">{req.name}</div>
                    <div className="text-sm text-muted-foreground">{req.email}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleRespond(req.id, true)}
                      variant="default"
                      size="sm"
                      className="flex items-center gap-1 text-white"
                    >
                      <ThumbsUp size={16} /> Accept
                    </Button>
                    <Button
                      onClick={() => handleRespond(req.id, false)}
                      variant="destructive"
                      size="sm"
                      className="flex items-center gap-1 text-white"
                    >
                      <ThumbsDown size={16} /> Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Other Users */}
        <Separator className="my-8" />
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Connect With Other Users</h2>
          {otherUsers.length === 0 ? (
            <p className="text-muted-foreground">No other users available.</p>
          ) : (
            <div className="space-y-3">
              {otherUsers.map((user: any) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-semibold">{user.name}</div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                  </div>
                  {pendingRequests.includes(user.id) ? (
                    <span className="text-green-600 flex items-center gap-1">
                      <CheckCircle size={16} /> Requested
                    </span>
                  ) : (
                    <Button
                      onClick={() => handleConnect(user.id)}
                      variant="default"
                      size="sm"
                      className="flex items-center gap-1 text-white"
                    >
                      <UserPlus size={16} /> Connect
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Confirmed Friends */}
        <Separator className="my-8" />
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Friends</h2>
          {confirmedFriends.length === 0 ? (
            <p className="text-muted-foreground">No confirmed friends yet.</p>
          ) : (
            <div className="space-y-3">
              {confirmedFriends.map((friend: any) => (
                <div key={friend.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-semibold">{friend.name}</div>
                    <div className="text-sm text-muted-foreground">{friend.email}</div>
                  </div>
                  <div className="text-primary flex items-center gap-1">
                    <Users size={16} /> Connected
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
