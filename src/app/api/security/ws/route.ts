import { WebSocketServer } from 'ws';
import { securityService } from '@/services/securityService';
import { getToken } from 'next-auth/jwt';

const wss = new WebSocketServer({ noServer: true });

export default function handler(req: any, res: any) {
  if (req.headers.upgrade !== 'websocket') {
    res.end();
    return;
  }

  wss.handleUpgrade(req, req.socket, Buffer.alloc(0), async (ws) => {
    const token = await getToken({ req });
    if (!token) {
      ws.close();
      return;
    }

    securityService.addClient(ws, token.sub!, token.role as string);
  });
} 