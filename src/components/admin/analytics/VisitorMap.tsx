'use client';
import { useEffect, useRef } from 'react';

interface VisitorMapProps {
  data: {
    country: string;
    count: number;
  }[];
}

export default function VisitorMap({ data }: VisitorMapProps) {
  return (
    <div className="h-[400px] bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
      <div className="text-center text-gray-500 dark:text-gray-400">
        <p>World Map Visualization Coming Soon</p>
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Top Countries</h3>
          <div className="grid grid-cols-2 gap-4">
            {data.slice(0, 6).map((item) => (
              <div 
                key={item.country} 
                className="flex justify-between items-center bg-white dark:bg-gray-800 p-2 rounded"
              >
                <span>{item.country}</span>
                <span className="font-semibold">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 