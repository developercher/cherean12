'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { signOut } from 'next-auth/react';
import {
  HomeIcon,
  UsersIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  DocumentTextIcon,
  GlobeAltIcon,
  PlusCircleIcon,
  ComputerDesktopIcon,
  PencilSquareIcon,
  RocketLaunchIcon,
  ShoppingCartIcon,
  ChatBubbleLeftRightIcon,
  PhotoIcon,
  NewspaperIcon,
  QueueListIcon,
  ArrowLeftOnRectangleIcon,
  BellIcon,
  ShieldCheckIcon,
  UserIcon,
  CloudIcon,
} from '@heroicons/react/24/outline';

const menuItems = [
  { name: 'Dashboard', href: '/admin', icon: HomeIcon },
  {
    name: 'Content Management',
    icon: DocumentTextIcon,
    submenu: [
      { name: 'Blog Posts', href: '/admin/posts', icon: NewspaperIcon },
      { name: 'Portfolio', href: '/admin/portfolio', icon: PhotoIcon },
      { name: 'Testimonials', href: '/admin/testimonials', icon: ChatBubbleLeftRightIcon },
      { name: 'Resume', href: '/admin/resume', icon: DocumentTextIcon },
    ],
  },
  {
    name: 'Services',
    icon: RocketLaunchIcon,
    submenu: [
      { name: 'Service List', href: '/admin/services', icon: QueueListIcon },
      { name: 'Pricing Plans', href: '/admin/pricing', icon: ShoppingCartIcon },
      { name: 'Clients', href: '/admin/clients', icon: UsersIcon },
    ],
  },
  { name: 'Analytics', href: '/admin/analytics', icon: ChartBarIcon },
  { name: 'Notifications', href: '/admin/notifications', icon: BellIcon },
  {
    name: 'User Management',
    icon: UsersIcon,
    submenu: [
      { name: 'All Users', href: '/admin/users', icon: UsersIcon },
      { name: 'Security Logs', href: '/admin/security/logs', icon: ShieldCheckIcon },
      { name: 'Security Rules', href: '/admin/security/rules', icon: ShieldCheckIcon },
    ],
  },
  {
    name: 'Settings',
    icon: Cog6ToothIcon,
    submenu: [
      { name: 'General', href: '/admin/settings', icon: Cog6ToothIcon },
      { name: 'Profile', href: '/admin/profile', icon: UserIcon },
      { name: 'Security', href: '/admin/security', icon: ShieldCheckIcon },
      { name: 'Backup', href: '/admin/backup', icon: CloudIcon },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const isActive = (href: string) => pathname === href;

  const toggleSubmenu = (name: string) => {
    setExpandedItem(expandedItem === name ? null : name);
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: '/auth/signin' });
  };

  return (
    <nav className="w-64 bg-background-secondary border-r border-border-default h-screen sticky top-0 flex flex-col">
      {/* Logo/Brand */}
      <div className="p-4 border-b border-border-default">
        <Link href="/admin" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-primary">CHERINET</span>
        </Link>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {menuItems.map((item) => (
            <div key={item.name}>
              {item.submenu ? (
                // Menu item with submenu
                <div>
                  <button
                    onClick={() => toggleSubmenu(item.name)}
                    className={`w-full flex items-center justify-between px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200
                      ${expandedItem === item.name
                        ? 'bg-primary text-white'
                        : 'hover:bg-background-tertiary'
                      }`}
                  >
                    <div className="flex items-center">
                      <item.icon className="h-5 w-5 mr-3" />
                      {item.name}
                    </div>
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${
                        expandedItem === item.name ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {expandedItem === item.name && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="ml-4 mt-2 space-y-2"
                    >
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className={`flex items-center px-4 py-2 text-sm rounded-lg transition-colors duration-200 ${
                            isActive(subItem.href)
                              ? 'bg-primary text-white'
                              : 'hover:bg-background-tertiary'
                          }`}
                        >
                          <subItem.icon className="h-4 w-4 mr-3" />
                          {subItem.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </div>
              ) : (
                // Regular menu item
                <Link
                  href={item.href}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    isActive(item.href)
                      ? 'bg-primary text-white'
                      : 'hover:bg-background-tertiary'
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer/Sign Out */}
      <div className="p-4 border-t border-border-default">
        <button
          onClick={handleSignOut}
          className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
        >
          <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-3" />
          Sign Out
        </button>
      </div>
    </nav>
  );
} 