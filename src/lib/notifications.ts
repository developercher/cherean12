import prisma from '@/lib/prisma';
import { sendEmail } from './email';
import { sendPushNotification } from './push';

interface SendNotificationParams {
  userId: string;
  title: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  category?: string;
  link?: string;
}

export async function sendNotification({
  userId,
  title,
  message,
  type = 'info',
  category = 'system',
  link,
}: SendNotificationParams) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { 
        notificationPreferences: true,
        email: true 
      },
    });

    const preferences = user?.notificationPreferences || {};

    // Check quiet hours
    if (preferences.quietHours?.enabled) {
      const now = new Date();
      const currentTime = now.getHours() * 100 + now.getMinutes();
      const startTime = parseInt(preferences.quietHours.start.replace(':', ''));
      const endTime = parseInt(preferences.quietHours.end.replace(':', ''));

      if (currentTime >= startTime || currentTime <= endTime) {
        console.log('Notification delayed due to quiet hours');
        return;
      }
    }

    // Create notification in database
    const notification = await prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type,
        category,
        link,
        read: false,
      },
    });

    // Send email if enabled
    if (preferences.emailNotifications && user?.email) {
      await sendEmail(
        user.email,
        title,
        message,
        link
      );
    }

    // Send push notification if enabled
    if (preferences.pushNotifications) {
      await sendPushNotification(
        userId,
        title,
        message,
        link
      );
    }

    return notification;
  } catch (error) {
    console.error('Send notification error:', error);
    throw error;
  }
} 