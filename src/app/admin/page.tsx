'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { analyticsService } from '@/services/analytics';
import {
  ChartBarIcon,
  DocumentPlusIcon,
  FolderPlusIcon,
  UserPlusIcon,
  PencilSquareIcon,
  ChatBubbleLeftRightIcon,
  ArrowTrendingUpIcon,
  EyeIcon,
  HeartIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import DashboardStats from '@/components/admin/DashboardStats';
import RecentPosts from '@/components/admin/dashboard/RecentPosts';
import AnalyticsChart from '@/components/admin/dashboard/AnalyticsChart';
import QuickActions from '@/components/admin/dashboard/QuickActions';
import ActivityFeed from '@/components/admin/dashboard/ActivityFeed';
import PopularPosts from '@/components/admin/dashboard/PopularPosts';
import RealTimeAnalytics from '@/components/admin/dashboard/RealTimeAnalytics';
import StatCard from '@/components/admin/dashboard/StatCard';
import QuickAction from '@/components/admin/dashboard/QuickAction';
import PortfolioOverview from '@/components/admin/dashboard/PortfolioOverview';

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [dateRange, setDateRange] = useState('week');
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch('/api/analytics?range=' + dateRange);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch dashboard data');
        }
        
        const data = await response.json();
        if (!data) {
          throw new Error('No data received from server');
        }
        
        setDashboardData(data);
      } catch (error) {
        console.error('Dashboard error:', error);
        setError(error instanceof Error ? error.message : 'Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dateRange]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Failed to load dashboard data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome back, {session?.user?.name || 'Admin'}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Here's what's happening with your blog today.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
          >
            <option value="week">Last 7 days</option>
            <option value="month">Last 30 days</option>
            <option value="year">Last year</option>
          </select>
          <Link
            href="/admin/analytics"
            className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            <ChartBarIcon className="w-5 h-5 mr-2" />
            View Analytics
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Views"
          value={(dashboardData.stats?.totalViews || 0).toLocaleString()}
          trend="up"
          change="+12.5%"
          icon={EyeIcon}
        />
        <StatCard
          title="Total Posts"
          value={(dashboardData.stats?.totalPosts || 0).toLocaleString()}
          trend="up"
          change={`+${(((dashboardData.stats?.newPosts || 0) / (dashboardData.stats?.totalPosts || 1)) * 100).toFixed(1)}%`}
          icon={DocumentPlusIcon}
        />
        <StatCard
          title="Engagement Rate"
          value={`${((dashboardData.stats?.engagementRate || 0) * 100).toFixed(1)}%`}
          trend="down"
          change="-2.1%"
          icon={HeartIcon}
        />
        <StatCard
          title="Total Subscribers"
          value={(dashboardData.stats?.totalSubscribers || 0).toLocaleString()}
          trend="up"
          change="+8.7%"
          icon={UserGroupIcon}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <QuickAction
          name="Create Post"
          href="/admin/posts/new"
          icon={DocumentPlusIcon}
          color="blue"
        />
        <QuickAction
          name="Add Portfolio"
          href="/admin/portfolio/new"
          icon={FolderPlusIcon}
          color="green"
        />
        <QuickAction
          name="New User"
          href="/admin/users/new"
          icon={UserPlusIcon}
          color="purple"
        />
        <QuickAction
          name="Write Message"
          href="/admin/messages/new"
          icon={ChatBubbleLeftRightIcon}
          color="pink"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Analytics Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Traffic Overview</h2>
            <button className="text-primary hover:text-primary/80">
              View Details
            </button>
          </div>
          <AnalyticsChart 
            data={dashboardData?.charts?.dailyViews || []} 
          />
        </div>

        {/* Recent Posts */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Recent Posts</h2>
            <Link
              href="/admin/posts"
              className="text-primary hover:text-primary/80"
            >
              View All
            </Link>
          </div>
          <RecentPosts posts={dashboardData?.recentActivities || []} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Popular Posts */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Popular Posts</h2>
            <button className="text-primary hover:text-primary/80">
              View Report
            </button>
          </div>
          <PopularPosts posts={dashboardData?.popularPosts || []} />
        </div>

        {/* Activity Feed */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <ActivityFeed activities={dashboardData?.recentActivities || []} />
        </div>
      </div>

      {/* Real-time Analytics */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-6">Real-time Analytics</h2>
        <RealTimeAnalytics />
      </div>

      {/* Portfolio Overview */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Portfolio Overview</h2>
        <PortfolioOverview />
      </div>
    </div>
  );
} 