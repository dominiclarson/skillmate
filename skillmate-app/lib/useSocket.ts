

'use client';

import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';


export default function useSocket<T>(
  room: string,
  onMessage: (msg: T) => void
) {
  const sock = useRef<Socket | null>(null);

  useEffect(() => {
    // ensure WS server is ready
    fetch('/api/socket');

    const s = io({ path: '/api/socket' });
    sock.current = s;

    s.emit('join', room);
    s.on('message', onMessage);

    return () => {
      s.off('message', onMessage);
      s.disconnect();
    };
  }, [room, onMessage]);

  return {
    send: (msg: T) => sock.current?.emit('message', room, msg),
  };
}
