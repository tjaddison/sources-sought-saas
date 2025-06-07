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

    // In a production environment, you would trigger this via:
    // - AWS Lambda with SQS/SNS
    // - Background job queue (Bull, Bee-Queue, etc.)
    // - Serverless function with a queue
    
    // For development, we'll process it directly (with a small delay to simulate async)
    if (process.env.NODE_ENV === 'development') {
      // Process job asynchronously
      setTimeout(async () => {
        try {
          const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
          await fetch(`${baseUrl}/api/indexing/process`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: user.userId,
              jobId,
            }),
          });
        } catch (error) {
          console.error('Failed to trigger indexing process:', error);
        }
      }, 1000);
    }
    
    return Response.json({ job });
  } catch (error) {
    console.error('Error starting indexing job:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});