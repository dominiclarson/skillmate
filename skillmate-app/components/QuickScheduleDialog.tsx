

'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CalendarPlus } from 'lucide-react';

export interface Teacher {
  id: number;
  name: string;
}

interface QuickScheduleDialogProps {
  teacher: Teacher;
  onCreated?: (sessionId: number) => void;
}


export default function QuickScheduleDialog({
  teacher,
  onCreated,
}: QuickScheduleDialogProps) {
  const [open, setOpen] = useState(false);
  const [start, setStart] = useState<string>(''); 
  const [note, setNote] = useState('');

  const submit = async () => {
    if (!start) {
      alert('Pick a start time');
      return;
    }

    const res = await fetch('/api/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        teacherId: teacher.id,
        startUtc: new Date(start).toISOString(), 
        notes: note,
      }),
    });

   
    let data: Record<string, any> = {};
    try {
      const txt = await res.text();      
      data = txt ? JSON.parse(txt) : {}; 
    } catch {
      
    }

    if (res.ok) {
      onCreated?.(data.id);              
      setOpen(false);
    } else {
      alert(data?.error || 'Failed to create session');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="default" className="gap-1">
          <CalendarPlus size={16} />
          Book lesson
        </Button>
      </DialogTrigger>

      <DialogContent className={undefined}>
        <DialogHeader className={undefined}>
          <DialogTitle className={undefined}>Book {teacher.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* start time */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Start&nbsp;(1-hour lesson)
            </label>
            <input
              type="datetime-local"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="border rounded px-3 py-2 w-full"
            />
          </div>

          {/* notes */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Notes&nbsp;(optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              className="border rounded px-3 py-2 w-full"
              placeholder="Anything the teacher should know…"
            />
          </div>
        </div>

        <DialogFooter className={undefined}>
          <Button
            onClick={submit}
            size="default"
            variant="default"
            className="w-full"
          >
            Request session
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
