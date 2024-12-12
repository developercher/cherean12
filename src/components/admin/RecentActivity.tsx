export default function RecentActivity() {
  const activities = [
    {
      id: 1,
      type: 'Project Added',
      title: 'New Portfolio Project',
      date: '2 hours ago',
    },
    {
      id: 2,
      type: 'Blog Post',
      title: 'How to Become a Successful Writer',
      date: '5 hours ago',
    },
    {
      id: 3,
      type: 'Testimonial',
      title: 'New Client Review',
      date: '1 day ago',
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">
          Recent Activity
        </h2>
        <div className="mt-6 flow-root">
          <ul className="-my-5 divide-y divide-gray-200 dark:divide-gray-700">
            {activities.map((activity) => (
              <li key={activity.id} className="py-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {activity.title}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {activity.type}
                    </p>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {activity.date}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
} 