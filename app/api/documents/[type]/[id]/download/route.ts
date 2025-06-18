import { NextRequest } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth-utils';
import { getDocumentsByType } from '@/lib/dynamodb';
import { generateDownloadUrl } from '@/lib/s3';

export async function GET(req: NextRequest, { params }: { params: Promise<{ type: string; id: string }> }) {
  try {
    const user = await getAuthenticatedUser(req);
    
    if (!user) {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { type, id } = await params;
    
    if (!['capability', 'resume', 'proposal'].includes(type)) {
      return Response.json(
        { error: 'Invalid document type' },
        { status: 400 }
      );
    }

    // Get user's documents and find the requested one
    const documents = await getDocumentsByType(user.userId, type);
    const document = documents.find(doc => doc.documentId === id);

    if (!document) {
      return Response.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    // Generate download URL
    const downloadUrl = await generateDownloadUrl(document.s3Key);

    return Response.json({ downloadUrl });
  } catch (error) {
    console.error('Error generating download URL:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}