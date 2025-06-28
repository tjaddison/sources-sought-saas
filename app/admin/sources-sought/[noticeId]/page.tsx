import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon, DocumentTextIcon, BuildingOfficeIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { OpportunityAnalysis } from '@/components/opportunity-analysis';

interface SourcesSoughtDetail {
  _additional: {
    id: string;
    creationTimeUnix: string;
    lastUpdateTimeUnix: string;
  };
  content: string;
  notice_id: string;
  title: string;
  posted_date: string;
  response_deadline: string;
  naics_code?: string;
  classification_code?: string;
  agency_name: string;
  agency_city?: string;
  agency_state?: string;
  agency_country?: string;
  type: string;
  solicitationNumber?: string;
  fullParentPathName?: string;
  archived?: boolean;
  cancelled?: boolean;
}

async function getSourcesSought(noticeId: string): Promise<SourcesSoughtDetail | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/sources-sought/${noticeId}`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching sources sought:', error);
    return null;
  }
}

export default async function SourcesSoughtDetailPage({
  params,
}: {
  params: Promise<{ noticeId: string }>;
}) {
  const { noticeId } = await params;
  const data = await getSourcesSought(noticeId);
  
  if (!data) {
    notFound();
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  const formatDateTime = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM dd, yyyy \'at\' hh:mm a \'EDT\'');
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/sources-sought"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to Search
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">{data.title}</h1>
              <p className="mt-1 text-sm text-gray-600">Notice ID: {data.notice_id}</p>
            </div>
            
            {(data.archived || data.cancelled) && (
              <div className="flex gap-2">
                {data.archived && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    Archived
                  </span>
                )}
                {data.cancelled && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Cancelled
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Key Dates</h3>
                <dl className="mt-2 space-y-2">
                  <div className="flex items-center text-sm">
                    <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                    <dt className="text-gray-600">Response Deadline:</dt>
                    <dd className="ml-2 font-medium text-gray-900">{formatDateTime(data.response_deadline)}</dd>
                  </div>
                  <div className="flex items-center text-sm">
                    <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                    <dt className="text-gray-600">Posted Date:</dt>
                    <dd className="ml-2 font-medium text-gray-900">{formatDate(data.posted_date)}</dd>
                  </div>
                  <div className="flex items-center text-sm">
                    <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                    <dt className="text-gray-600">Last Updated:</dt>
                    <dd className="ml-2 font-medium text-gray-900">{formatDate(data._additional.lastUpdateTimeUnix)}</dd>
                  </div>
                </dl>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Agency Information</h3>
                <dl className="mt-2 space-y-2">
                  <div className="flex items-start text-sm">
                    <BuildingOfficeIcon className="h-4 w-4 mr-2 text-gray-400 mt-0.5" />
                    <div>
                      <dt className="text-gray-600">Agency:</dt>
                      <dd className="font-medium text-gray-900">{data.agency_name}</dd>
                      {data.fullParentPathName && (
                        <dd className="text-xs text-gray-500 mt-1">{data.fullParentPathName}</dd>
                      )}
                    </div>
                  </div>
                  {(data.agency_city || data.agency_state || data.agency_country) && (
                    <div className="text-sm ml-6">
                      <dt className="text-gray-600">Location:</dt>
                      <dd className="font-medium text-gray-900">
                        {[data.agency_city, data.agency_state, data.agency_country]
                          .filter(Boolean)
                          .join(', ')}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Classification</h3>
                <dl className="mt-2 space-y-2">
                  <div className="text-sm">
                    <dt className="text-gray-600">Type:</dt>
                    <dd className="font-medium text-gray-900">{data.type}</dd>
                  </div>
                  {data.solicitationNumber && (
                    <div className="text-sm">
                      <dt className="text-gray-600">Solicitation Number:</dt>
                      <dd className="font-medium text-gray-900">{data.solicitationNumber}</dd>
                    </div>
                  )}
                  {data.naics_code && (
                    <div className="text-sm">
                      <dt className="text-gray-600">NAICS Code:</dt>
                      <dd className="font-medium text-gray-900">{data.naics_code}</dd>
                    </div>
                  )}
                  {data.classification_code && (
                    <div className="text-sm">
                      <dt className="text-gray-600">Classification Code:</dt>
                      <dd className="font-medium text-gray-900">{data.classification_code}</dd>
                    </div>
                  )}
                </dl>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Actions</h3>
                <div className="mt-2 space-y-2">
                  <button className="w-full text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors">
                    Contact Opportunities
                  </button>
                  <a
                    href={`https://sam.gov/opp/${data.notice_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md transition-colors"
                  >
                    View on SAM.gov
                    <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Description</h3>
            <div className="prose prose-sm max-w-none text-gray-700">
              <p className="whitespace-pre-wrap">{data.content}</p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Analysis Section */}
      <OpportunityAnalysis opportunity={data} />
    </div>
  );
}