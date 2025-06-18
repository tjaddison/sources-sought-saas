'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  HomeIcon,
  UserIcon,
  DocumentIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import clsx from 'clsx';

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon },
  { name: 'Profile', href: '/admin/profile', icon: UserIcon },
  { name: 'Documents', href: '/admin/documents', icon: DocumentIcon },
  { name: 'Content Indexing', href: '/admin/content-indexing', icon: MagnifyingGlassIcon },
];

interface AdminNavigationProps {
  user: {
    name?: string;
    email?: string;
    [key: string]: unknown;
  };
}

export default function AdminNavigation({ user }: AdminNavigationProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div className={clsx(
        'fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg lg:hidden transition-transform duration-300',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex items-center justify-between p-4 border-b">
          <h1 className="text-lg font-semibold text-gray-900">Admin Panel</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <SidebarContent pathname={pathname} />
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          <div className="flex items-center p-4 border-b">
            <h1 className="text-lg font-semibold text-gray-900">Admin Panel</h1>
          </div>
          <SidebarContent pathname={pathname} />
        </div>
      </div>

      {/* Main content area */}
      <div className="lg:pl-64">
        {/* Top navigation */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Mobile menu button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-400 hover:text-gray-600"
              >
                <Bars3Icon className="h-6 w-6" />
              </button>

              {/* User menu */}
              <div className="flex items-center space-x-4 ml-auto">
                <div className="text-sm text-gray-700">
                  Welcome, {user.name || user.email}
                </div>
                <a
                  href="/auth/logout"
                  className="flex items-center space-x-2 text-gray-500 hover:text-gray-700"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5" />
                  <span>Logout</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function SidebarContent({ pathname }: { pathname: string }) {
  return (
    <nav className="flex-1 p-4 space-y-2">
      {navigation.map((item) => {
        const isActive = pathname === item.href || 
          (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
        
        return (
          <Link
            key={item.name}
            href={item.href}
            className={clsx(
              'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              isActive
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'text-gray-700 hover:bg-gray-100'
            )}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}