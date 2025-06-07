import { NextRequest } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth-utils';
import { getDocumentsByType } from '@/lib/dynamodb';

export async function GET(req: NextRequest, { params }: { params: Promise<{ type: string }> }) {
  try {
    const user = await getAuthenticatedUser(req);
    
    if (!user) {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { type } = await params;
    
    if (!['capability', 'resume', 'proposal'].includes(type)) {
      return Response.json(
        { error: 'Invalid document type' },
        { status: 400 }
      );
    }

    const documents = await getDocumentsByType(user.userId, type);
    
    return Response.json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}