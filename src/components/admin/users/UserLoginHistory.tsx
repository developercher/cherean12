'use client';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';

interface LoginRecord {
  id: string;
  timestamp: string;
  ip: string;
  userAgent: string;
  location: string;
  success: boolean;
  reason: string;
}

export default function UserLoginHistory({ userId }: { userId: string }) {
  const [history, setHistory] = useState<LoginRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(`/api/users/${userId}/login-history`);
        if (!response.ok) throw new Error('Failed to fetch login history');
        const data = await response.json();
        setHistory(data);
      } catch (error) {
        console.error('Failed to fetch login history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [userId]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Login History</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="table-header">Time</th>
              <th className="table-header">IP</th>
              <th className="table-header">Location</th>
              <th className="table-header">Status</th>
              <th className="table-header">Reason</th>
            </tr>
          </thead>
          <tbody>
            {history.map((record) => (
              <tr key={record.id}>
                <td className="table-cell">
                  {format(new Date(record.timestamp), 'MMM d, yyyy HH:mm:ss')}
                </td>
                <td className="table-cell">{record.ip}</td>
                <td className="table-cell">{record.location || 'Unknown'}</td>
                <td className="table-cell">
                  <span className={`badge ${record.success ? 'badge-success' : 'badge-error'}`}>
                    {record.success ? 'Success' : 'Failed'}
                  </span>
                </td>
                <td className="table-cell">{record.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 