import { NextRequest } from 'next/server';
import { processIndexingJob } from '@/lib/indexing-processor';

// This endpoint can be called by a background job processor (e.g., AWS Lambda, cron job, etc.)
// In a production environment, you would secure this endpoint appropriately
export async function POST(req: NextRequest) {
  try {
    const { userId, jobId } = await req.json();

    if (!userId || !jobId) {
      return Response.json(
        { error: 'Missing userId or jobId' },
        { status: 400 }
      );
    }

    // Process the indexing job
    await processIndexingJob(userId, jobId);

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error processing indexing job:', error);
    return Response.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}