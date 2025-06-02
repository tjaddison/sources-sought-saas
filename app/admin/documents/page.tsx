import { Auth0Client } from '@auth0/nextjs-auth0/server';
import { getDocumentsByType } from '@/lib/dynamodb';
import { redirect } from 'next/navigation';
import DocumentsOverview from '@/components/admin/DocumentsOverview';

const auth0 = new Auth0Client();

export default async function DocumentsPage() {
  const session = await auth0.getSession();
  
  if (!session?.user) {
    redirect('/auth/login');
  }

  // Get all document types
  const [capabilities, resumes, proposals] = await Promise.all([
    getDocumentsByType(session.user.sub, 'capability'),
    getDocumentsByType(session.user.sub, 'resume'),
    getDocumentsByType(session.user.sub, 'proposal'),
  ]);

  const documentCounts = {
    capability: capabilities.length,
    resume: resumes.length,
    proposal: proposals.length,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Document Management</h1>
        <p className="mt-2 text-gray-600">
          Upload, view, and manage your capability statements, resumes, and proposals.
        </p>
      </div>

      <DocumentsOverview documentCounts={documentCounts} />
    </div>
  );
}