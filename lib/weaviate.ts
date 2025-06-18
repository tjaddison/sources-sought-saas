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
  sortBy: 'updated_date' | 'title_asc' | 'title_desc' | 'relevance' = 'updated_date',
  typeFilter?: string
): Promise<{ items: WeaviateSourcesSoughtItem[]; total: number }> {
  const client = await getWeaviateClient();
  const collectionName = process.env.WEAVIATE_INDEX_NAME || 'SamOopsWeaviateCluster';
  const collection = client.collections.get(collectionName);

  // Fetch all records to ensure we get the complete dataset
  const batchSize = 1000; // Weaviate's typical max batch size
  let allObjects: any[] = [];
  let currentOffset = 0;
  let hasMore = true;
  
  console.log('Starting to fetch all records from Weaviate...');
  
  // Fetch all records in batches
  while (hasMore) {
    let result;
    
    if (query && query.trim() !== '') {
      result = await collection.query.nearText(query, {
        limit: batchSize,
        offset: currentOffset,
        returnMetadata: ['distance'],
      });
    } else {
      result = await collection.query.fetchObjects({
        limit: batchSize,
        offset: currentOffset,
      });
    }
    
    // Log progress
    console.log(`Fetched batch: offset=${currentOffset}, count=${result.objects.length}`);
    
    // Log first object structure for debugging
    if (result.objects.length > 0 && currentOffset === 0) {
      console.log('Sample object structure:', JSON.stringify(result.objects[0], null, 2));
    }
    
    allObjects = allObjects.concat(result.objects);
    
    // Check if we have more records to fetch
    if (result.objects.length < batchSize) {
      hasMore = false;
    } else {
      currentOffset += batchSize;
    }
    
    // Safety check to prevent infinite loop (adjust based on expected total)
    if (currentOffset > 10000) {
      console.warn('Reached safety limit of 10000 records');
      break;
    }
  }
  
  console.log(`Total records fetched: ${allObjects.length}`);
  
  // Apply type filter if specified
  let filteredObjects = allObjects;
  if (typeFilter && typeFilter.trim() !== '') {
    filteredObjects = allObjects.filter((obj: any) => 
      obj.properties?.type === typeFilter
    );
    console.log(`Records after filtering for type "${typeFilter}": ${filteredObjects.length}`);
  } else {
    console.log(`Total records available (no type filter): ${filteredObjects.length}`);
  }
  
  // Apply sorting if needed (for now, just use the order from Weaviate)
  // TODO: Implement sorting based on sortBy parameter
  
  // Apply pagination to the filtered results
  const paginatedObjects = filteredObjects.slice(offset, offset + limit);
  
  // Transform the objects to match our expected structure
  const items = paginatedObjects.map((obj: any) => ({
    _additional: {
      id: obj.uuid || '',
      creationTimeUnix: obj.properties?.posted_date || '',
      lastUpdateTimeUnix: obj.properties?.posted_date || '',
      distance: obj._additional?.distance,
    },
    ...obj.properties,
  }));

  return {
    items: items as WeaviateSourcesSoughtItem[],
    total: filteredObjects.length,
  };
}

export async function getSourcesSoughtById(noticeId: string): Promise<WeaviateSourcesSoughtItem | null> {
  const client = await getWeaviateClient();
  const collectionName = process.env.WEAVIATE_INDEX_NAME || 'SamOopsWeaviateCluster';
  const collection = client.collections.get(collectionName);

  // Fetch a batch of records and filter in memory
  const result = await collection.query.fetchObjects({
    limit: 1000,
  });

  // Filter by notice_id only
  const filteredObjects = result.objects.filter((obj: any) => 
    obj.properties?.notice_id === noticeId
  );

  if (filteredObjects.length === 0) {
    return null;
  }

  const obj = filteredObjects[0];
  
  // Transform the object to match our expected structure
  return {
    _additional: {
      id: obj.uuid || '',
      creationTimeUnix: obj.properties?.posted_date || '',
      lastUpdateTimeUnix: obj.properties?.posted_date || '',
    },
    ...obj.properties,
  } as WeaviateSourcesSoughtItem;
}

