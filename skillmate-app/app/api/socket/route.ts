import { NextRequest } from 'next/server';
import { NextApiResponseServerIO } from '@/types/socket';
import { Server as IOServer } from 'socket.io';

let io: IOServer | undefined;

export async function GET(req: NextRequest) {
  const res = req as any as NextApiResponseServerIO;
  
  if (!io) {
    io = new IOServer(res.socket.server as any, {
      path: '/api/socket',
    });

    io.on('connection', (socket) => {
      
      socket.on('join', (room: string) => socket.join(room));

     
      socket.on('message', (room: string, msg: any) => {
        io!.to(room).emit('message', msg);
      });
    });

    res.socket.server.io = io;
  }
  
  return new Response('Socket server initialized', { status: 200 });
}
