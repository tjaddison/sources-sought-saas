'use client';

import { DocumentIcon, UserGroupIcon, ClipboardDocumentListIcon, ClockIcon } from '@heroicons/react/24/outline';

interface DashboardStatsProps {
  stats: {
    capabilities: number;
    resumes: number;
    proposals: number;
    lastUpdated: string;
  };
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const statItems = [
    {
      name: 'Capability Statements',
      value: stats.capabilities,
      icon: DocumentIcon,
      color: 'blue',
    },
    {
      name: 'Team Resumes',
      value: stats.resumes,
      icon: UserGroupIcon,
      color: 'green',
    },
    {
      name: 'Past Proposals',
      value: stats.proposals,
      icon: ClipboardDocumentListIcon,
      color: 'purple',
    },
  ];

  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-4">Content Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {statItems.map((item) => (
          <div
            key={item.name}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
          >
            <div className="flex items-center">
              <div className={`p-2 rounded-lg bg-${item.color}-100 mr-4`}>
                <item.icon className={`h-6 w-6 text-${item.color}-600`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{item.value}</p>
                <p className="text-sm text-gray-600">{item.name}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center space-x-2 mb-3">
          <ClockIcon className="h-5 w-5 text-gray-400" />
          <h3 className="text-sm font-medium text-gray-900">Last Updated</h3>
        </div>
        <p className="text-sm text-gray-600">
          Profile last updated on {formatDate(stats.lastUpdated)}
        </p>
      </div>
    </div>
  );
}