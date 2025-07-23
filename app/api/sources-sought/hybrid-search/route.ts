import { NextRequest, NextResponse } from 'next/server';
import { searchSourcesSought } from '@/lib/sam-ops-dynamodb';
import { auth0 } from '@/lib/auth0';

// Use Node.js runtime for AWS SDK compatibility
export const runtime = 'nodejs';

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
    const sortBy = searchParams.get('sort') || 'updated_date';
    const type = searchParams.get('type') || '';

    if (page < 1 || pageSize < 1 || pageSize > 100) {
      return NextResponse.json(
        { error: 'Invalid pagination parameters' },
        { status: 400 }
      );
    }

    const validSortOptions = ['updated_date', 'title_asc', 'title_desc', 'relevance'];
    if (!validSortOptions.includes(sortBy)) {
      return NextResponse.json(
        { error: 'Invalid sort option' },
        { status: 400 }
      );
    }

    const offset = (page - 1) * pageSize;
    
    // Perform regular search with DynamoDB
    const { items, total } = await searchSourcesSought(
      query,
      pageSize,
      offset,
      sortBy as 'updated_date' | 'title_asc' | 'title_desc' | 'relevance',
      type
    );

    // Log search metrics
    console.log('Search performed:', {
      userId: session.user.sub,
      query,
      type,
      sortBy,
      totalResults: total,
      pageSize,
      page,
    });

    return NextResponse.json({
      items,
      total,
      page,
      pageSize,
      searchMode: 'text',
    });
  } catch (error) {
    console.error('Error in search:', error);
    return NextResponse.json(
      { error: 'Failed to perform search' },
      { status: 500 }
    );
  }
}