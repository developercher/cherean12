'use client';
import { useState, useEffect } from 'react';
import { Switch } from '@headlessui/react';
import { toast } from 'react-hot-toast';

interface NotificationPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  soundEnabled: boolean;
  desktopNotifications: boolean;
  notifyOnNewUsers: boolean;
  notifyOnNewPosts: boolean;
  notifyOnComments: boolean;
  notifyOnMentions: boolean;
  notificationVolume: number;
}

export default function NotificationPreferences() {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    emailNotifications: true,
    pushNotifications: true,
    soundEnabled: true,
    desktopNotifications: false,
    notifyOnNewUsers: true,
    notifyOnNewPosts: true,
    notifyOnComments: true,
    notifyOnMentions: true,
    notificationVolume: 0.5,
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const response = await fetch('/api/notifications/preferences');
      if (!response.ok) throw new Error('Failed to load preferences');
      const data = await response.json();
      setPreferences(data);
    } catch (error) {
      console.error('Failed to load notification preferences:', error);
      toast.error('Failed to load notification preferences');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = async (key: keyof NotificationPreferences, value: boolean) => {
    try {
      const response = await fetch('/api/notifications/preferences', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ [key]: value }),
      });

      if (!response.ok) throw new Error('Failed to update preferences');

      setPreferences(prev => ({ ...prev, [key]: value }));
      toast.success('Preferences updated');

      if (key === 'desktopNotifications' && value) {
        requestNotificationPermission();
      }
    } catch (error) {
      console.error('Failed to update notification preferences:', error);
      toast.error('Failed to update preferences');
    }
  };

  const requestNotificationPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        toast.error('Desktop notifications permission denied');
        setPreferences(prev => ({ ...prev, desktopNotifications: false }));
      }
    } catch (error) {
      console.error('Failed to request notification permission:', error);
      toast.error('Failed to enable desktop notifications');
    }
  };

  const handleVolumeChange = (value: number) => {
    handleChange('notificationVolume', value);
  };

  if (isLoading) {
    return <div>Loading preferences...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-lg font-medium mb-6">Notification Preferences</h2>

        <div className="space-y-4">
          {Object.entries(preferences).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </h3>
                <p className="text-sm text-gray-500">
                  {getPreferenceDescription(key as keyof NotificationPreferences)}
                </p>
              </div>
              <Switch
                checked={value}
                onChange={(checked) => handleChange(key as keyof NotificationPreferences, checked)}
                className={`${
                  value ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
                } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`}
              >
                <span
                  className={`${
                    value ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />
              </Switch>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium mb-2">
            Notification Volume
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={preferences.notificationVolume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <span className="text-sm text-gray-500">
              {Math.round(preferences.notificationVolume * 100)}%
            </span>
            <button
              onClick={() => {
                setPlaySound(true);
                setTimeout(() => setPlaySound(false), 1000);
              }}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Test
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function getPreferenceDescription(key: keyof NotificationPreferences): string {
  const descriptions: Record<keyof NotificationPreferences, string> = {
    emailNotifications: 'Receive notifications via email',
    pushNotifications: 'Receive push notifications in your browser',
    soundEnabled: 'Play a sound when new notifications arrive',
    desktopNotifications: 'Show notifications on your desktop',
    notifyOnNewUsers: 'Get notified when new users register',
    notifyOnNewPosts: 'Get notified when new posts are created',
    notifyOnComments: 'Get notified when someone comments',
    notifyOnMentions: 'Get notified when someone mentions you',
    notificationVolume: 'Adjust the volume of notification sounds',
  };

  return descriptions[key];
} 