

import type { Server as IOServer } from 'socket.io';
import type { NextApiResponse } from 'next';

export interface NextApiResponseServerIO extends NextApiResponse {
  socket: {
    server: {
      io?: IOServer;
    };
  };
}
