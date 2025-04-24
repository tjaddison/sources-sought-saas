'use client'

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { demoOpportunities, demoAnalysisResults, Opportunity, AnalysisResult } from '@/lib/demo-data'; // Adjust path

export default function AnalysisPage() {
  const searchParams = useSearchParams();
  const oppId = searchParams.get('oppId');
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Simulate fetching data
    setTimeout(() => {
      if (oppId) {
        const foundOpp = demoOpportunities.find(o => o.id === oppId);
        const foundAnalysis = demoAnalysisResults.find(a => a.opportunityId === oppId);
        setOpportunity(foundOpp || null);
        setAnalysis(foundAnalysis || null); // Use found analysis or null if none exists for demo
      } else {
        setOpportunity(null);
        setAnalysis(null);
      }
      setLoading(false);
    }, 800); // Simulate analysis time
  }, [oppId]);

  if (loading) {
    return <div className="text-center p-10">Analyzing opportunity...</div>;
  }

  if (!oppId || !opportunity) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Analysis Result</h1>
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
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Analysis: {opportunity.title}</h1>
      <p className="text-sm text-gray-600 mb-6">Agency: {opportunity.agency} | Due: {opportunity.responseDate}</p>

      {analysis ? (
        <div className="bg-white p-6 rounded-lg shadow space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-3 border-b pb-2">AI Summary</h2>
            <p className="text-gray-700">{analysis.summary}</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-3 border-b pb-2">Key Requirements</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {analysis.keyRequirements.map((req, i) => <li key={i}>{req}</li>)}
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-3 border-b pb-2">Evaluation Criteria</h2>
             <ul className="list-disc list-inside text-gray-700 space-y-1">
              {analysis.evaluationCriteria.map((crit, i) => <li key={i}>{crit}</li>)}
            </ul>
          </div>

           <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-3 border-b pb-2">Potential Competitors (Simulated)</h2>
             <ul className="list-disc list-inside text-gray-700 space-y-1">
              {analysis.potentialCompetitors.map((comp, i) => <li key={i}>{comp}</li>)}
            </ul>
          </div>

           <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-3 border-b pb-2">Agency Contacts</h2>
             <ul className="list-none text-gray-700 space-y-1">
              {analysis.contacts.map((contact, i) => (
                <li key={i}>
                  <strong>{contact.name}</strong> - {contact.email} {contact.phone && `(${contact.phone})`}
                </li>
              ))}
            </ul>
          </div>

           <div className="pt-4 border-t mt-6 flex justify-end">
             <Link href={`/response?oppId=${oppId}`} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
               Draft Response
             </Link>
           </div>

        </div>
      ) : (
         <p className="text-gray-600 bg-yellow-100 p-4 rounded-md">
           No detailed analysis available for this demo opportunity.
         </p>
      )}
    </div>
  );
} 