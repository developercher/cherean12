'use client';
import { Dialog } from '@headlessui/react';

interface UserBanModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
  onBanned: () => void;
}

export default function UserBanModal({ isOpen, onClose, userId, userName, onBanned }: UserBanModalProps) {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
        <div className="relative bg-white dark:bg-gray-800 rounded-lg max-w-md w-full mx-4 p-6">
          <Dialog.Title className="text-lg font-medium mb-4">
            Ban User: {userName}
          </Dialog.Title>
          <div className="space-y-4">
            <p>Are you sure you want to ban this user?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="btn btn-ghost"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onBanned();
                  onClose();
                }}
                className="btn btn-danger"
              >
                Ban User
              </button>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
} 