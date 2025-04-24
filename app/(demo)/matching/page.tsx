'use client'

import { useState } from 'react';
import Link from 'next/link';
import { demoOpportunities, Opportunity } from '@/lib/demo-data'; // Adjust path if needed

// Simple Opportunity Card Component
function OpportunityCard({ opp }: { opp: Opportunity }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow duration-150 ease-in-out">
      <div className="flex justify-between items-start mb-2 gap-2">
        <h3 className="text-lg font-semibold text-blue-700 hover:text-blue-900 flex-1">
          {/* Link to the analysis page, passing the opportunity ID */}
          <Link href={`/analysis?oppId=${opp.id}`}>{opp.title}</Link>
        </h3>
        {opp.matchScore && (
          <span className={`flex-shrink-0 text-sm font-bold px-2.5 py-1 rounded-full ${
            opp.matchScore >= 85 ? 'bg-green-100 text-green-800' : opp.matchScore >= 70 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
          }`}>
            {opp.matchScore}% Match
          </span>
        )}
      </div>
      <div className="text-sm text-gray-600 mb-3 space-y-1">
         <p><strong>Agency:</strong> {opp.agency}</p>
         <p><strong>Type:</strong> {opp.noticeType}</p>
         <p><strong>Response Due:</strong> {opp.responseDate}</p>
         {opp.setAside && <p><strong>Set Aside:</strong> {opp.setAside}</p>}
      </div>
      <p className="text-sm text-gray-500 line-clamp-2 mb-4">{opp.description}</p>
      <div className="flex justify-end space-x-2 border-t pt-3 mt-3">
         <Link href={`/analysis?oppId=${opp.id}`} className="text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1.5 rounded font-medium transition-colors">Analyze</Link>
         <Link href={`/response?oppId=${opp.id}`} className="text-xs bg-green-100 text-green-700 hover:bg-green-200 px-3 py-1.5 rounded font-medium transition-colors">Draft Response</Link>
         {/* Add to pipeline button could trigger a state change or API call in real app */}
         <button className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-1.5 rounded font-medium transition-colors">Add to Pipeline</button>
      </div>
    </div>
  );
}

export default function MatchingPage() {
  // Initialize state with non-archived opportunities
  const [opportunities, setOpportunities] = useState<Opportunity[]>(
    demoOpportunities.filter(o => o.status !== 'Archived')
  );
  const [filter, setFilter] = useState(''); // State for the filter input
  const [loading, setLoading] = useState(false); // State for loading indicator

  // --- Simulation Logic ---

  // Simulate filtering based on keyword input
  const handleFilter = () => {
    setLoading(true);
    // Simulate network delay or processing time
    setTimeout(() => {
      const lowerCaseFilter = filter.toLowerCase();
      const filtered = demoOpportunities.filter(opp =>
         opp.status !== 'Archived' && // Exclude archived
         (opp.title.toLowerCase().includes(lowerCaseFilter) ||
          opp.description.toLowerCase().includes(lowerCaseFilter) ||
          opp.agency.toLowerCase().includes(lowerCaseFilter))
      );
      setOpportunities(filtered);
      setLoading(false);
    }, 700); // 0.7 second delay
  };

  // Simulate sorting based on selected criteria
  const handleSort = (criteria: keyof Opportunity | 'matchScore' | 'responseDate') => {
     setLoading(true);
     // Simulate network delay or processing time
     setTimeout(() => {
        const sorted = [...opportunities].sort((a, b) => {
            if (criteria === 'matchScore') {
                // Sort descending by score (highest first), treat undefined score as 0
                return (b.matchScore ?? 0) - (a.matchScore ?? 0);
            }
            if (criteria === 'responseDate') {
                // Sort ascending by date (earliest first)
                return new Date(a.responseDate).getTime() - new Date(b.responseDate).getTime();
            }
            // Add other potential sort criteria here if needed
            // Example: Sort by title alphabetically
            // if (criteria === 'title') {
            //    return a.title.localeCompare(b.title);
            // }
            return 0; // Default: no change in order
        });
        setOpportunities(sorted);
        setLoading(false);
     }, 500); // 0.5 second delay
  };

  // Handle Enter key press in filter input
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleFilter();
    }
  };

  // --- End Simulation Logic ---


  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Opportunity Matching</h1>
      <p className="text-gray-700 mb-6">
        Simulated list of potential Sources Sought notices matched to your profile. Use the filters and sorting options below.
      </p>

      {/* Simulated Filters/Sort Controls */}
      <div className="bg-white p-4 rounded-lg shadow mb-6 flex flex-wrap gap-4 items-end border border-gray-200">
        <div className="flex-grow min-w-[200px]">
          <label htmlFor="filter" className="block text-sm font-medium text-gray-700 mb-1">Filter by Keyword</label>
          <input
            type="text"
            id="filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            onKeyDown={handleKeyDown} // Trigger filter on Enter key
            placeholder="e.g., cybersecurity, cloud, agency name"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150"
            disabled={loading}
          />
        </div>
        <button
          onClick={handleFilter}
          disabled={loading}
          className={`px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Filtering...' : 'Apply Filter'}
        </button>
         <div className="flex gap-2 flex-wrap">
             <button
                onClick={() => handleSort('matchScore')}
                disabled={loading}
                className={`px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
             >
                Sort by Match %
             </button>
             <button
                onClick={() => handleSort('responseDate')}
                disabled={loading}
                className={`px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
             >
                Sort by Due Date
             </button>
         </div>
      </div>

      {/* Opportunity List Display */}
      {loading && (
        <div className="text-center text-gray-600 my-10">
            <svg className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading opportunities...
        </div>
      )}
      {!loading && opportunities.length === 0 && (
         <div className="text-center text-gray-500 bg-gray-50 p-8 rounded-lg border border-dashed border-gray-300 my-8">
            <h3 className="text-lg font-medium text-gray-700">No Matching Opportunities Found</h3>
            <p className="mt-1 text-sm">Try adjusting your filter keywords.</p>
         </div>
      )}
      {!loading && opportunities.length > 0 && (
        <div className="space-y-4">
          {opportunities.map(opp => <OpportunityCard key={opp.id} opp={opp} />)}
        </div>
      )}
    </div>
  );
} 