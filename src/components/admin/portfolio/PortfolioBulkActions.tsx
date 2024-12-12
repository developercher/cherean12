'use client';
import { useState } from 'react';
import { 
  TrashIcon, 
  ArrowDownTrayIcon,
  EyeIcon,
  EyeSlashIcon 
} from '@heroicons/react/24/outline';

interface PortfolioBulkActionsProps {
  selectedItems: string[];
  onDelete: (ids: string[]) => void;
  onUpdateStatus: (ids: string[], status: string) => void;
  onExport: () => void;
}

export default function PortfolioBulkActions({ 
  selectedItems, 
  onDelete, 
  onUpdateStatus,
  onExport 
}: PortfolioBulkActionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (selectedItems.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 flex items-center space-x-4">
      <span className="text-sm text-gray-600 dark:text-gray-400">
        {selectedItems.length} items selected
      </span>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => onUpdateStatus(selectedItems, 'published')}
          className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
        >
          <EyeIcon className="w-5 h-5" />
        </button>

        <button
          onClick={() => onUpdateStatus(selectedItems, 'draft')}
          className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg"
        >
          <EyeSlashIcon className="w-5 h-5" />
        </button>

        <button
          onClick={onExport}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
        >
          <ArrowDownTrayIcon className="w-5 h-5" />
        </button>

        <button
          onClick={() => onDelete(selectedItems)}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
} 