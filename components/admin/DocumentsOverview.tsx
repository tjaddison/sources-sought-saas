'use client';

import Link from 'next/link';
import { 
  DocumentIcon, 
  UserGroupIcon, 
  ClipboardDocumentListIcon,
  PlusIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

interface DocumentsOverviewProps {
  documentCounts: {
    capability: number;
    resume: number;
    proposal: number;
  };
}

const documentTypes = [
  {
    type: 'capability',
    name: 'Capability Statements',
    description: 'Company capabilities, past performance, and qualifications',
    icon: DocumentIcon,
    color: 'blue',
  },
  {
    type: 'resume',
    name: 'Team Resumes',
    description: 'Key personnel and team member qualifications',
    icon: UserGroupIcon,
    color: 'green',
  },
  {
    type: 'proposal',
    name: 'Past Proposals',
    description: 'Examples of previous proposals and submissions',
    icon: ClipboardDocumentListIcon,
    color: 'purple',
  },
];

export default function DocumentsOverview({ documentCounts }: DocumentsOverviewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {documentTypes.map((docType) => {
        const count = documentCounts[docType.type as keyof typeof documentCounts];
        
        return (
          <div
            key={docType.type}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className={`p-2 rounded-lg bg-${docType.color}-100`}>
                  <docType.icon className={`h-6 w-6 text-${docType.color}-600`} />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {docType.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {count} {count === 1 ? 'document' : 'documents'}
                  </p>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-6">
                {docType.description}
              </p>

              <div className="space-y-3">
                <Link
                  href={`/admin/documents/${docType.type}/upload`}
                  className={`flex items-center justify-center space-x-2 w-full px-4 py-2 bg-${docType.color}-600 text-white rounded-lg hover:bg-${docType.color}-700 transition-colors`}
                >
                  <PlusIcon className="h-4 w-4" />
                  <span>Upload New</span>
                </Link>
                
                {count > 0 && (
                  <Link
                    href={`/admin/documents/${docType.type}`}
                    className="flex items-center justify-center space-x-2 w-full px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <span>Manage Documents</span>
                    <ArrowRightIcon className="h-4 w-4" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}