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
    score?: number;
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
  matchPercentage?: number;
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
  
  // Apply sorting if needed
  // Note: sortBy parameter is preserved for API compatibility but not implemented yet
  // TODO: Implement sorting based on sortBy parameter when Weaviate supports it
  
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

export async function hybridSearchWithUserProfile(
  userEmbedding: number[],
  query: string,
  limit: number = 25,
  offset: number = 0,
  typeFilter?: string,
  alpha: number = 0.5 // Balance between vector (0) and keyword (1) search
): Promise<{ items: WeaviateSourcesSoughtItem[]; total: number }> {
  const client = await getWeaviateClient();
  const collectionName = process.env.WEAVIATE_INDEX_NAME || 'SamOopsWeaviateCluster';
  const collection = client.collections.get(collectionName);

  // Fetch all records to ensure we get the complete dataset
  const batchSize = 1000;
  let allObjects: any[] = [];
  let currentOffset = 0;
  let hasMore = true;
  
  console.log('Starting hybrid search with user profile...');
  
  // Fetch all records in batches
  while (hasMore) {
    let result;
    
    // Use hybrid search combining vector similarity with keyword search
    if (query && query.trim() !== '') {
      // Hybrid search with both user embedding and query
      result = await collection.query.hybrid(query, {
        limit: batchSize,
        offset: currentOffset,
        vector: userEmbedding,
        alpha: alpha, // Balance between vector and keyword search
        returnMetadata: ['score', 'explainScore'],
      });
    } else {
      // Pure vector search with user embedding
      result = await collection.query.nearVector(userEmbedding, {
        limit: batchSize,
        offset: currentOffset,
        returnMetadata: ['distance', 'certainty'],
      });
    }
    
    // Log progress
    console.log(`Fetched batch: offset=${currentOffset}, count=${result.objects.length}`);
    
    allObjects = allObjects.concat(result.objects);
    
    // Check if we have more records to fetch
    if (result.objects.length < batchSize) {
      hasMore = false;
    } else {
      currentOffset += batchSize;
    }
    
    // Safety check
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
  }
  
  // Sort by score/distance (best matches first)
  filteredObjects.sort((a: any, b: any) => {
    const scoreA = a._additional?.score || (1 - (a._additional?.distance || 1));
    const scoreB = b._additional?.score || (1 - (b._additional?.distance || 1));
    return scoreB - scoreA;
  });
  
  // Apply pagination
  const paginatedObjects = filteredObjects.slice(offset, offset + limit);
  
  // Transform objects and calculate match percentage
  const items = paginatedObjects.map((obj: any) => {
    // Calculate match percentage based on score or distance
    let matchPercentage = 0;
    if (obj._additional?.score !== undefined) {
      // Hybrid search returns a score between 0 and 1
      matchPercentage = Math.round(obj._additional.score * 100);
    } else if (obj._additional?.distance !== undefined) {
      // Vector search returns distance (lower is better)
      // Convert distance to similarity percentage
      // Assuming distance range is typically 0-2
      matchPercentage = Math.round(Math.max(0, (1 - obj._additional.distance / 2)) * 100);
    } else if (obj._additional?.certainty !== undefined) {
      // Some Weaviate versions return certainty
      matchPercentage = Math.round(obj._additional.certainty * 100);
    }
    
    return {
      _additional: {
        id: obj.uuid || '',
        creationTimeUnix: obj.properties?.posted_date || '',
        lastUpdateTimeUnix: obj.properties?.posted_date || '',
        distance: obj._additional?.distance,
        score: obj._additional?.score,
      },
      ...obj.properties,
      matchPercentage,
    };
  });

  return {
    items: items as WeaviateSourcesSoughtItem[],
    total: filteredObjects.length,
  };
}

