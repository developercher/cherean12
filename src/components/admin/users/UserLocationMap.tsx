'use client';
import { useState, useEffect } from 'react';

interface Location {
  country: string;
  users: number;
}

interface UserLocationMapProps {
  locations: Location[];
}

export default function UserLocationMap({ locations }: UserLocationMapProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">User Locations</h2>
      <div className="space-y-4">
        {/* Placeholder for actual map - you can integrate a real map library later */}
        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4">World Map Coming Soon</p>
          <div className="grid grid-cols-2 gap-4">
            {locations.map((location) => (
              <div
                key={location.country}
                className="flex justify-between items-center bg-white dark:bg-gray-600 p-3 rounded-lg"
              >
                <span className="font-medium">{location.country}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {location.users} users
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 