'use client';
import { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import DeleteConfirmModal from '@/components/admin/modals/DeleteConfirmModal';
import { toast } from 'react-hot-toast';
import PortfolioFilters from '@/components/admin/portfolio/PortfolioFilters';
import PortfolioStats from '@/components/admin/portfolio/PortfolioStats';

export default function PortfolioPage() {
  const [portfolios, setPortfolios] = useState([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [filteredPortfolios, setFilteredPortfolios] = useState([]);

  useEffect(() => {
    const init = async () => {
      await Promise.all([loadPortfolios(), loadCategories()]);
      setIsLoading(false);
    };
    init();
  }, []);

  const loadPortfolios = async () => {
    try {
      const response = await fetch('/api/portfolio');
      const data = await response.json();
      setPortfolios(data);
    } catch (error) {
      toast.error('Failed to load portfolio items');
    } finally {
      setIsLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/portfolio/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load categories:', error);
      setCategories([]);
      toast.error('Failed to load categories');
    }
  };

  const handleDelete = async () => {
    if (!selectedItem) return;

    try {
      const response = await fetch(`/api/portfolio/${selectedItem.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete portfolio item');

      toast.success('Portfolio item deleted successfully');
      loadPortfolios();
    } catch (error) {
      toast.error('Failed to delete portfolio item');
    } finally {
      setShowDeleteModal(false);
      setSelectedItem(null);
    }
  };

  const handleSearch = (query: string) => {
    const filtered = portfolios.filter((item: any) => 
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredPortfolios(filtered);
  };

  const handleFilterChange = ({ category, dateRange }: any) => {
    let filtered = [...portfolios];

    if (category) {
      filtered = filtered.filter((item: any) => item.category === category);
    }

    if (dateRange !== 'all') {
      const now = new Date();
      const startDate = new Date();
      
      switch (dateRange) {
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate.setDate(now.getDate() - 30);
          break;
        case 'year':
          startDate.setDate(now.getDate() - 365);
          break;
      }

      filtered = filtered.filter((item: any) => 
        new Date(item.date) >= startDate
      );
    }

    setFilteredPortfolios(filtered);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Portfolio</h1>
        <Link
          href="/admin/portfolio/new"
          className="btn btn-primary flex items-center"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          New Project
        </Link>
      </div>

      <PortfolioStats />

      <PortfolioFilters
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        categories={categories}
      />

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-500 dark:text-gray-400">Loading portfolio...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPortfolios.map((item: any) => (
            <div
              key={item.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative aspect-video">
                <img
                  src={item.image || '/placeholder.png'}
                  alt={item.title}
                  className="w-full h-full object-cover rounded-t-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center space-x-4">
                  <Link
                    href={`/admin/portfolio/${item.id}/edit`}
                    className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <PencilIcon className="w-5 h-5 text-gray-600" />
                  </Link>
                  <button
                    onClick={() => {
                      setSelectedItem(item);
                      setShowDeleteModal(true);
                    }}
                    className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <TrashIcon className="w-5 h-5 text-red-600" />
                  </button>
                  <Link
                    href={`/portfolio/${item.id}`}
                    className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <EyeIcon className="w-5 h-5 text-blue-600" />
                  </Link>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>{item.category}</span>
                  <span>{new Date(item.date).toLocaleDateString()}</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {item.services?.map((service: string, index: number) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedItem(null);
        }}
        onConfirm={handleDelete}
        itemType="Portfolio Item"
      />
    </div>
  );
} 