'use client';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';

interface Activity {
  id: string;
  userId: string;
  userName: string;
  userImage: string;
  action: string;
  target: string;
  timestamp: string;
}

export default function UserActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch('/api/users/activities');
        if (!response.ok) throw new Error('Failed to fetch activities');
        const data = await response.json();
        setActivities(data);
      } catch (error) {
        console.error('Failed to fetch activities:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities();
    const interval = setInterval(fetchActivities, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start space-x-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <img
              src={activity.userImage || '/default-avatar.png'}
              alt={activity.userName}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">
                {activity.userName}{' '}
                <span className="text-gray-500 dark:text-gray-400">
                  {activity.action}
                </span>{' '}
                {activity.target}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {format(new Date(activity.timestamp), 'MMM d, yyyy HH:mm')}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 