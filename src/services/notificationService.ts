import prisma from '@/lib/prisma';

export const notificationService = {
  async createNotification(userId: string, data: {
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error' | 'message' | 'mention';
    link?: string;
    playSound?: boolean;
  }) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { notificationPreferences: true },
    });

    const preferences = user?.notificationPreferences as any || {};
    const shouldPlaySound = data.playSound && preferences.soundEnabled;

    return prisma.notification.create({
      data: {
        userId,
        ...data,
        metadata: {
          playSound: shouldPlaySound,
          volume: preferences.notificationVolume || 0.5,
        },
      },
    });
  },

  async createSystemNotification(data: {
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    link?: string;
  }) {
    // Send to all admin users
    const adminUsers = await prisma.user.findMany({
      where: { role: 'admin' },
    });

    return Promise.all(
      adminUsers.map(user =>
        this.createNotification(user.id, data)
      )
    );
  },

  async createBulkNotifications(userIds: string[], data: {
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    link?: string;
  }) {
    return prisma.notification.createMany({
      data: userIds.map(userId => ({
        userId,
        ...data,
      })),
    });
  },

  async deleteOldNotifications(daysOld: number = 30) {
    const date = new Date();
    date.setDate(date.getDate() - daysOld);

    return prisma.notification.deleteMany({
      where: {
        createdAt: {
          lt: date,
        },
        read: true,
      },
    });
  },
}; 