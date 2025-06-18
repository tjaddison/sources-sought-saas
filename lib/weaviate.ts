import weaviate, { WeaviateClient, ApiKey } from 'weaviate-client';

let client: WeaviateClient | null = null;

export async function getWeaviateClient(): Promise<WeaviateClient> {
  if (client) {
    return client;
  }

  const weaviateUrl = process.env.WEAVIATE_URL;
  const weaviateApiKey = process.env.WEAVIATE_API_KEY;

  if (!weaviateUrl || !weaviateApiKey) {
    throw new Error('Weaviate configuration missing. Please set WEAVIATE_URL and WEAVIATE_API_KEY environment variables.');
  }

  client = await weaviate.connectToWeaviateCloud(weaviateUrl, {
    authCredentials: new ApiKey(weaviateApiKey),
    headers: {
      'X-OpenAI-Api-Key': process.env.OPENAI_API_KEY || '',
    },
  });

  return client;
}

export interface WeaviateSourcesSoughtItem {
  _additional: {
    id: string;
    creationTimeUnix: string;
    lastUpdateTimeUnix: string;
    distance?: number;
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

export async function searchSourcesSought(
  query: string,
  limit: number = 25,
  offset: number = 0,
  sortBy: 'updated_date' | 'title_asc' | 'title_desc' | 'relevance' = 'updated_date'
): Promise<{ items: WeaviateSourcesSoughtItem[]; total: number }> {
  const client = await getWeaviateClient();
  const collectionName = process.env.WEAVIATE_INDEX_NAME || 'SamOopsWeaviateCluster';
  const collection = client.collections.get(collectionName);

  let result;
  const sortField = getSortField(sortBy);

  if (query && query.trim() !== '') {
    const nearTextQuery = collection.query.nearText(query, {
      limit,
      offset,
      returnMetadata: ['distance'],
    });

    if (sortField && sortBy !== 'relevance') {
      result = await nearTextQuery;
    } else {
      result = await nearTextQuery;
    }
  } else {
    const fetchQuery = collection.query.fetchObjects({
      limit,
      offset,
    });

    result = await fetchQuery;
  }
  
  let totalCount = 0;
  try {
    if (query && query.trim() !== '') {
      const aggregateResult = await collection.aggregate.nearText(query);
      totalCount = aggregateResult.totalCount || 0;
    } else {
      const aggregateResult = await collection.aggregate.overAll();
      totalCount = aggregateResult.totalCount || 0;
    }
  } catch (error) {
    console.error('Error getting count:', error);
    totalCount = result.objects.length;
  }

  // Transform the objects to match our expected structure
  const items = result.objects.map((obj: any) => ({
    _additional: {
      id: obj.uuid || obj._additional?.id || '',
      creationTimeUnix: obj._additional?.creationTimeUnix || obj.properties?.posted_date || '',
      lastUpdateTimeUnix: obj._additional?.lastUpdateTimeUnix || obj.properties?.posted_date || '',
      distance: obj._additional?.distance,
    },
    ...obj.properties,
  }));

  return {
    items: items as WeaviateSourcesSoughtItem[],
    total: totalCount,
  };
}

export async function getSourcesSoughtById(noticeId: string): Promise<WeaviateSourcesSoughtItem | null> {
  const client = await getWeaviateClient();
  const collectionName = process.env.WEAVIATE_INDEX_NAME || 'SamOopsWeaviateCluster';
  const collection = client.collections.get(collectionName);

  const result = await collection.query.fetchObjects({
    limit: 1,
  });

  // Filter in memory for now - will update when we have proper filter syntax
  const filteredObjects = result.objects.filter((obj: any) => obj.properties.notice_id === noticeId);

  if (filteredObjects.length === 0) {
    return null;
  }

  const obj = filteredObjects[0];
  
  // Transform the object to match our expected structure
  return {
    _additional: {
      id: obj.uuid || obj._additional?.id || '',
      creationTimeUnix: obj._additional?.creationTimeUnix || obj.properties?.posted_date || '',
      lastUpdateTimeUnix: obj._additional?.lastUpdateTimeUnix || obj.properties?.posted_date || '',
    },
    ...obj.properties,
  } as WeaviateSourcesSoughtItem;
}

function getSortField(sortBy: string): { field: string; order: 'asc' | 'desc' } | null {
  switch (sortBy) {
    case 'updated_date':
      return { field: '_lastUpdateTimeUnix', order: 'desc' };
    case 'title_asc':
      return { field: 'title', order: 'asc' };
    case 'title_desc':
      return { field: 'title', order: 'desc' };
    case 'relevance':
      return null;
    default:
      return { field: '_lastUpdateTimeUnix', order: 'desc' };
  }
}