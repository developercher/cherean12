import webPush from 'web-push';
import prisma from '@/lib/prisma';

webPush.setVapidDetails(
  'mailto:' + process.env.VAPID_MAILTO,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function sendPushNotification(
  userId: string,
  title: string,
  message: string,
  link?: string
) {
  try {
    // Get user's push subscriptions
    const subscriptions = await prisma.pushSubscription.findMany({
      where: { userId },
    });

    const payload = JSON.stringify({
      title,
      message,
      link,
      timestamp: new Date().toISOString(),
    });

    // Send to all user's subscribed devices
    const results = await Promise.allSettled(
      subscriptions.map(async (subscription) => {
        try {
          await webPush.sendNotification(
            JSON.parse(subscription.subscription),
            payload
          );
        } catch (error: any) {
          // Remove invalid subscriptions
          if (error.statusCode === 410) {
            await prisma.pushSubscription.delete({
              where: { id: subscription.id },
            });
          }
          throw error;
        }
      })
    );

    return results;
  } catch (error) {
    console.error('Push notification error:', error);
    throw error;
  }
} 