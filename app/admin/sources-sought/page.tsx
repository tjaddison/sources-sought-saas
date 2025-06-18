'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import debounce from 'lodash/debounce';

interface SourcesSoughtItem {
  _additional: {
    id: string;
    creationTimeUnix: string;
    lastUpdateTimeUnix: string;
    distance?: number;
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

interface SearchResponse {
  items: SourcesSoughtItem[];
  total: number;
  page: number;
  pageSize: number;
}

const SORT_OPTIONS = [
  { value: 'updated_date', label: 'Updated Date' },
  { value: 'title_asc', label: 'Notice Title (A-Z)' },
  { value: 'title_desc', label: 'Notice Title (Z-A)' },
  { value: 'relevance', label: 'Relevance' },
];

const TYPE_OPTIONS = [
  { value: '', label: 'All Types' },
  { value: 'Sources Sought', label: 'Sources Sought' },
  { value: 'Solicitation', label: 'Solicitation' },
  { value: 'Pre-solicitation', label: 'Pre-solicitation' },
  { value: 'Combined Synopsis/Solicitation', label: 'Combined Synopsis/Solicitation' },
  { value: 'Sale of Surplus Property', label: 'Sale of Surplus Property' },
  { value: 'Special Notice', label: 'Special Notice' },
  { value: 'Award Notice', label: 'Award Notice' },
];

const PAGE_SIZE_OPTIONS = [10, 25, 50];

export default function SourcesSoughtPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'updated_date');
  const [typeFilter, setTypeFilter] = useState(searchParams.get('type') || '');
  const [pageSize, setPageSize] = useState(Number(searchParams.get('pageSize')) || 25);
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<SearchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        q: searchQuery,
        sort: sortBy,
        page: currentPage.toString(),
        pageSize: pageSize.toString(),
      });
      
      if (typeFilter) {
        params.append('type', typeFilter);
      }
      
      const response = await fetch(`/api/sources-sought/search?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, sortBy, typeFilter, currentPage, pageSize]);

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      const params = new URLSearchParams(searchParams);
      if (query) {
        params.set('q', query);
      } else {
        params.delete('q');
      }
      params.set('page', '1');
      router.push(`/admin/sources-sought?${params}`);
    }, 500),
    [searchParams, router]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedSearch(value);
  };

  const handleSortChange = (newSort: string) => {
    setSortBy(newSort);
    const params = new URLSearchParams(searchParams);
    params.set('sort', newSort);
    params.set('page', '1');
    router.push(`/admin/sources-sought?${params}`);
  };

  const handleTypeChange = (newType: string) => {
    setTypeFilter(newType);
    const params = new URLSearchParams(searchParams);
    if (newType) {
      params.set('type', newType);
    } else {
      params.delete('type');
    }
    params.set('page', '1');
    router.push(`/admin/sources-sought?${params}`);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    const params = new URLSearchParams(searchParams);
    params.set('pageSize', newSize.toString());
    params.set('page', '1');
    router.push(`/admin/sources-sought?${params}`);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    router.push(`/admin/sources-sought?${params}`);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  const formatResponseDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy \'at\' hh:mm a \'EDT\'');
    } catch {
      return dateString;
    }
  };

  const totalPages = data ? Math.ceil(data.total / pageSize) : 0;
  const startResult = data ? (currentPage - 1) * pageSize + 1 : 0;
  const endResult = data ? Math.min(currentPage * pageSize, data.total) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Government Opportunities</h1>
        <p className="mt-2 text-sm text-gray-600">
          Search and browse government contracting opportunities from SAM.gov
        </p>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search opportunities..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="relative">
                <select
                  value={typeFilter}
                  onChange={(e) => handleTypeChange(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  {TYPE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      Sort by {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-400">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="p-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : data && data.items.length > 0 ? (
            <>
              <div className="mb-4 flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  Showing {startResult} - {endResult} of {data.total.toLocaleString()} results
                </p>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Show:</span>
                  <select
                    value={pageSize}
                    onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                    className="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    {PAGE_SIZE_OPTIONS.map((size) => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                {data.items.map((item) => (
                  <div key={item._additional.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <Link
                          href={`/admin/sources-sought/${item.notice_id}`}
                          className="text-lg font-medium text-blue-600 hover:text-blue-800"
                        >
                          {item.title}
                        </Link>
                        
                        <p className="mt-1 text-sm text-gray-600">
                          <span className="font-medium">Notice ID:</span> {item.notice_id}
                        </p>
                        
                        <p className="mt-2 text-sm text-gray-700 line-clamp-2">{item.content}</p>
                        
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Department/Ind.Agency</p>
                            <p className="font-medium text-gray-900">{item.agency_name}</p>
                          </div>
                          
                          <div>
                            <p className="text-gray-500">Office</p>
                            <p className="font-medium text-gray-900">
                              {item.agency_city && item.agency_state 
                                ? `${item.agency_city}, ${item.agency_state}`
                                : item.fullParentPathName || 'N/A'}
                            </p>
                          </div>
                          
                          <div>
                            <p className="text-gray-500">Type</p>
                            <p className="font-medium text-gray-900">{item.type}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="ml-6 text-right space-y-2">
                        <button className="text-sm bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md transition-colors">
                          Contact Opportunities
                        </button>
                        
                        <div className="text-sm text-gray-600">
                          <p className="font-medium">Response Date</p>
                          <p>{formatResponseDate(item.response_deadline)}</p>
                        </div>
                        
                        <div className="text-sm text-gray-600">
                          <p>Published {formatDate(item.posted_date)}</p>
                          {item._additional?.lastUpdateTimeUnix && (
                            <p>Updated {formatDate(item._additional.lastUpdateTimeUnix)}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(totalPages, 7) }).map((_, idx) => {
                      let pageNum;
                      if (totalPages <= 7) {
                        pageNum = idx + 1;
                      } else if (currentPage <= 4) {
                        pageNum = idx + 1;
                      } else if (currentPage >= totalPages - 3) {
                        pageNum = totalPages - 6 + idx;
                      } else {
                        pageNum = currentPage - 3 + idx;
                      }
                      
                      return (
                        <button
                          key={idx}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-3 py-1 text-sm font-medium rounded-md ${
                            currentPage === pageNum
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-700 bg-white hover:bg-gray-50 border border-gray-300'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No results found. Try adjusting your search criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}