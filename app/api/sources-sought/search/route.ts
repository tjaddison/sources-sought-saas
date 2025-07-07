import { NextRequest, NextResponse } from 'next/server';
import { searchSourcesSought } from '@/lib/weaviate';

export async function GET(request: NextRequest) {
  try {
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
    const { items, total } = await searchSourcesSought(
      query,
      pageSize,
      offset,
      sortBy as 'updated_date' | 'title_asc' | 'title_desc' | 'relevance',
      type
    );

    // Log first item structure for debugging
    if (items.length > 0) {
      console.log('First item structure:', JSON.stringify(items[0], null, 2));
    }

    return NextResponse.json({
      items,
      total,
      page,
      pageSize,
    });
  } catch (error) {
    console.error('Error searching sources sought:', error);
    return NextResponse.json(
      { error: 'Failed to search sources sought opportunities' },
      { status: 500 }
    );
  }
}