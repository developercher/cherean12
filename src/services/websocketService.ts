import { Server } from 'ws';
import { Server as HttpServer } from 'http';
import { parse } from 'url';
import { verify } from 'jsonwebtoken';

export class WebSocketService {
  private wss: Server;
  private clients: Map<string, WebSocket>;

  constructor(server: HttpServer) {
    this.wss = new Server({ server });
    this.clients = new Map();

    this.wss.on('connection', (ws, req) => {
      const { query } = parse(req.url || '', true);
      const token = query.token as string;

      try {
        const decoded = verify(token, process.env.JWT_SECRET!);
        const userId = (decoded as any).sub;

        this.clients.set(userId, ws);

        ws.on('close', () => {
          this.clients.delete(userId);
        });
      } catch (error) {
        ws.close();
      }
    });
  }

  sendNotification(userId: string, notification: any) {
    const client = this.clients.get(userId);
    if (client && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(notification));
    }
  }

  broadcastNotification(notification: any) {
    this.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(notification));
      }
    });
  }
} 