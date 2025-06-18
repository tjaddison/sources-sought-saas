import { redirect, notFound } from 'next/navigation';
import { Auth0Client } from '@auth0/nextjs-auth0/server';
import DocumentUploadForm from '@/components/admin/DocumentUploadForm';

const auth0 = new Auth0Client();

const VALID_TYPES = ['capability', 'resume', 'proposal'];
const TYPE_NAMES = {
  capability: 'Capability Statements',
  resume: 'Team Resumes',
  proposal: 'Past Proposals',
};

export default async function DocumentUploadPage({ 
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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Upload {TYPE_NAMES[type as keyof typeof TYPE_NAMES]}
        </h1>
        <p className="mt-2 text-gray-600">
          Upload new documents to enhance your profile and improve opportunity matching.
        </p>
      </div>

      <DocumentUploadForm 
        documentType={type as 'capability' | 'resume' | 'proposal'} 
      />
    </div>
  );
}