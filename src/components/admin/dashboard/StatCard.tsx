import { ArrowTrendingUpIcon } from '@heroicons/react/24/outline';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ElementType;
}

export default function StatCard({ title, value, change, trend, icon: Icon }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-semibold mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-full bg-${trend === 'up' ? 'green' : 'red'}-100`}>
          <Icon className={`w-6 h-6 text-${trend === 'up' ? 'green' : 'red'}-600`} />
        </div>
      </div>
      <div className="mt-4 flex items-center">
        <ArrowTrendingUpIcon
          className={`w-4 h-4 ${
            trend === 'up' ? 'text-green-500 rotate-0' : 'text-red-500 rotate-180'
          }`}
        />
        <span
          className={`ml-2 text-sm ${
            trend === 'up' ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {change}
        </span>
      </div>
    </div>
  );
} 