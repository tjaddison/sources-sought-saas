'use client'

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { demoOpportunities, demoResponseDrafts, Opportunity, ResponseDraft } from '@/lib/demo-data'; // Adjust path

export default function ResponsePage() {
  const searchParams = useSearchParams();
  const oppId = searchParams.get('oppId');
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [draft, setDraft] = useState<ResponseDraft | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false); // State for generation simulation

  useEffect(() => {
    // Initial load to find the opportunity
    const foundOpp = oppId ? demoOpportunities.find(o => o.id === oppId) : null;
    setOpportunity(foundOpp || null);
    setLoading(false);
    // Don't load draft immediately, wait for button click
  }, [oppId]);

  const handleGenerate = () => {
    setGenerating(true);
    setDraft(null); // Clear previous draft
    // Simulate generation time
    setTimeout(() => {
      if (oppId) {
        const foundDraft = demoResponseDrafts.find(d => d.opportunityId === oppId);
        setDraft(foundDraft || { opportunityId: oppId, outline: ['No draft available for this demo opportunity.'], capabilityStatement: 'N/A' });
      }
      setGenerating(false);
    }, 1500); // Simulate longer generation time
  };


  if (loading) {
    return <div className="text-center p-10">Loading...</div>;
  }

  if (!oppId || !opportunity) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Response Generation</h1>
        <p className="text-red-600 bg-red-100 p-4 rounded-md">
          No opportunity selected or found. Please select an opportunity from the{' '}
          <Link href="/matching" className="underline font-medium">Matching</Link> or{' '}
          <Link href="/pipeline" className="underline font-medium">Pipeline</Link> page first.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Response Generation: {opportunity.title}</h1>
      <p className="text-sm text-gray-600 mb-6">Agency: {opportunity.agency} | Due: {opportunity.responseDate}</p>

      <div className="bg-white p-6 rounded-lg shadow space-y-6">
        <div className="text-center">
          <button
            onClick={handleGenerate}
            disabled={generating}
            className={`bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors text-lg font-semibold ${generating ? 'opacity-50 cursor-wait' : ''}`}
          >
            {generating ? 'Generating Draft...' : 'Generate AI-Assisted Draft'}
          </button>
        </div>

        {generating && (
          <div className="text-center text-gray-600">
            Simulating AI response generation... please wait.
          </div>
        )}

        {draft && !generating && (
          <>
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-3 border-b pb-2">Generated Outline</h2>
              <ul className="list-decimal list-inside text-gray-700 space-y-1 pl-4">
                {draft.outline.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-3 border-b pb-2">Generated Capability Statement Snippet</h2>
              <textarea
                readOnly // Make it read-only for the demo
                value={draft.capabilityStatement}
                className="w-full h-40 p-2 border border-gray-300 rounded bg-gray-50 text-sm text-gray-800"
              />
              <p className="text-xs text-gray-500 mt-1">Note: This is a simulated output. Review and edit thoroughly.</p>
            </div>
             <div className="pt-4 border-t mt-6 flex justify-end space-x-3">
                <button className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors text-sm">Copy Text</button>
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors text-sm">Export Draft</button>
             </div>
          </>
        )}
      </div>
    </div>
  );
} 