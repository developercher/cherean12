import prisma from '@/lib/prisma';
import { WebSocket } from 'ws';
import { createHash } from 'crypto';

interface SecurityClient {
  ws: WebSocket;
  userId: string;
  role: string;
}

class SecurityService {
  private static instance: SecurityService;
  private clients: Map<string, SecurityClient> = new Map();
  private threatPatterns: RegExp[] = [
    /sql\s*injection/i,
    /cross\s*site/i,
    /<script\b[^>]*>[\s\S]*?<\/script>/gi,
  ];

  private constructor() {
    this.initializeRules();
  }

  static getInstance() {
    if (!SecurityService.instance) {
      SecurityService.instance = new SecurityService();
    }
    return SecurityService.instance;
  }

  async initializeRules() {
    const rules = await prisma.securityRule.findMany({
      where: { enabled: true }
    });
    // Initialize security rules
    rules.forEach(rule => {
      if (rule.type === 'pattern' && rule.pattern) {
        this.threatPatterns.push(new RegExp(rule.pattern, 'i'));
      }
    });
  }

  addClient(ws: WebSocket, userId: string, role: string) {
    const clientId = this.generateClientId(userId);
    this.clients.set(clientId, { ws, userId, role });

    ws.on('close', () => {
      this.clients.delete(clientId);
    });
  }

  private generateClientId(userId: string): string {
    return createHash('sha256').update(`${userId}-${Date.now()}`).digest('hex');
  }

  async logSecurityEvent(data: {
    type: string;
    severity: string;
    message: string;
    details?: any;
    ip?: string;
    userAgent?: string;
    userId?: string;
  }) {
    const log = await prisma.securityLog.create({
      data: {
        ...data,
        details: data.details || {},
      }
    });

    this.broadcastToAdmins({
      type: 'security_event',
      data: log
    });

    if (data.severity === 'high' || data.severity === 'critical') {
      this.triggerAlerts(log);
    }

    return log;
  }

  private broadcastToAdmins(message: any) {
    this.clients.forEach(client => {
      if (client.role === 'admin' && client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(JSON.stringify(message));
      }
    });
  }

  private async triggerAlerts(log: any) {
    try {
      // Log to console for immediate visibility
      console.error(`SECURITY ALERT - ${log.severity.toUpperCase()}: ${log.message}`);

      // Send email notification
      await fetch('/api/notifications/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          subject: `Security Alert: ${log.severity} Severity Event`,
          message: `
            Security Event Details:
            Type: ${log.type}
            Severity: ${log.severity}
            Message: ${log.message}
            Time: ${new Date().toISOString()}
            ${log.ip ? `IP: ${log.ip}` : ''}
            ${log.userId ? `User ID: ${log.userId}` : ''}
            ${log.details ? `Additional Details: ${JSON.stringify(log.details)}` : ''}
          `
        })
      });

      // Send SMS for critical events
      if (log.severity === 'critical') {
        await fetch('/api/notifications/sms', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: `CRITICAL SECURITY ALERT: ${log.message}`
          })
        });
      }

      // Store alert in database
      await prisma.securityAlert.create({
        data: {
          logId: log.id,
          type: log.type,
          severity: log.severity,
          message: log.message,
          notificationSent: true,
          timestamp: new Date()
        }
      });

    } catch (error) {
      console.error('Failed to trigger security alerts:', error);
      // Ensure we still log the failure
      await prisma.securityAlert.create({
        data: {
          logId: log.id,
          type: log.type, 
          severity: log.severity,
          message: log.message,
          notificationSent: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date()
        }
      });
    }
  }

  async checkIPSecurity(ip: string): Promise<boolean> {
    const blockedIP = await prisma.blockedIP.findUnique({
      where: { ip }
    });

    if (blockedIP) {
      if (blockedIP.expiresAt && blockedIP.expiresAt < new Date()) {
        await prisma.blockedIP.delete({ where: { ip } });
        return true;
      }
      return false;
    }

    return true;
  }

  async blockIP(ip: string, reason: string, duration?: number) {
    const expiresAt = duration ? new Date(Date.now() + duration * 1000) : null;

    await prisma.blockedIP.create({
      data: {
        ip,
        reason,
        expiresAt,
      }
    });

    await this.logSecurityEvent({
      type: 'ip_blocked',
      severity: 'high',
      message: `IP Address ${ip} blocked: ${reason}`,
      ip,
    });
  }

  async detectThreats(content: string): Promise<boolean> {
    return this.threatPatterns.some(pattern => pattern.test(content));
  }

  async auditAction(data: {
    action: string;
    userId: string;
    details: any;
    ipAddress: string;
    userAgent: string;
  }) {
    return prisma.securityAudit.create({
      data
    });
  }

  async getSecurityLogs(filters?: {
    type?: string;
    severity?: string;
    resolved?: boolean;
    startDate?: Date;
    endDate?: Date;
  }) {
    return prisma.securityLog.findMany({
      where: filters,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          }
        }
      }
    });
  }

  async resolveSecurityLog(id: string, userId: string) {
    return prisma.securityLog.update({
      where: { id },
      data: {
        resolved: true,
        resolvedBy: userId,
        resolvedAt: new Date(),
      }
    });
  }

  async getActiveThreats() {
    return prisma.securityLog.findMany({
      where: {
        resolved: false,
        severity: { in: ['high', 'critical'] }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async addSecurityRule(rule: {
    name: string;
    type: string;
    pattern?: string;
    action: string;
    conditions: any;
  }) {
    const newRule = await prisma.securityRule.create({
      data: rule
    });

    if (rule.type === 'pattern' && rule.pattern) {
      this.threatPatterns.push(new RegExp(rule.pattern, 'i'));
    }

    return newRule;
  }
}

export const securityService = SecurityService.getInstance(); 