'use client';
import { useState, useEffect } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import TrafficChart from './TrafficChart';
import VisitorMap from './VisitorMap';
import PageViewsTable from './PageViewsTable';
import BrowserStats from './BrowserStats';
import DeviceStats from './DeviceStats';
import RealTimeVisitors from './RealTimeVisitors';
import BehaviorFlow from './BehaviorFlow';
import HeatmapChart from './HeatmapChart';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState('7d');
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/analytics/dashboard?range=${timeRange}`);
        if (!response.ok) throw new Error('Failed to fetch analytics');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
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
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
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
        {data.stats.map((stat: any) => (
          <div key={stat.label} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</h3>
            <div className="mt-2 flex items-baseline">
              <p className="text-2xl font-semibold">{stat.value}</p>
              <p className={`ml-2 text-sm ${stat.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stat.trend > 0 ? '+' : ''}{stat.trend}%
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Traffic Chart */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Traffic Overview</h2>
        <TrafficChart data={data.traffic} />
      </div>

      {/* Visitor Map */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Visitor Locations</h2>
        <VisitorMap data={data.locations} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Browser Stats */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Browser Distribution</h2>
          <BrowserStats data={data.browsers} />
        </div>

        {/* Device Stats */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Device Distribution</h2>
          <DeviceStats data={data.devices} />
        </div>
      </div>

      {/* Page Views Table */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Top Pages</h2>
        <PageViewsTable data={data.pages} />
      </div>

      {/* Real-time Visitors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RealTimeVisitors />
        <HeatmapChart />
      </div>

      {/* User Flow */}
      <BehaviorFlow data={data.flowData} />
    </div>
  );
} 