import { NextRequest } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth-utils';
import { getDocumentsByType, deleteDocument } from '@/lib/dynamodb';
import { deleteFile } from '@/lib/s3';

export async function DELETE(req: NextRequest, { params }: { params: { type: string; id: string } }) {
  try {
    const user = await getAuthenticatedUser(req);
    
    if (!user) {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { type, id } = params;
    
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

    // Delete from S3
    await deleteFile(document.s3Key);

    // Delete from DynamoDB
    await deleteDocument(user.userId, id);

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error deleting document:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}