import { Auth0Client } from '@auth0/nextjs-auth0/server';
import { getIndexingJobHistory, getDocumentsByType } from '@/lib/dynamodb';
import { redirect } from 'next/navigation';
import ContentIndexingDashboard from '@/components/admin/ContentIndexingDashboard';

const auth0 = new Auth0Client();

export default async function ContentIndexingPage() {
  const session = await auth0.getSession();
  
  if (!session?.user) {
    redirect('/auth/login');
  }

  // Get indexing job history
  const indexingHistory = await getIndexingJobHistory(session.user.sub);
  
  // Get document counts for each type
  const [capabilities, resumes, proposals] = await Promise.all([
    getDocumentsByType(session.user.sub, 'capability'),
    getDocumentsByType(session.user.sub, 'resume'),
    getDocumentsByType(session.user.sub, 'proposal'),
  ]);

  const documentCounts = {
    capability: capabilities.length,
    resume: resumes.length,
    proposal: proposals.length,
    total: capabilities.length + resumes.length + proposals.length,
  };

  const indexedCounts = {
    capability: capabilities.filter(doc => doc.indexed).length,
    resume: resumes.filter(doc => doc.indexed).length,
    proposal: proposals.filter(doc => doc.indexed).length,
    total: [...capabilities, ...resumes, ...proposals].filter(doc => doc.indexed).length,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Content Indexing</h1>
        <p className="mt-2 text-gray-600">
          Process your documents to enable better opportunity matching and searchability.
        </p>
      </div>

      <ContentIndexingDashboard
        indexingHistory={indexingHistory}
        documentCounts={documentCounts}
        indexedCounts={indexedCounts}
      />
    </div>
  );
}