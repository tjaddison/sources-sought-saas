'use client'

import { useState } from 'react';
import Link from 'next/link';
import { demoOpportunities, Opportunity } from '@/lib/demo-data'; // Adjust path if needed

type Status = Opportunity['status'];

export default function PipelinePage() {
  // Use local state to manage status changes for the demo
  // Initialize with all demo opportunities for the pipeline view
  const [pipelineItems, setPipelineItems] = useState<Opportunity[]>(demoOpportunities);

  // Function to handle simulated status change
  const handleStatusChange = (id: string, newStatus: Status) => {
    setPipelineItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, status: newStatus } : item
      )
    );
    // In a real app, you'd likely call an API here to save the change
    console.log(`Demo: Changed status of ${id} to ${newStatus}`);
  };

  // Define possible statuses and their display colors for the demo
  const statusOptions: Status[] = ['New', 'Reviewing', 'Responding', 'Submitted', 'Archived'];
  const statusColors: Record<Status, string> = {
    New: 'bg-blue-100 text-blue-800 border-blue-300',
    Reviewing: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    Responding: 'bg-purple-100 text-purple-800 border-purple-300',
    Submitted: 'bg-green-100 text-green-800 border-green-300',
    Archived: 'bg-gray-100 text-gray-800 border-gray-300',
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Pipeline Management</h1>
      <p className="text-gray-700 mb-6">
        Track your Sources Sought opportunities through different stages. Status changes are temporary for this demo.
      </p>

      <div className="bg-white shadow-md overflow-hidden rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agency</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pipelineItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline">
                       {/* Link to analysis page */}
                       <Link href={`/analysis?oppId=${item.id}`}>{item.title}</Link>
                    </div>
                    <div className="text-xs text-gray-500">{item.noticeType}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700">{item.agency}</div>
                  </td>
                   <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700">{item.responseDate}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {/* Dropdown Select for Demo Status Change */}
                    <select
                      value={item.status}
                      onChange={(e) => handleStatusChange(item.id, e.target.value as Status)}
                      // Apply dynamic background/text color based on status
                      className={`text-xs font-medium px-2.5 py-1 rounded border cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors ${statusColors[item.status]}`}
                      aria-label={`Status for ${item.title}`}
                    >
                      {statusOptions.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {/* Links to other relevant demo pages */}
                    <Link href={`/analysis?oppId=${item.id}`} className="text-blue-600 hover:text-blue-900 hover:underline">Analyze</Link>
                    <Link href={`/response?oppId=${item.id}`} className="text-green-600 hover:text-green-900 hover:underline">Respond</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
         {pipelineItems.length === 0 && (
            <div className="text-center p-6 text-gray-500">No opportunities in the pipeline.</div>
         )}
      </div>
    </div>
  );
} 