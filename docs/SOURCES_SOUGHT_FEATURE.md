# Sources Sought Feature Documentation

## Overview
The Sources Sought feature provides a comprehensive search interface for browsing and searching government contracting opportunities from SAM.gov stored in Weaviate vector database.

## Features

### 1. Search Page (`/admin/sources-sought`)
- **Full-text search**: Semantic search using Weaviate's nearText capabilities
- **Pagination**: Options for 10, 25, or 50 items per page
- **Sorting options**:
  - Updated Date (default)
  - Notice Title (A-Z)
  - Notice Title (Z-A)
  - Relevance (when searching)
- **Real-time search**: Debounced search that updates results as you type
- **Responsive design**: Works on desktop and mobile devices

### 2. Detail Page (`/admin/sources-sought/[noticeId]`)
- **Complete opportunity details** including:
  - Title and Notice ID
  - Response deadline with formatted date/time
  - Posted and last updated dates
  - Agency information and location
  - NAICS and classification codes
  - Full description
- **Actions**:
  - Contact Opportunities button
  - View on SAM.gov link (opens in new tab)
- **Status indicators**: Shows if opportunity is archived or cancelled

## Technical Implementation

### Frontend Components
- **Search Page**: `/app/admin/sources-sought/page.tsx`
  - Client component with search, pagination, and sorting
  - Uses URL search params for state management
  - Implements debounced search for performance

- **Detail Page**: `/app/admin/sources-sought/[noticeId]/page.tsx`
  - Server component for better SEO and performance
  - Fetches individual opportunity details

### API Endpoints
- **Search API**: `/api/sources-sought/search`
  - GET endpoint with query parameters:
    - `q`: Search query
    - `page`: Page number (default: 1)
    - `pageSize`: Items per page (default: 25, max: 100)
    - `sort`: Sort option (updated_date, title_asc, title_desc, relevance)

- **Detail API**: `/api/sources-sought/[noticeId]`
  - GET endpoint to fetch single opportunity by notice ID

### Weaviate Integration
- **Client**: `/lib/weaviate.ts`
  - Singleton pattern for connection reuse
  - Supports both semantic search and regular fetching
  - Handles pagination and sorting
  - Configured via environment variables

### Data Model
```typescript
interface SourcesSoughtItem {
  _additional: {
    id: string;
    creationTimeUnix: string;
    lastUpdateTimeUnix: string;
    distance?: number; // For relevance in search
  };
  content: string;
  notice_id: string;
  title: string;
  posted_date: string;
  response_deadline: string;
  naics_code?: string;
  classification_code?: string;
  agency_name: string;
  agency_city?: string;
  agency_state?: string;
  agency_country?: string;
  type: string;
  solicitationNumber?: string;
  fullParentPathName?: string;
  archived?: boolean;
  cancelled?: boolean;
}
```

## Environment Configuration

Add these variables to your `.env.local`:

```env
# Weaviate Configuration
WEAVIATE_URL=your-weaviate-cluster-url
WEAVIATE_API_KEY=your-weaviate-api-key
WEAVIATE_INDEX_NAME=SamOopsWeaviateCluster
OPENAI_API_KEY=your-openai-api-key

# App URL for API calls
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Dependencies Added
- `weaviate-client`: TypeScript client for Weaviate
- `date-fns`: Date formatting utilities
- `lodash`: Utility functions (used for debounce)
- `@types/lodash`: TypeScript types for lodash

## Navigation
The Sources Sought section is accessible from the admin panel sidebar, added to the navigation menu with a DocumentMagnifyingGlassIcon.

## Future Enhancements
1. **Advanced Filters**: Add filters for agency, NAICS codes, date ranges
2. **Saved Searches**: Allow users to save and manage search queries
3. **Export Functionality**: Export search results to CSV/Excel
4. **Email Alerts**: Set up alerts for new opportunities matching criteria
5. **Batch Operations**: Select multiple opportunities for bulk actions
6. **Analytics**: Track search patterns and popular opportunities