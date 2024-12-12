'use client';
import { useState, useEffect } from 'react';
import { EyeIcon, HeartIcon, FolderIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function PortfolioOverview() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/portfolio/overview');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Failed to fetch portfolio overview:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <div>Loading portfolio data...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Projects</p>
              <p className="text-2xl font-semibold mt-1">{data?.totalProjects || 0}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
              <FolderIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Views</p>
              <p className="text-2xl font-semibold mt-1">{data?.totalViews || 0}</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
              <EyeIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Likes</p>
              <p className="text-2xl font-semibold mt-1">{data?.totalLikes || 0}</p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full">
              <HeartIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Projects */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Recent Projects</h3>
          <Link 
            href="/admin/portfolio" 
            className="text-primary hover:text-primary/80"
          >
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.recentProjects?.map((project: any) => (
            <div 
              key={project.id}
              className="bg-gray-50 dark:bg-gray-900/50 rounded-lg overflow-hidden"
            >
              <div className="aspect-video relative">
                <img
                  src={project.image || '/placeholder.png'}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h4 className="font-medium mb-1">{project.title}</h4>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{project.category}</span>
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <EyeIcon className="w-4 h-4 mr-1" />
                      {project.views}
                    </span>
                    <span className="flex items-center">
                      <HeartIcon className="w-4 h-4 mr-1" />
                      {project.likes}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 