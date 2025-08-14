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
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

/**
 * Comprehensive user profile management page.
 * 
 * This component provides a full-featured profile interface where users can
 * manage their personal information, skills, and social connections. It includes
 * profile editing, skill selection, friend management, and connection requests
 * in a unified.
 * 
 * @component
 * @features
 * - **Profile Management**: Edit name, bio, and contact information
 * - **Skill Selection**: Choose skills you have and skills you want to learn
 * - **Friend System**: Send, accept, and reject friend requests
 * - **Connection Management**: View confirmed friends and pending requests
 * - **Responsive Design**: Optimized for desktop and mobile interfaces
 * 
 * @dependencies
 * - React hooks for state and effect management
 * - Lucide React for consistent iconography
 * - react-toastify for user feedback notifications
 * - shadcn/ui components for polished interface
 * - Skills library for skill category management
 * 
 * @returns {JSX.Element} The rendered profile management interface
 */
export default function ProfilePage() {
  const [profile, setProfile] = useState({ name: '', bio: '', email: '' ,selectedSkillsW:'' ,selectedSkillsH:''});
  const [editing, setEditing] = useState(false);
  const [otherUsers, setOtherUsers] = useState([]);
  const [pendingRequests, setPendingRequests] = useState<number[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<any[]>([]);
  const [confirmedFriends, setConfirmedFriends] = useState<any[]>([]);
  const [selectedSkillsW, setselectedSkillsW] = useState<number[]>([]);/*this NEEDS to be casted as number*/
  const [selectedSkillsH, setselectedSkillsH] = useState<number[]>([]);/*this NEEDS to be casted as number*/
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch logged-in user profile
    fetch('/api/profile')
      .then(res => res.json())
      .then(data =>{
        const selectedSkillsW = (data?.skillsW || []).map(s => Number(s.skill_id))
        const selectedSkillsH = (data?.skillsH || []).map(s => Number(s.skill_id))
        setProfile({
        name: data?.row.name || '',
        bio: data?.row.bio || '',
        email: data?.row.email || '',
        selectedSkillsW: selectedSkillsW[24],
        selectedSkillsH: selectedSkillsH[24]
      });
      
      /*to preload choices of skills*/
      setselectedSkillsW(selectedSkillsW);
      setselectedSkillsH(selectedSkillsH);
      setLoading(false); /*to make the page load the data before it trys to render*/
    })

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
    },[]);
  
  // Save updated profile
  const handleSave = async () => {
    await fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: profile.name, bio: profile.bio, skillsW: selectedSkillsW, skillsH: selectedSkillsH}),
    }
  );
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
    <div className="container mx-auto py-8 px-4">
      <div className="space-y-8">
        <h1 className="text-2xl font-semibold">My Profile</h1>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="">Email</Label>
            <Input id="email" type="email" value={profile.email} disabled className="bg-muted" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name" className="">Name</Label>
            <Input
              id="name"
              type="text"
              value={profile.name || ''}
              onChange={e => setProfile({ ...profile, name: e.target.value })}
              disabled={!editing}
              className=""
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio" className="">Bio</Label>
            <Textarea
              id="bio"
              value={profile.bio || ''}
              onChange={e => setProfile({ ...profile, bio: e.target.value })}
              rows={4}
              disabled={!editing}
            />
          </div>

          {!loading && (
            <div className="space-y-3">
              <Label className="text-base font-semibold">Skills I have</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {skills.map(skill => (
                  <div key={skill.name} className="flex items-center space-x-2">
                    <Checkbox
                      id={`skill-have-${skill.id}`}
                      checked={selectedSkillsH.includes(Number(skill.id))}
                      onCheckedChange={() => {
                        const id = Number(skill.id)
                        setselectedSkillsH(prev => 
                          prev.includes(id)
                            ? prev.filter(s => s !== id)
                            : [...prev, id]
                        );
                      }}
                      disabled={!editing}
                      className=""
                    />
                    <Label htmlFor={`skill-have-${skill.id}`} className="text-sm font-normal">
                      {skill.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Separator className="" />
          
          {!loading && (
            <div className="space-y-3">
              <Label className="text-base font-semibold">Skills I'm interested in</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {skills.map(skill => (
                  <div key={skill.name} className="flex items-center space-x-2">
                    <Checkbox
                      id={`skill-want-${skill.id}`}
                      checked={selectedSkillsW.includes(Number(skill.id))}
                      onCheckedChange={() => {
                        const id = Number(skill.id)
                        setselectedSkillsW(prev => 
                          prev.includes(id)
                            ? prev.filter(s => s !== id)
                            : [...prev, id]
                        );
                      }}
                      disabled={!editing}
                      className=""
                    />
                    <Label htmlFor={`skill-want-${skill.id}`} className="text-sm font-normal">
                      {skill.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2">
            {!editing ? (
              <Button onClick={() => setEditing(true)} variant="default" size="default" className="gap-2 text-white">
                <Pencil size={16} /> Edit
              </Button>
            ) : (
              <Button onClick={handleSave} variant="default" size="default" className="gap-2">
                <Save size={16} /> Save
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Incoming Friend Requests</h2>
          {incomingRequests.length === 0 ? (
            <p className="text-muted-foreground">No requests.</p>
          ) : (
            <div className="space-y-4">
              {incomingRequests.map((req: any) => (
                <div key={req.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4">
                  <div>
                    <div className="font-semibold">{req.name}</div>
                    <div className="text-sm text-muted-foreground">{req.email}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleRespond(req.id, true)}
                      size="sm"
                      variant="default"
                      className="gap-1"
                    >
                      <ThumbsUp size={16} /> Accept
                    </Button>
                    <Button
                      onClick={() => handleRespond(req.id, false)}
                      size="sm"
                      variant="destructive"
                      className="gap-1"
                    >
                      <ThumbsDown size={16} /> Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Connect With Other Users</h2>
          {otherUsers
            .filter((user: any) => {
              const isFriend   = confirmedFriends.some((f: any) => f.id === user.id);
              const isPending  = pendingRequests.includes(user.id);
              const isIncoming = incomingRequests.some((r: any) => r.sender_id === user.id);
              return !isFriend && !isPending && !isIncoming;
            })
            .length === 0 ? (
              <p className="text-muted-foreground">
                No other users available.
              </p>
            ) : (
              <Table className="">
                <TableHeader className="">
                  <TableRow className="">
                    <TableHead className="">Name</TableHead>
                    <TableHead className="">Email</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="">
                  {otherUsers
                    .filter((user: any) => {
                      const isFriend   = confirmedFriends.some((f: any) => f.id === user.id);
                      const isPending  = pendingRequests.includes(user.id);
                      const isIncoming = incomingRequests.some(
                        (r: any) => r.sender_id === user.id
                      );
                      return !isFriend && !isPending && !isIncoming;
                    })
                    .map((user: any) => (
                      <TableRow key={user.id} className="">
                        <TableCell className="font-semibold">{user.name}</TableCell>
                        <TableCell className="text-muted-foreground">{user.email}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            onClick={() => handleConnect(user.id)}
                            size="sm"
                            variant="default"
                            className="gap-1"
                          >
                            <UserPlus size={16} /> Connect
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            )}
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Friends</h2>
          {confirmedFriends.length === 0 ? (
            <p className="text-muted-foreground">No confirmed friends yet.</p>
          ) : (
            <div className="space-y-4">
              {confirmedFriends.map((friend: any) => (
                <div key={friend.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4">
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

      <hr className="my-8 border-t" />
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700 p-4 rounded">
        <h3 className="font-bold text-red-700 dark:text-red-300 mb-2">
          Delete Account
        </h3>
        <p className="text-sm text-red-600 dark:text-red-400 mb-4">
          Deleting your account is irreversible. 
        </p>
        <button
          onClick={async () => {
            if (!confirm(
              'This will permanently delete your account.'
            ))
              return;

            const res = await fetch('/api/account', { method: 'DELETE' });
            if (res.ok) {
              alert('Account deleted. Goodbye!');
              window.location.href = '/';
            } else {
              alert('Failed to delete account.');
            }
          } }
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Delete my account
        </button>
      </div>
    </div>
  </div>
);
}
