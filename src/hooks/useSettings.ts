import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export function useSettings() {
  const [settings, setSettings] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      if (!response.ok) throw new Error('Failed to load settings');
      const data = await response.json();
      setSettings(data);
    } catch (error) {
      toast.error('Failed to load settings');
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async (data: any) => {
    try {
      const response = await fetch('/api/settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to update settings');
      
      const updatedSettings = await response.json();
      setSettings(updatedSettings);
      toast.success('Settings updated successfully');
      return true;
    } catch (error) {
      toast.error('Failed to update settings');
      return false;
    }
  };

  return {
    settings,
    isLoading,
    updateSettings,
    reloadSettings: loadSettings,
  };
} 