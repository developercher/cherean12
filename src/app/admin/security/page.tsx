'use client';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Switch } from '@headlessui/react';
import { ShieldCheckIcon, KeyIcon, DevicePhoneMobileIcon } from '@heroicons/react/24/outline';

export default function SecurityPage() {
  const [settings, setSettings] = useState({
    twoFactorEnabled: false,
    loginNotifications: true,
    deviceManagement: true,
    passwordLastChanged: null,
    securityQuestions: false,
  });

  const [recentActivities, setRecentActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSecuritySettings();
    loadRecentActivities();
  }, []);

  const loadSecuritySettings = async () => {
    try {
      const response = await fetch('/api/user/security');
      const data = await response.json();
      setSettings(data);
    } catch (error) {
      toast.error('Failed to load security settings');
    }
  };

  const loadRecentActivities = async () => {
    try {
      const response = await fetch('/api/user/security/activities');
      const data = await response.json();
      setRecentActivities(data);
    } catch (error) {
      toast.error('Failed to load recent activities');
    } finally {
      setIsLoading(false);
    }
  };

  const updateSetting = async (key: string, value: boolean) => {
    try {
      const response = await fetch('/api/user/security', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [key]: value }),
      });

      if (!response.ok) throw new Error('Failed to update setting');

      setSettings(prev => ({ ...prev, [key]: value }));
      toast.success('Setting updated successfully');
    } catch (error) {
      toast.error('Failed to update setting');
    }
  };

  const handlePasswordChange = async (formData: any) => {
    try {
      const response = await fetch('/api/user/security/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to change password');

      toast.success('Password changed successfully');
    } catch (error) {
      toast.error('Failed to change password');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Security Settings</h1>

      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center space-x-3">
            <ShieldCheckIcon className="h-8 w-8 text-green-500" />
            <div>
              <h3 className="font-semibold">Security Status</h3>
              <p className="text-sm text-gray-500">Your account is secure</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center space-x-3">
            <KeyIcon className="h-8 w-8 text-yellow-500" />
            <div>
              <h3 className="font-semibold">Last Password Change</h3>
              <p className="text-sm text-gray-500">
                {settings.passwordLastChanged 
                  ? new Date(settings.passwordLastChanged).toLocaleDateString()
                  : 'Never'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center space-x-3">
            <DevicePhoneMobileIcon className="h-8 w-8 text-blue-500" />
            <div>
              <h3 className="font-semibold">2FA Status</h3>
              <p className="text-sm text-gray-500">
                {settings.twoFactorEnabled ? 'Enabled' : 'Disabled'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Security Settings</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-500">
                  Add an extra layer of security to your account
                </p>
              </div>
              <Switch
                checked={settings.twoFactorEnabled}
                onChange={(value) => updateSetting('twoFactorEnabled', value)}
                className={`${
                  settings.twoFactorEnabled ? 'bg-primary' : 'bg-gray-200'
                } relative inline-flex h-6 w-11 items-center rounded-full`}
              >
                <span className="sr-only">Enable two-factor authentication</span>
                <span
                  className={`${
                    settings.twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                />
              </Switch>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Login Notifications</h3>
                <p className="text-sm text-gray-500">
                  Get notified of new login attempts
                </p>
              </div>
              <Switch
                checked={settings.loginNotifications}
                onChange={(value) => updateSetting('loginNotifications', value)}
                className={`${
                  settings.loginNotifications ? 'bg-primary' : 'bg-gray-200'
                } relative inline-flex h-6 w-11 items-center rounded-full`}
              >
                <span className="sr-only">Enable login notifications</span>
                <span
                  className={`${
                    settings.loginNotifications ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                />
              </Switch>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Activities</h2>
          
          {isLoading ? (
            <div className="text-center py-4">Loading...</div>
          ) : (
            <div className="space-y-4">
              {recentActivities.map((activity: any) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between py-3 border-b last:border-0"
                >
                  <div>
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-gray-500">
                      {activity.ip} • {activity.location}
                    </p>
                  </div>
                  <p className="text-sm text-gray-500">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 