import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/auth-utils';
import { getIndexingJobHistory } from '@/lib/dynamodb';

export const GET = requireAuth(async (req: NextRequest, user) => {
  try {
    const jobs = await getIndexingJobHistory(user.userId);
    const latestJob = jobs.length > 0 ? jobs[0] : null;
    
    return Response.json({ 
      latestJob,
      hasJobs: jobs.length > 0 
    });
  } catch (error) {
    console.error('Error getting indexing status:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});