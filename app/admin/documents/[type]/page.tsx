import { Auth0Client } from '@auth0/nextjs-auth0/server';
import { getDocumentsByType } from '@/lib/dynamodb';
import { redirect, notFound } from 'next/navigation';
import DocumentList from '@/components/admin/DocumentList';

const auth0 = new Auth0Client();

const VALID_TYPES = ['capability', 'resume', 'proposal'];
const TYPE_NAMES = {
  capability: 'Capability Statements',
  resume: 'Team Resumes',
  proposal: 'Past Proposals',
};

export default async function DocumentTypePage({ 
  params 
}: { 
  params: Promise<{ type: string }>
}) {
  const { type } = await params;
  
  if (!VALID_TYPES.includes(type)) {
    notFound();
  }

  const session = await auth0.getSession();
  
  if (!session?.user) {
    redirect('/auth/login');
  }

  const documents = await getDocumentsByType(session.user.sub, type);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {TYPE_NAMES[type as keyof typeof TYPE_NAMES]}
        </h1>
        <p className="mt-2 text-gray-600">
          Manage your {type} documents. Upload new files or manage existing ones.
        </p>
      </div>

      <DocumentList 
        documents={documents} 
        documentType={type as 'capability' | 'resume' | 'proposal'} 
      />
    </div>
  );
}