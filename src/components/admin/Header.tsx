'use client';
import { useState, useEffect } from 'react';
import { useTheme } from '@/components/providers/ThemeProvider';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import {
  SunIcon,
  MoonIcon,
  MagnifyingGlassIcon,
  Cog6ToothIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  UserIcon,
  KeyIcon,
  BellIcon,
} from '@heroicons/react/24/outline';
import NotificationsDropdown from './notifications/NotificationsDropdown';
import Link from 'next/link';
import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { signOut } from 'next-auth/react';
import { useSearch } from '@/contexts/SearchContext';
import SearchModal from './search/SearchModal';

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { data: session } = useSession();
  const [showSearch, setShowSearch] = useState(false);

  // Add keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="bg-background-secondary border-b border-border-default sticky top-0 z-40">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <motion.h1 
              className="text-xl font-semibold"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              Admin Dashboard
            </motion.h1>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Search Button */}
            <button
              onClick={() => setShowSearch(true)}
              className="flex items-center px-3 py-2 text-sm text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-lg hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
            >
              <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
              <span>Search...</span>
              <span className="ml-2 text-xs text-gray-400 border border-gray-300 rounded px-1">
                ⌘K
              </span>
            </button>

            {/* Theme Toggle */}
            <motion.button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-background-tertiary transition-colors duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {theme === 'light' ? (
                <MoonIcon className="h-5 w-5 text-text-secondary" />
              ) : (
                <SunIcon className="h-5 w-5 text-text-secondary" />
              )}
            </motion.button>

            {/* Notifications */}
            <NotificationsDropdown />

            {/* Settings */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg hover:bg-background-tertiary transition-colors duration-200"
            >
              <Link href="/admin/settings">
                <Cog6ToothIcon className="h-5 w-5 text-text-secondary" />
              </Link>
            </motion.button>

            {/* User Profile */}
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center gap-2 cursor-pointer">
                <motion.div 
                  className="flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                >
                  {session?.user?.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || ''}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {session?.user?.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                  )}
                  <div className="hidden md:block">
                    <div className="text-sm font-medium">{session?.user?.name}</div>
                    <div className="text-xs text-text-secondary">{session?.user?.role}</div>
                  </div>
                </motion.div>
              </Menu.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="px-1 py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          href="/admin/profile"
                          className={`${
                            active ? 'bg-primary text-white' : 'text-gray-900 dark:text-gray-100'
                          } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                        >
                          <UserIcon className="mr-2 h-5 w-5" />
                          My Profile
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          href="/admin/settings"
                          className={`${
                            active ? 'bg-primary text-white' : 'text-gray-900 dark:text-gray-100'
                          } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                        >
                          <Cog6ToothIcon className="mr-2 h-5 w-5" />
                          Settings
                        </Link>
                      )}
                    </Menu.Item>
                  </div>
                  <div className="px-1 py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          href="/admin/security"
                          className={`${
                            active ? 'bg-primary text-white' : 'text-gray-900 dark:text-gray-100'
                          } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                        >
                          <KeyIcon className="mr-2 h-5 w-5" />
                          Security
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          href="/admin/notifications"
                          className={`${
                            active ? 'bg-primary text-white' : 'text-gray-900 dark:text-gray-100'
                          } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                        >
                          <BellIcon className="mr-2 h-5 w-5" />
                          Notifications
                        </Link>
                      )}
                    </Menu.Item>
                  </div>
                  <div className="px-1 py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => signOut()}
                          className={`${
                            active ? 'bg-primary text-white' : 'text-gray-900 dark:text-gray-100'
                          } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                        >
                          <ArrowRightOnRectangleIcon className="mr-2 h-5 w-5" />
                          Sign Out
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>

      {/* Search Modal */}
      <SearchModal
        isOpen={showSearch}
        onClose={() => setShowSearch(false)}
      />
    </header>
  );
} 