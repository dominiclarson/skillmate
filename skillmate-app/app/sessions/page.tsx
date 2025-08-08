

   'use client';

   import { useEffect, useState } from 'react';
   import { Badge } from '@/components/ui/badge';
   
   
   type Status =
     | 'requested'
     | 'accepted'
     | 'declined'
     | 'cancelled'
     | 'completed';
   
   interface Session {
    
     id: number;
     teacher_id: number;
     student_id: number;
     teacherName: string;
     studentName: string;
     start_utc: string;
     end_utc: string;
     status: Status;
   }
   
   const colour: Record<Status, 'secondary' | 'success' | 'destructive'> = {
     requested: 'secondary',
     accepted: 'success',
     declined: 'destructive',
     cancelled: 'destructive',
     completed: 'secondary',
   };

   const fmt = (ts: string) =>
     new Date(ts.replace(' ', 'T') + 'Z').toLocaleString(undefined, {
       dateStyle: 'short',
       timeStyle: 'short',
     });
   
  
   export default function SessionsPage() {
     const [sessions, setSessions] = useState<Session[]>([]);
     const [currentUserId, setCurrentUserId] = useState<number | null>(null);
     const [role, setRole] = useState<'all' | 'teacher' | 'student'>('all');
     const [loading, setLoading] = useState(true);
   
     useEffect(() => {
       fetch('/api/auth/session')
         .then((r) => r.json())
         .then((d) => setCurrentUserId(d?.session?.id ?? null))
         .catch(() => {});
     }, []);
   
  
     useEffect(() => {
      const qs = `?role=${role}`;   
       fetch(`/api/sessions${qs}`)
         .then((r) => r.json())
         .then((d) => setSessions(Array.isArray(d) ? (d as Session[]) : []))
         .catch(() => {})
         .finally(() => setLoading(false));
     }, [role]);
   
    
     const patch = async (
       id: number,
       action: 'accept' | 'decline' | 'cancel'
     ) => {
       await fetch(`/api/sessions/${id}`, {
         method: 'PATCH',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ action }),
       });
       /* optimistic update */
       setSessions((prev) =>
         prev.map((s) =>
           s.id === id
             ? {
                 ...s,
                 status:
                   action === 'accept'
                     ? 'accepted'
                     : action === 'decline'
                     ? 'declined'
                     : 'cancelled',
               }
             : s
         )
       );
     };
   
     /* splits */
     const pending = sessions.filter((s) => s.status === 'requested');
     const upcoming = sessions.filter((s) => s.status === 'accepted');
     const history = sessions.filter(
       (s) => s.status !== 'requested' && s.status !== 'accepted'
     );
   
     return (
       <main className="mx-auto max-w-5xl p-6">
         {/* header */}
         <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
           <h1 className="text-3xl font-bold">My Sessions</h1>
   
           {/* role selector */}
           <div className="flex gap-2">
             {(['all', 'teacher', 'student'] as const).map((r) => (
               <button
                 key={r}
                 onClick={() => setRole(r)}
                 className={`px-3 py-1 rounded text-sm capitalize
                   ${
                     role === r
                       ? 'bg-primary text-primary-foreground'
                       : 'bg-muted text-muted-foreground hover:bg-accent'
                   }`}
               >
                 {r}
               </button>
             ))}
           </div>
         </header>
   
         {loading && <p className="text-muted-foreground">Loading…</p>}
   
         {!loading && sessions.length === 0 && (
           <p className="text-muted-foreground">You have no sessions yet.</p>
         )}
   
         {!loading && sessions.length > 0 && (
           <div className="space-y-8">
             {[
               { label: 'Pending', list: pending },
               { label: 'Upcoming', list: upcoming },
               { label: 'History', list: history },
             ].map(({ label, list }) => (
               <section key={label} className="space-y-4">
                 <h2 className="text-xl font-semibold">
                   {label}{' '}
                   <span className="text-muted-foreground">({list.length})</span>
                 </h2>
   
                 {list.length === 0 ? (
                   <p className="text-muted-foreground">
                     No {label.toLowerCase()} sessions.
                   </p>
                 ) : (
                   <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                     {list.map((s) => {
                       const meIsTeacher = currentUserId === s.teacher_id;
                       const counterName = meIsTeacher
                         ? s.studentName
                         : s.teacherName;
   
                       return (
                         <li
                           key={s.id}
                           className="border rounded-lg p-4 flex flex-col justify-between h-full"
                         >
                           <div className="space-y-1">
                             <h3 className="font-semibold leading-tight">
                               Lesson with {counterName}
                             </h3>
                             <p className="text-xs text-muted-foreground">
                               {fmt(s.start_utc)} → {fmt(s.end_utc)}
                             </p>
                           </div>
   
                           <div className="mt-4 flex items-center justify-between">
                             <Badge
                               variant={colour[s.status]}
                               className="capitalize"
                             >
                               {s.status}
                             </Badge>
   
                             {/* actions only for pending list */}
                             {label === 'Pending' &&
                               (meIsTeacher ? (
                                 <div className="flex gap-2">
                                   <button
                                     onClick={() => patch(s.id, 'accept')}
                                     className="text-xs px-2 py-1 rounded bg-green-600 text-white hover:bg-green-700"
                                   >
                                     Accept
                                   </button>
                                   <button
                                     onClick={() => patch(s.id, 'decline')}
                                     className="text-xs px-2 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                                   >
                                     Decline
                                   </button>
                                 </div>
                               ) : (
                                 <button
                                   onClick={() => patch(s.id, 'cancel')}
                                   className="text-xs px-2 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                                 >
                                   Cancel
                                 </button>
                               ))}
                           </div>
                         </li>
                       );
                     })}
                   </ul>
                 )}
               </section>
             ))}
           </div>
         )}
       </main>
     );
   }
   