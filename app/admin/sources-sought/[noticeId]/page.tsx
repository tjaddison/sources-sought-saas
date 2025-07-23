import { notFound } from 'next/navigation';
import OpportunityDetailContent from './opportunity-detail-content';
import { getSourcesSoughtById } from '@/lib/sam-ops-dynamodb';

interface SourcesSoughtDetail {
  _additional: {
    id: string;
    creationTimeUnix: string;
    lastUpdateTimeUnix: string;
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

async function getSourcesSought(noticeId: string): Promise<SourcesSoughtDetail | null> {
  try {
    // Use absolute URL for server-side fetch
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
    
    const url = `${baseUrl}/api/sources-sought/${noticeId}`;
    console.log('Fetching from URL:', url);
    
    const response = await fetch(url, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      console.error('API response not ok:', response.status, response.statusText);
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching sources sought:', error);
    return null;
  }
}

export default async function SourcesSoughtDetailPage({
  params,
}: {
  params: Promise<{ noticeId: string }>;
}) {
  const { noticeId } = await params;
  
  console.log('SourcesSoughtDetailPage - noticeId:', noticeId);
  
  // Try direct database call first
  let data = null;
  try {
    data = await getSourcesSoughtById(noticeId);
    console.log('Direct DB call result:', data ? 'Found' : 'Not found');
  } catch (dbError) {
    console.error('Direct DB call failed:', dbError);
    // Fall back to API call
    data = await getSourcesSought(noticeId);
  }
  
  if (!data) {
    console.log('No data found for noticeId:', noticeId);
    notFound();
  }

  return <OpportunityDetailContent data={data} />;
}