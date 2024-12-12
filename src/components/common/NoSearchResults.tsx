'use client';
import { motion } from 'framer-motion';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface NoSearchResultsProps {
  title?: string;
  description?: string;
  onClear?: () => void;
}

export default function NoSearchResults({
  title = "No Results Found",
  description = "Try adjusting your search or filters to find what you're looking for.",
  onClear
}: NoSearchResultsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center py-12"
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 max-w-md mx-auto">
        <div className="mb-6">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 10, -10, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="mx-auto"
          >
            <MagnifyingGlassIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          </motion.div>
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-gray-500 dark:text-gray-400">
            {description}
          </p>
        </div>
        {onClear && (
          <button
            onClick={onClear}
            className="btn btn-outline-primary"
          >
            Clear Filters
          </button>
        )}
      </div>
    </motion.div>
  );
} 