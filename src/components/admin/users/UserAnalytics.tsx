'use client';
import { useState, useEffect } from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  UsersIcon,
  UserPlusIcon,
  UserMinusIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import UserActivityFeed from './UserActivityFeed';
import UserLocationMap from './UserLocationMap';
import UserEngagementChart from './UserEngagementChart';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

export default function UserAnalytics() {
  const [timeRange, setTimeRange] = useState('7d');
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/users/analytics?range=${timeRange}`);
        if (!response.ok) throw new Error('Failed to fetch user analytics');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Failed to fetch user analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [timeRange]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">User Analytics</h1>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
        >
          <option value="24h">Last 24 Hours</option>
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
        </select>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Users</p>
              <h3 className="text-2xl font-bold">{data.stats.totalUsers}</h3>
            </div>
            <UsersIcon className="w-12 h-12 text-blue-500" />
          </div>
          <div className="mt-2">
            <span className={`text-sm ${data.stats.userGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {data.stats.userGrowth >= 0 ? '+' : ''}{data.stats.userGrowth}%
            </span>
            <span className="text-sm text-gray-500 ml-2">vs last period</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Active Users</p>
              <h3 className="text-2xl font-bold">{data.stats.activeUsers}</h3>
            </div>
            <UserPlusIcon className="w-12 h-12 text-green-500" />
          </div>
          <div className="mt-2">
            <span className="text-sm text-gray-500">
              {Math.round((data.stats.activeUsers / data.stats.totalUsers) * 100)}% of total
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Avg. Session Time</p>
              <h3 className="text-2xl font-bold">{data.stats.avgSessionTime}</h3>
            </div>
            <ChartBarIcon className="w-12 h-12 text-purple-500" />
          </div>
          <div className="mt-2">
            <span className={`text-sm ${data.stats.sessionTimeChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {data.stats.sessionTimeChange >= 0 ? '+' : ''}{data.stats.sessionTimeChange}%
            </span>
            <span className="text-sm text-gray-500 ml-2">vs last period</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Churn Rate</p>
              <h3 className="text-2xl font-bold">{data.stats.churnRate}%</h3>
            </div>
            <UserMinusIcon className="w-12 h-12 text-red-500" />
          </div>
          <div className="mt-2">
            <span className={`text-sm ${data.stats.churnChange <= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {data.stats.churnChange >= 0 ? '+' : ''}{data.stats.churnChange}%
            </span>
            <span className="text-sm text-gray-500 ml-2">vs last period</span>
          </div>
        </div>
      </div>

      {/* User Growth Chart */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4">User Growth</h2>
        <div className="h-[400px]">
          <Line
            data={{
              labels: data.growth.labels,
              datasets: [
                {
                  label: 'New Users',
                  data: data.growth.newUsers,
                  borderColor: '#3B82F6',
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  fill: true,
                },
                {
                  label: 'Active Users',
                  data: data.growth.activeUsers,
                  borderColor: '#10B981',
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  fill: true,
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'top',
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Activity Feed */}
        <UserActivityFeed activities={data.recentActivities} />

        {/* User Location Map */}
        <UserLocationMap locations={data.userLocations} />
      </div>

      {/* User Engagement Chart */}
      <UserEngagementChart data={data.engagement} />
    </div>
  );
} 