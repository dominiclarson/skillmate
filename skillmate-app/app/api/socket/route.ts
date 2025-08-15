import { NextRequest } from 'next/server';
import { Server as IOServer } from 'socket.io';
import { Server as NetServer } from 'http';
import { Socket as NetSocket } from 'net';


interface SocketServer extends NetServer {
  io?: IOServer | undefined;
}

interface SocketWithIO extends NetSocket {
  server: SocketServer;
}

interface NextApiResponseWithSocket extends Response {
  socket: SocketWithIO;
}

let io: IOServer | undefined;

/**
 * Initializes Socket.IO server for real-time communication
 * Handles WebSocket connections for chat messaging and room management
 * @param req - Next.js request object
 * @returns JSON response indicating socket server status
 */
export async function GET(req: NextRequest) {
  const res = new Response() as any as NextApiResponseWithSocket;
  
  if (!res.socket?.server) {
    console.log('Socket server not available');
    return new Response('Socket server not initialized', { status: 500 });
  }

  if (!io) {
    io = new IOServer(res.socket.server as any, {
      path: '/api/socket',
      addTrailingSlash: false,
    });

    io.on('connection', (socket) => {
      console.log('Socket connected:', socket.id);
      
      socket.on('join', (room: string) => {
        socket.join(room);
        console.log(`Socket ${socket.id} joined room: ${room}`);
      });

      socket.on('message', (room: string, msg: any) => {
        io!.to(room).emit('message', msg);
        console.log(`Message sent to room ${room}:`, msg);
      });

      socket.on('disconnect', () => {
        console.log('Socket disconnected:', socket.id);
      });
    });

    res.socket.server.io = io;
  }

  return new Response('Socket initialized', { status: 200 });
}