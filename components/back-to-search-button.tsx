'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export function BackToSearchButton() {
  const router = useRouter();

  const handleBackToSearch = () => {
    // Check if we have saved search state
    const savedState = sessionStorage.getItem('sourcesSoughtSearchState');
    
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        const params = new URLSearchParams();
        
        // Build URL with saved search parameters
        if (parsed.searchQuery) params.set('q', parsed.searchQuery);
        if (parsed.sortBy && parsed.sortBy !== 'updated_date') params.set('sort', parsed.sortBy);
        if (parsed.typeFilter) params.set('type', parsed.typeFilter);
        if (parsed.pageSize && parsed.pageSize !== 25) params.set('pageSize', parsed.pageSize.toString());
        if (parsed.currentPage && parsed.currentPage !== 1) params.set('page', parsed.currentPage.toString());
        if (parsed.useHybridSearch) params.set('hybrid', 'true');
        
        const queryString = params.toString();
        router.push(`/admin/sources-sought${queryString ? `?${queryString}` : ''}`);
      } catch (e) {
        console.error('Error parsing saved search state:', e);
        router.push('/admin/sources-sought');
      }
    } else {
      // No saved state, just go back to the main page
      router.push('/admin/sources-sought');
    }
  };

  return (
    <button
      onClick={handleBackToSearch}
      className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
    >
      <ArrowLeftIcon className="h-4 w-4 mr-1" />
      Back to Search
    </button>
  );
}