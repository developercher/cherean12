'use client';
import { useState } from 'react';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

interface PortfolioFiltersProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: { category: string; dateRange: string }) => void;
  categories: string[];
}

export default function PortfolioFilters({ onSearch, onFilterChange, categories = [] }: PortfolioFiltersProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [dateRange, setDateRange] = useState('all');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const handleFilterChange = (category: string, range: string) => {
    setSelectedCategory(category);
    setDateRange(range);
    onFilterChange({ category, dateRange: range });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search projects..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <select
            value={selectedCategory}
            onChange={(e) => handleFilterChange(e.target.value, dateRange)}
            className="rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary"
          >
            <option value="">All Categories</option>
            {Array.isArray(categories) && categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <select
            value={dateRange}
            onChange={(e) => handleFilterChange(selectedCategory, e.target.value)}
            className="rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Time</option>
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="year">Last Year</option>
          </select>
        </div>
      </div>
    </div>
  );
} 