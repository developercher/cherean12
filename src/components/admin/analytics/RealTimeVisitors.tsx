'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

interface Visitor {
  _id: string;
  pageUrl: string;
  browser: string;
  device: string;
  os: string;
  country: string;
  city: string;
  timestamp: string;
  userAgent?: string;
  ip?: string;
  eventType?: string;
  sessionId?: string;
  referrer?: string;
}

export default function RealTimeVisitors() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  useEffect(() => {
    const fetchVisitors = async () => {
      try {
        const response = await fetch('/api/analytics/realtime/visitors');
        if (!response.ok) throw new Error('Failed to fetch visitors');
        const data = await response.json();
        // Ensure we're working with an array
        setVisitors(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching visitors:', error);
        toast.error('Failed to fetch real-time visitors');
        setVisitors([]); // Set empty array on error
      } finally {
        setIsLoading(false);
      }
    };

    // Initial fetch
    fetchVisitors();

    // Set up polling every 5 seconds
    const interval = setInterval(fetchVisitors, 5000);

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Real-time Visitors</h2>
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Real-time Visitors</h2>
      <div className="space-y-4">
        <AnimatePresence>
          {visitors.map((visitor) => (
            <motion.div
              key={visitor._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="border dark:border-gray-700 rounded-lg p-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{visitor.pageUrl}</p>
                  <p className="text-sm text-gray-500">
                    {visitor.browser} • {visitor.device} • {visitor.os}
                  </p>
                  <p className="text-sm text-gray-500">
                    {visitor.city}, {visitor.country}
                  </p>
                </div>
                <span className="text-xs text-gray-400">
                  {formatTimestamp(visitor.timestamp)}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {visitors.length === 0 && (
          <p className="text-center text-gray-500 py-4">
            No active visitors at the moment
          </p>
        )}
      </div>
    </div>
  );
} 