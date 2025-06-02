import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/auth-utils';
import { getIndexingJobHistory } from '@/lib/dynamodb';

export const GET = requireAuth(async (req: NextRequest, user) => {
  try {
    const jobs = await getIndexingJobHistory(user.userId);
    
    return Response.json(jobs);
  } catch (error) {
    console.error('Error getting indexing history:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});