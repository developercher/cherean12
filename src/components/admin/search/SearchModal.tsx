'use client';
import React, { Fragment, useState, useEffect, useRef } from 'react';
import { Dialog, Transition, Combobox } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  ClockIcon,
  XMarkIcon,
  ArrowTrendingUpIcon,
  DocumentIcon,
  UserIcon,
  FolderIcon,
  TagIcon,
} from '@heroicons/react/24/outline';
import { useSearch } from '@/contexts/SearchContext';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const {
    recentSearches,
    clearRecentSearches,
    recommendations,
    searchResults,
    isLoading,
    performSearch,
  } = useSearch();

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleSearch = (term: string) => {
    setQuery(term);
    performSearch(term);
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'post':
        return DocumentIcon;
      case 'user':
        return UserIcon;
      case 'portfolio':
        return FolderIcon;
      default:
        return TagIcon;
    }
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 overflow-y-auto"
        onClose={onClose}
      >
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-900/75 transition-opacity" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full max-w-2xl my-8 text-left align-middle transition-all transform">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl">
                <Combobox onChange={handleSearch}>
                  <div className="relative">
                    <MagnifyingGlassIcon
                      className="pointer-events-none absolute top-3.5 left-4 h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                    <Combobox.Input
                      ref={searchInputRef}
                      className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-0 sm:text-sm"
                      placeholder="Search..."
                      value={query}
                      onChange={(e) => handleSearch(e.target.value)}
                    />
                  </div>

                  <div className="border-t border-gray-100 dark:border-gray-700 px-6 py-4 min-h-[400px]">
                    <AnimatePresence mode="wait">
                      {query === '' ? (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          {/* Recent Searches */}
                          <div className="mb-6">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                                Recent Searches
                              </h3>
                              {recentSearches.length > 0 && (
                                <button
                                  onClick={clearRecentSearches}
                                  className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                                >
                                  Clear all
                                </button>
                              )}
                            </div>
                            {recentSearches.length > 0 ? (
                              <div className="space-y-2">
                                {recentSearches.map((term) => (
                                  <button
                                    key={term}
                                    onClick={() => handleSearch(term)}
                                    className="flex items-center space-x-3 w-full p-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                                  >
                                    <ClockIcon className="h-4 w-4 text-gray-400" />
                                    <span>{term}</span>
                                  </button>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                No recent searches
                              </p>
                            )}
                          </div>

                          {/* Trending Searches */}
                          <div>
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                              Trending
                            </h3>
                            <div className="space-y-2">
                              {['Dashboard', 'Users', 'Analytics', 'Posts'].map((term) => (
                                <button
                                  key={term}
                                  onClick={() => handleSearch(term)}
                                  className="flex items-center space-x-3 w-full p-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                                >
                                  <ArrowTrendingUpIcon className="h-4 w-4 text-gray-400" />
                                  <span>{term}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          {isLoading ? (
                            <div className="flex items-center justify-center py-8">
                              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
                            </div>
                          ) : searchResults.length > 0 ? (
                            <div className="space-y-2">
                              {searchResults.map((result: any) => (
                                <motion.button
                                  key={result.id}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="flex items-center space-x-3 w-full p-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                                  onClick={() => {
                                    onClose();
                                    // Navigate to result
                                  }}
                                >
                                  {React.createElement(getResultIcon(result.type), {
                                    className: "h-4 w-4 text-gray-400",
                                  })}
                                  <div className="flex-1 text-left">
                                    <p className="font-medium">{result.title}</p>
                                    <p className="text-xs text-gray-500">
                                      {result.description}
                                    </p>
                                  </div>
                                </motion.button>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
                              No results found for "{query}"
                            </p>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Combobox>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
} 