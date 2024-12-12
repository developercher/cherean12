'use client';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Switch } from '@headlessui/react';
import {
  BellIcon,
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  SpeakerWaveIcon,
  BellAlertIcon,
  ChatBubbleLeftIcon,
  UserIcon,
  AtSymbolIcon,
  ClockIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

// Add interfaces for better type safety
interface NotificationPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  soundEnabled: boolean;
  desktopNotifications: boolean;
  notifyOnNewUsers: boolean;
  notifyOnNewPosts: boolean;
  notifyOnComments: boolean;
  notifyOnMentions: boolean;
  browserNotifications: boolean;
  securityAlerts: boolean;
  maintenanceAlerts: boolean;
  digestEmails: 'never' | 'daily' | 'weekly' | 'monthly';
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
  link?: string;
  category: string;
}

export default function NotificationsPage() {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    emailNotifications: true,
    pushNotifications: false,
    soundEnabled: true,
    desktopNotifications: false,
    notifyOnNewUsers: true,
    notifyOnNewPosts: true,
    notifyOnComments: true,
    notifyOnMentions: true,
    browserNotifications: false,
    securityAlerts: true,
    maintenanceAlerts: true,
    digestEmails: 'never',
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '07:00',
    },
  });

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Add notification categories
  const categories = [
    { id: 'all', name: 'All Notifications', icon: BellIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon },
    { id: 'system', name: 'System', icon: GlobeAltIcon },
    { id: 'comments', name: 'Comments', icon: ChatBubbleLeftIcon },
    { id: 'mentions', name: 'Mentions', icon: AtSymbolIcon },
  ];

  // Add digest email options
  const digestOptions = [
    { value: 'never', label: 'Never' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
  ];

  useEffect(() => {
    loadPreferences();
    loadNotifications();
  }, []);

  const loadPreferences = async () => {
    try {
      const response = await fetch('/api/notifications/preferences');
      const data = await response.json();
      
      // Merge with default values to ensure all properties exist
      setPreferences(prev => ({
        ...prev,
        ...data,
        quietHours: {
          enabled: false,
          start: '22:00',
          end: '07:00',
          ...data.quietHours,
        },
      }));
    } catch (error) {
      toast.error('Failed to load notification preferences');
    }
  };

  const loadNotifications = async () => {
    try {
      const response = await fetch('/api/notifications');
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      toast.error('Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  };

  const updatePreference = async (key: string, value: boolean) => {
    try {
      const response = await fetch('/api/notifications/preferences', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [key]: value }),
      });

      if (!response.ok) throw new Error('Failed to update preference');

      setPreferences(prev => ({ ...prev, [key]: value }));
      toast.success('Preference updated successfully');
    } catch (error) {
      toast.error('Failed to update preference');
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications/read-all', {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to mark notifications as read');

      setNotifications(prev =>
        prev.map((notification: any) => ({ ...notification, read: true }))
      );
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to mark notifications as read');
    }
  };

  // Add new functions for enhanced functionality
  const requestNotificationPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setPreferences(prev => ({ ...prev, browserNotifications: true }));
        toast.success('Browser notifications enabled');
      } else {
        toast.error('Browser notifications permission denied');
      }
    } catch (error) {
      toast.error('Failed to enable browser notifications');
    }
  };

  const getFilteredNotifications = () => {
    let filtered = [...notifications];
    
    // Apply read/unread filter
    if (filter === 'unread') {
      filtered = filtered.filter(n => !n.read);
    } else if (filter === 'read') {
      filtered = filtered.filter(n => n.read);
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(n => n.category === categoryFilter);
    }

    return filtered;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <button
          onClick={markAllAsRead}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          Mark all as read
        </button>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Notification Preferences</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Delivery Methods */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900 dark:text-gray-100">
                Delivery Methods
              </h3>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-gray-500">
                      Receive notifications via email
                    </p>
                  </div>
                </div>
                <Switch
                  checked={preferences.emailNotifications}
                  onChange={(value) => updatePreference('emailNotifications', value)}
                  className={`${
                    preferences.emailNotifications ? 'bg-primary' : 'bg-gray-200'
                  } relative inline-flex h-6 w-11 items-center rounded-full`}
                >
                  <span className="sr-only">Enable email notifications</span>
                  <span
                    className={`${
                      preferences.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                  />
                </Switch>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <DevicePhoneMobileIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">Push Notifications</p>
                    <p className="text-sm text-gray-500">
                      Receive push notifications
                    </p>
                  </div>
                </div>
                <Switch
                  checked={preferences.pushNotifications}
                  onChange={(value) => updatePreference('pushNotifications', value)}
                  className={`${
                    preferences.pushNotifications ? 'bg-primary' : 'bg-gray-200'
                  } relative inline-flex h-6 w-11 items-center rounded-full`}
                >
                  <span className="sr-only">Enable push notifications</span>
                  <span
                    className={`${
                      preferences.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                  />
                </Switch>
              </div>
            </div>

            {/* Notification Types */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900 dark:text-gray-100">
                Notification Types
              </h3>
              
              {[
                {
                  key: 'notifyOnNewUsers',
                  label: 'New Users',
                  description: 'When new users register',
                },
                {
                  key: 'notifyOnNewPosts',
                  label: 'New Posts',
                  description: 'When new posts are published',
                },
                {
                  key: 'notifyOnComments',
                  label: 'Comments',
                  description: 'When someone comments on your posts',
                },
                {
                  key: 'notifyOnMentions',
                  label: 'Mentions',
                  description: 'When someone mentions you',
                },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{item.label}</p>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                  <Switch
                    checked={preferences[item.key as keyof typeof preferences]}
                    onChange={(value) => updatePreference(item.key, value)}
                    className={`${
                      preferences[item.key as keyof typeof preferences] ? 'bg-primary' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 items-center rounded-full`}
                  >
                    <span className="sr-only">Enable {item.label}</span>
                    <span
                      className={`${
                        preferences[item.key as keyof typeof preferences] ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                    />
                  </Switch>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Advanced Settings</h2>
          
          {/* Quiet Hours */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <ClockIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium">Quiet Hours</p>
                  <p className="text-sm text-gray-500">
                    Disable notifications during specific hours
                  </p>
                </div>
              </div>
              <Switch
                checked={preferences.quietHours?.enabled ?? false}
                onChange={(value) => 
                  setPreferences(prev => ({
                    ...prev,
                    quietHours: {
                      ...prev.quietHours,
                      enabled: value,
                    },
                  }))
                }
                className={`${
                  preferences.quietHours?.enabled ? 'bg-primary' : 'bg-gray-200'
                } relative inline-flex h-6 w-11 items-center rounded-full`}
              >
                <span className="sr-only">Enable quiet hours</span>
                <span
                  className={`${
                    preferences.quietHours?.enabled ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                />
              </Switch>
            </div>

            {preferences.quietHours?.enabled && (
              <div className="grid grid-cols-2 gap-4 ml-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={preferences.quietHours?.start ?? '22:00'}
                    onChange={(e) => 
                      setPreferences(prev => ({
                        ...prev,
                        quietHours: {
                          ...prev.quietHours,
                          start: e.target.value,
                        },
                      }))
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={preferences.quietHours?.end ?? '07:00'}
                    onChange={(e) => 
                      setPreferences(prev => ({
                        ...prev,
                        quietHours: {
                          ...prev.quietHours,
                          end: e.target.value,
                        },
                      }))
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  />
                </div>
              </div>
            )}

            {/* Digest Email Frequency */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Digest Email Frequency
              </label>
              <select
                value={preferences.digestEmails}
                onChange={(e) => 
                  setPreferences(prev => ({
                    ...prev,
                    digestEmails: e.target.value as NotificationPreferences['digestEmails']
                  }))
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              >
                {digestOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Filters */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex space-x-2">
          {['all', 'unread', 'read'].map((filterOption) => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption as typeof filter)}
              className={`px-3 py-1 rounded-md text-sm ${
                filter === filterOption
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Filter by:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          >
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Recent Notifications */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Notifications</h2>
          
          {isLoading ? (
            <div className="text-center py-4">Loading...</div>
          ) : getFilteredNotifications().length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No notifications yet
            </div>
          ) : (
            <div className="space-y-4">
              {getFilteredNotifications().map((notification: any) => (
                <div
                  key={notification.id}
                  className={`flex items-start space-x-4 p-4 rounded-lg ${
                    notification.read ? 'bg-gray-50 dark:bg-gray-700/50' : 'bg-blue-50 dark:bg-blue-900/20'
                  }`}
                >
                  <div className={`p-2 rounded-full ${
                    notification.type === 'success' ? 'bg-green-100 text-green-600' :
                    notification.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                    notification.type === 'error' ? 'bg-red-100 text-red-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    <BellIcon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{notification.title}</h3>
                    <p className="text-sm text-gray-500">{notification.message}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 