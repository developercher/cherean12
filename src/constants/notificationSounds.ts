export const NOTIFICATION_SOUNDS = {
  default: '/sounds/notification-simple.mp3',
  success: '/sounds/notification-success.mp3',
  warning: '/sounds/notification-warning.mp3',
  error: '/sounds/notification-error.mp3',
  message: '/sounds/notification-message.mp3',
  mention: '/sounds/notification-mention.mp3',
} as const;

export type NotificationSoundType = keyof typeof NOTIFICATION_SOUNDS; 