'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { IndexingJob, UserProfile } from '@/lib/dynamodb';
import { hasProfileChanged } from '@/lib/profile-utils';
import { 
  MagnifyingGlassIcon,
  DocumentIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  PlayIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  BuildingOfficeIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import clsx from 'clsx';

interface ContentIndexingDashboardProps {
  indexingHistory: IndexingJob[];
  documentCounts: {
    capability: number;
    resume: number;
    proposal: number;
    total: number;
  };
  indexedCounts: {
    capability: number;
    resume: number;
    proposal: number;
    total: number;
  };
  userProfile: UserProfile | null;
}

export default function ContentIndexingDashboard({
  indexingHistory,
  documentCounts,
  indexedCounts,
  userProfile,
}: ContentIndexingDashboardProps) {
  const router = useRouter();
  const [isStartingIndex, setIsStartingIndex] = useState(false);

  const latestJob = indexingHistory.length > 0 ? indexingHistory[0] : null;
  const isJobRunning = latestJob?.status === 'pending' || latestJob?.status === 'processing';
  
  // Check if reindexing is needed
  const documentsChanged = latestJob?.status === 'completed' && 
    (documentCounts.total !== indexedCounts.total || 
     (latestJob.documentsProcessed && latestJob.documentsProcessed !== documentCounts.total));
  
  const profileChanged = hasProfileChanged(userProfile, latestJob);
  const needsReindexing = documentsChanged || profileChanged;

  // Auto-refresh when a job is running
  useEffect(() => {
    if (isJobRunning) {
      const interval = setInterval(() => {
        router.refresh();
      }, 3000); // Refresh every 3 seconds

      return () => clearInterval(interval);
    }
  }, [isJobRunning, router]);

  const handleStartIndexing = async () => {
    const hasContent = documentCounts.total > 0 || userProfile?.companyDescription;
    if (isJobRunning || !hasContent) return;

    setIsStartingIndex(true);
    
    try {
      const response = await fetch('/api/indexing/start', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to start indexing');
      }

      toast.success('Content indexing started');
      router.refresh();
    } catch (error) {
      console.error('Error starting indexing:', error);
      toast.error('Failed to start indexing');
    } finally {
      setIsStartingIndex(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'processing':
        return <ArrowPathIcon className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-700 bg-yellow-100';
      case 'processing':
        return 'text-blue-700 bg-blue-100';
      case 'completed':
        return 'text-green-700 bg-green-100';
      case 'failed':
        return 'text-red-700 bg-red-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  const documentTypes = [
    {
      type: 'capability',
      name: 'Capability Statements',
      icon: DocumentIcon,
      color: 'blue',
    },
    {
      type: 'resume',
      name: 'Team Resumes',
      icon: UserGroupIcon,
      color: 'green',
    },
    {
      type: 'proposal',
      name: 'Past Proposals',
      icon: ClipboardDocumentListIcon,
      color: 'purple',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Reindexing Alert */}
      {needsReindexing && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <ExclamationTriangleIcon className="h-5 w-5 text-amber-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-amber-900">
                Reindexing Recommended
              </h3>
              <div className="text-sm text-amber-700 mt-1 space-y-1">
                {documentsChanged && (
                  <p>• Documents have been added or removed since the last indexing</p>
                )}
                {profileChanged && (
                  <p>• Company description has been updated since the last indexing</p>
                )}
                <p className="font-medium mt-2">
                  Please run indexing again to ensure all content is searchable.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Info Banner for First Time */}
      {!latestJob && documentCounts.total > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <InformationCircleIcon className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-blue-900">
                Ready to Index
              </h3>
              <p className="text-sm text-blue-700 mt-1">
                You have uploaded documents that need to be indexed for search. 
                Click "Start Content Indexing" to make your content searchable.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Current Status */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium text-gray-900">Indexing Status</h2>
          {latestJob && (
            <div className={clsx(
              'flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium',
              getStatusColor(latestJob.status)
            )}>
              {getStatusIcon(latestJob.status)}
              <span className="capitalize">{latestJob.status}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">
              Document Overview
            </h3>
            <div className="space-y-3">
              {documentTypes.map((docType) => {
                const total = documentCounts[docType.type as keyof typeof documentCounts];
                const indexed = indexedCounts[docType.type as keyof typeof indexedCounts];
                const percentage = total > 0 ? (indexed / total) * 100 : 0;

                return (
                  <div key={docType.type} className="flex items-center space-x-3">
                    <docType.icon className={`h-5 w-5 text-${docType.color}-600`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">{docType.name}</span>
                        <span className="text-gray-500">{indexed}/{total}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className={`bg-${docType.color}-600 h-2 rounded-full transition-all duration-300`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">
              Company Description
            </h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <BuildingOfficeIcon className="h-5 w-5 text-gray-600 mt-0.5" />
                <div className="flex-1">
                  {userProfile?.companyDescription ? (
                    <p className="text-sm text-gray-600 line-clamp-4">
                      {userProfile.companyDescription}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-400 italic">
                      No company description added
                    </p>
                  )}
                </div>
              </div>
              
              <div className="mt-2 p-2 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600">
                  {userProfile?.companyDescription ? 
                    "✓ Will be included in content indexing" : 
                    "⚠ Add description for better matching"
                  }
                </p>
                {!userProfile?.companyDescription && (
                  <a 
                    href="/admin/profile/company-info" 
                    className="text-xs text-blue-600 hover:text-blue-700 mt-1 inline-block"
                  >
                    Add company description →
                  </a>
                )}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button
                onClick={handleStartIndexing}
                disabled={isStartingIndex || isJobRunning || (!userProfile?.companyDescription && documentCounts.total === 0)}
                className={clsx(
                  'w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-colors',
                  (!userProfile?.companyDescription && documentCounts.total === 0)
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : isJobRunning
                    ? 'bg-yellow-100 text-yellow-700 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                )}
              >
                {isStartingIndex ? (
                  <ArrowPathIcon className="h-5 w-5 animate-spin" />
                ) : (
                  <PlayIcon className="h-5 w-5" />
                )}
                <span>
                  {(!userProfile?.companyDescription && documentCounts.total === 0)
                    ? 'No Content to Index'
                    : isJobRunning
                    ? 'Indexing in Progress'
                    : needsReindexing
                    ? 'Reindex Content'
                    : 'Start Content Indexing'}
                </span>
              </button>

              {isJobRunning && (
                <button
                  onClick={() => router.refresh()}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  <ArrowPathIcon className="h-4 w-4" />
                  <span>Refresh Status</span>
                </button>
              )}

              {latestJob && latestJob.status === 'completed' && (
                <div className="text-sm text-gray-600 text-center">
                  Last indexed: {formatDate(latestJob.completedAt || latestJob.startedAt)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Indexing Process Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <MagnifyingGlassIcon className="h-6 w-6 text-blue-600 mt-0.5" />
          <div>
            <h3 className="text-lg font-medium text-blue-900 mb-2">
              How Content Indexing Works
            </h3>
            <ul className="text-sm text-blue-800 space-y-2">
              <li>• Extracts text content from your uploaded documents</li>
              <li>• Generates searchable embeddings using AI technology</li>
              <li>• Enables better matching with relevant opportunities</li>
              <li>• Processes documents securely with user data isolation</li>
              <li>• Updates your profile's searchability and relevance scoring</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Indexing History */}
      {indexingHistory.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Indexing History</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {indexingHistory.slice(0, 10).map((job) => (
              <div key={job.jobId} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(job.status)}
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Indexing Job #{job.jobId.slice(-8)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Started: {formatDate(job.startedAt)}
                        {job.completedAt && ` • Completed: ${formatDate(job.completedAt)}`}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={clsx(
                      'inline-flex px-2 py-1 rounded-full text-xs font-medium',
                      getStatusColor(job.status)
                    )}>
                      {job.status}
                    </div>
                    {job.documentsProcessed && (
                      <p className="text-sm text-gray-500 mt-1">
                        {job.documentsProcessed} documents processed
                      </p>
                    )}
                  </div>
                </div>
                
                {job.error && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">Error: {job.error}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}