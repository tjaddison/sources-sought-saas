'use client';

import Link from 'next/link';
import { 
  PlusIcon, 
  UserIcon, 
  DocumentIcon, 
  MagnifyingGlassIcon 
} from '@heroicons/react/24/outline';

const actions = [
  {
    name: 'Update Profile',
    description: 'Edit company information and description',
    href: '/admin/profile/company-info',
    icon: UserIcon,
    color: 'blue',
  },
  {
    name: 'Upload Documents',
    description: 'Add capability statements, resumes, or proposals',
    href: '/admin/documents',
    icon: PlusIcon,
    color: 'green',
  },
  {
    name: 'Manage Documents',
    description: 'View, download, or delete existing documents',
    href: '/admin/documents',
    icon: DocumentIcon,
    color: 'purple',
  },
  {
    name: 'Index Content',
    description: 'Process documents for better matching',
    href: '/admin/content-indexing',
    icon: MagnifyingGlassIcon,
    color: 'orange',
  },
];

export default function QuickActions() {
  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
      
      <div className="space-y-3">
        {actions.map((action) => (
          <Link
            key={action.name}
            href={action.href}
            className="block bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg bg-${action.color}-100 flex-shrink-0`}>
                <action.icon className={`h-5 w-5 text-${action.color}-600`} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  {action.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {action.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900 mb-2">
          💡 Tips for Better Matching
        </h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Keep your company description current and detailed</li>
          <li>• Upload recent capability statements and proposals</li>
          <li>• Include team member resumes with relevant skills</li>
          <li>• Run content indexing after adding new documents</li>
        </ul>
      </div>
    </div>
  );
}