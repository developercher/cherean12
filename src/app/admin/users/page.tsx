'use client';
import { useState } from 'react';
import UserManagementTable from '@/components/admin/users/UserManagementTable';
import UserAnalytics from '@/components/admin/users/UserAnalytics';

export default function UsersPage() {
  const [activeTab, setActiveTab] = useState<'management' | 'analytics'>('management');

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('management')}
            className={`
              py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'management'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            User Management
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`
              py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'analytics'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            Analytics
          </button>
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'management' ? (
        <UserManagementTable />
      ) : (
        <UserAnalytics />
      )}
    </div>
  );
} 