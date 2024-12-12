export default function DashboardStats() {
  const stats = [
    { name: 'Total Projects', value: '12' },
    { name: 'Blog Posts', value: '24' },
    { name: 'Testimonials', value: '36' },
    { name: 'Total Views', value: '2.4K' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.name}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow"
        >
          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {stat.name}
          </dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
            {stat.value}
          </dd>
        </div>
      ))}
    </div>
  );
} 