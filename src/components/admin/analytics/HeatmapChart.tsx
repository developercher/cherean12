'use client';
import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import h337 from 'heatmap.js-fixed';

interface ClickData {
  x: number;
  y: number;
  value: number;
  pageUrl: string;
  timestamp: string;
}

export default function HeatmapChart() {
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchClickData = async () => {
      try {
        const response = await fetch('/api/analytics/heatmap');
        if (!response.ok) throw new Error('Failed to fetch heatmap data');
        const data: ClickData[] = await response.json();

        if (containerRef.current) {
          // Configure heatmap instance
          const heatmapInstance = h337.create({
            container: containerRef.current,
            radius: 40,
            maxOpacity: 0.6,
            minOpacity: 0,
            blur: 0.75,
          });

          // Add click data points
          if (data.length > 0) {
            heatmapInstance.setData({
              max: Math.max(...data.map(point => point.value)),
              data: data.map(point => ({
                x: point.x,
                y: point.y,
                value: point.value
              }))
            });
          } else {
            // If no data, show empty state
            heatmapInstance.setData({
              max: 0,
              data: []
            });
          }
        }

      } catch (error) {
        console.error('Error fetching heatmap data:', error);
        toast.error('Failed to load heatmap');
      } finally {
        setIsLoading(false);
      }
    };

    fetchClickData();

    // Cleanup
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Click Heatmap</h2>
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Click Heatmap</h2>
      <div 
        ref={containerRef}
        className="relative h-64 w-full bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden"
      >
        {/* Heatmap will be rendered here */}
      </div>
    </div>
  );
} 