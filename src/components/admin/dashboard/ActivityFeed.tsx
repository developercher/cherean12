'use client';
import { formatDistanceToNow } from 'date-fns';

interface ActivityFeedProps {
  activities: Array<{
    id: string;
    title: string;
    status: string;
    author: {
      name: string;
    };
    createdAt: string;
  }>;
}

export default function ActivityFeed({ activities }: ActivityFeedProps) {
  if (!activities?.length) {
    return <div>No recent activities</div>;
  }

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {activities.map((activity, activityIdx) => (
          <li key={activity.id}>
            <div className="relative pb-8">
              {activityIdx !== activities.length - 1 ? (
                <span
                  className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700"
                  aria-hidden="true"
                />
              ) : null}
              <div className="relative flex space-x-3">
                <div>
                  <span className="h-8 w-8 rounded-full bg-primary flex items-center justify-center ring-8 ring-white dark:ring-gray-800">
                    <span className="text-white text-sm font-medium">
                      {activity.author.name.charAt(0)}
                    </span>
                  </span>
                </div>
                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                  <div>
                    <p className="text-sm text-gray-500">
                      {activity.author.name}{' '}
                      <span className="font-medium text-gray-900 dark:text-white">
                        {activity.status}
                      </span>{' '}
                      {activity.title}
                    </p>
                  </div>
                  <div className="text-right text-sm whitespace-nowrap text-gray-500">
                    {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
} 