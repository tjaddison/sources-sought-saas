import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/auth-utils';
import { getIndexingJobHistory } from '@/lib/dynamodb';

// Use Node.js runtime for AWS SDK compatibility
export const runtime = 'nodejs';

export const GET = requireAuth(async (req: NextRequest, user) => {
  try {
    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get('jobId');
    
    const jobs = await getIndexingJobHistory(user.userId);
    
    if (jobId) {
      const specificJob = jobs.find(job => job.jobId === jobId);
      return Response.json({ job: specificJob || null });
    }
    
    const latestJob = jobs.length > 0 ? jobs[0] : null;
    
    return Response.json({ 
      latestJob,
      hasJobs: jobs.length > 0,
      history: jobs
    });
  } catch (error) {
    console.error('Error getting indexing status:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});