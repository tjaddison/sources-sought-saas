import { NextRequest, NextResponse } from 'next/server';
import { getSourcesSoughtById } from '@/lib/weaviate';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ noticeId: string }> }
) {
  try {
    const { noticeId } = await params;
    
    if (!noticeId) {
      return NextResponse.json(
        { error: 'Notice ID is required' },
        { status: 400 }
      );
    }

    const result = await getSourcesSoughtById(noticeId);
    
    if (!result) {
      return NextResponse.json(
        { error: 'Sources sought opportunity not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching sources sought:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sources sought opportunity' },
      { status: 500 }
    );
  }
}