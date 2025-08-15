

import { NextApiRequest } from 'next';
import { NextApiResponseServerIO } from '@/types/socket';
import { Server as IOServer } from 'socket.io';


export const config = { api: { bodyParser: false } };

let io: IOServer | undefined;

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponseServerIO
) {
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
  res.end();
}
