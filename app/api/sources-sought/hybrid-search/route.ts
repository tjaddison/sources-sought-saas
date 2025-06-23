import { NextRequest, NextResponse } from 'next/server';
import { hybridSearchWithUserProfile } from '@/lib/weaviate';
import { getUserProfile } from '@/lib/dynamodb';
import { auth0 } from '@/lib/auth0';

export async function GET(request: NextRequest) {
  try {
    // Get user session
    const session = await auth0.getSession();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get search parameters
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '25', 10);
    const type = searchParams.get('type') || '';
    const alpha = parseFloat(searchParams.get('alpha') || '0.5');

    if (page < 1 || pageSize < 1 || pageSize > 100) {
      return NextResponse.json(
        { error: 'Invalid pagination parameters' },
        { status: 400 }
      );
    }

    if (alpha < 0 || alpha > 1) {
      return NextResponse.json(
        { error: 'Alpha must be between 0 and 1' },
        { status: 400 }
      );
    }

    // Get user profile with embedding
    const userProfile = await getUserProfile(session.user.sub);
    
    if (!userProfile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      );
    }

    if (!userProfile.embedding || !Array.isArray(userProfile.embedding)) {
      return NextResponse.json(
        { error: 'User profile has not been indexed. Please complete content indexing first.' },
        { status: 400 }
      );
    }

    const offset = (page - 1) * pageSize;
    
    // Perform hybrid search with user embedding
    const { items, total } = await hybridSearchWithUserProfile(
      userProfile.embedding,
      query,
      pageSize,
      offset,
      type,
      alpha
    );

    // Log search metrics
    console.log('Hybrid search performed:', {
      userId: session.user.sub,
      query,
      type,
      alpha,
      totalResults: total,
      pageSize,
      page,
      embeddingModel: userProfile.embeddingModel,
      lastIndexedAt: userProfile.lastIndexedAt,
      documentsIncluded: userProfile.documentsIncluded,
    });

    return NextResponse.json({
      items,
      total,
      page,
      pageSize,
      searchMode: 'hybrid',
      alpha,
      userProfile: {
        lastIndexedAt: userProfile.lastIndexedAt,
        documentsIncluded: userProfile.documentsIncluded,
        embeddingModel: userProfile.embeddingModel,
        companyDescription: userProfile.companyDescription,
      },
    });
  } catch (error) {
    console.error('Error in hybrid search:', error);
    return NextResponse.json(
      { error: 'Failed to perform hybrid search' },
      { status: 500 }
    );
  }
}