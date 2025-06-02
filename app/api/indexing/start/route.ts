import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/auth-utils';
import { createIndexingJob } from '@/lib/dynamodb';
import { v4 as uuidv4 } from 'uuid';

export const POST = requireAuth(async (req: NextRequest, user) => {
  try {
    const jobId = uuidv4();
    
    const job = await createIndexingJob({
      userId: user.userId,
      jobId,
      status: 'pending',
      startedAt: new Date().toISOString(),
    });

    // TODO: Trigger background job processing (Lambda function, queue, etc.)
    // For now, we'll just create the job record
    
    return Response.json({ job });
  } catch (error) {
    console.error('Error starting indexing job:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});