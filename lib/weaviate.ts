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
    certainty?: number;
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
  let isFallbackSearch = false;
  
  console.log('Starting hybrid search with user profile...');
  console.log('User embedding length:', userEmbedding.length);
  
  // Fetch all records in batches
  while (hasMore) {
    let result;
    
    try {
      // Now that Weaviate has vectors, use hybrid search
      console.log('Performing hybrid search with vector embeddings');
      
      if (query && query.trim() !== '') {
        // Hybrid search combining vector similarity and BM25
        console.log('Performing hybrid search with query:', query);
        result = await collection.query.hybrid(query, {
          limit: batchSize,
          offset: currentOffset,
          vector: userEmbedding,
          alpha: alpha, // Balance between vector (0) and keyword (1) search
          returnMetadata: ['score', 'explainScore', 'distance'],
        });
      } else {
        // Pure vector search with user embedding
        console.log('Performing pure vector search');
        console.log('Vector dimensions:', userEmbedding.length);
        // Note: nearVector doesn't support offset, we'll handle pagination later
        result = await collection.query.nearVector(userEmbedding, {
          limit: Math.min(batchSize * 10, 10000), // Get more results to handle pagination
          returnMetadata: ['distance', 'certainty'],
        });
      }
      console.log('Vector search result objects count:', result.objects?.length || 0);
    } catch (error) {
      console.error('Error in vector search - full details:', error);
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        
        // Check if it's a dimension mismatch error
        if (error.message && error.message.includes('dimension')) {
          console.error('Vector dimension mismatch detected!');
          console.error('User embedding dimensions:', userEmbedding.length);
        }
      }
      
      // Fallback to regular fetch if vector search fails
      console.log('Falling back to regular fetch due to vector search error');
      result = await collection.query.fetchObjects({
        limit: batchSize,
        offset: currentOffset,
      });
    }
    
    // Log progress
    console.log(`Fetched batch: offset=${currentOffset}, count=${result.objects.length}`);
    
    allObjects = allObjects.concat(result.objects);
    
    // For vector search, we get all results in one query, so stop after first batch
    if (!query || query.trim() === '') {
      hasMore = false;
    } else {
      // For hybrid search with offset support, continue pagination
      if (result.objects.length < batchSize) {
        hasMore = false;
      } else {
        currentOffset += batchSize;
      }
    }
    
    // Safety check
    if (currentOffset > 10000) {
      console.warn('Reached safety limit of 10000 records');
      break;
    }
  }
  
  console.log(`Total records fetched: ${allObjects.length}`);
  
  // If vector search returned no results, fall back to BM25 search
  if (allObjects.length === 0 && (!query || query.trim() === '')) {
    console.log('Vector search returned 0 results, falling back to BM25 search...');
    isFallbackSearch = true;
    
    // Extract keywords from user profile if available
    let searchQuery = 'government contracting opportunity sources sought';
    
    try {
      const result = await collection.query.bm25(searchQuery, {
        limit: limit + offset,
        returnMetadata: ['score'],
      });
      allObjects = result.objects;
      console.log(`BM25 search returned: ${allObjects.length} objects`);
    } catch (error) {
      console.error('BM25 search also failed:', error);
    }
  }
  
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
    // Check both metadata and _additional for compatibility
    const metaA = a.metadata || a._additional || {};
    const metaB = b.metadata || b._additional || {};
    
    const scoreA = metaA.score || (1 - (metaA.distance || 1));
    const scoreB = metaB.score || (1 - (metaB.distance || 1));
    return scoreB - scoreA;
  });
  
  // Apply pagination
  const paginatedObjects = filteredObjects.slice(offset, offset + limit);
  
  // Transform objects and calculate match percentage
  const items = paginatedObjects.map((obj: any) => {
    let matchPercentage = 0;
    
    // Log the first few objects to debug
    if (paginatedObjects.indexOf(obj) < 3) {
      console.log('Object metadata:', obj.metadata);
      console.log('Object _additional:', obj._additional);
    }
    
    // Calculate match percentage based on different scoring methods
    // Check both metadata and _additional for compatibility
    const metadata = obj.metadata || obj._additional || {};
    
    if (isFallbackSearch) {
      // For fallback BM25 search, assign a default match percentage
      // BM25 scores can vary widely, so we'll use a simple mapping
      if (metadata.score !== undefined && metadata.score > 0) {
        // BM25 scores typically range from 0 to ~10+
        // Map to percentage: score of 1 = 40%, score of 3 = 60%, score of 5+ = 80%
        const bm25Score = metadata.score;
        if (bm25Score >= 5) matchPercentage = 80;
        else if (bm25Score >= 3) matchPercentage = 60;
        else if (bm25Score >= 1) matchPercentage = 40;
        else matchPercentage = 20;
      } else {
        // Default match for BM25 results without score
        matchPercentage = 30;
      }
    } else if (metadata.score !== undefined) {
      // Hybrid search returns a score between 0 and 1
      matchPercentage = Math.round(metadata.score * 100);
    } else if (metadata.distance !== undefined) {
      // Vector search returns cosine distance
      // Cosine distance range: 0 (identical) to 2 (opposite)
      // Convert to similarity: 1 - (distance / 2)
      const similarity = 1 - (metadata.distance / 2);
      matchPercentage = Math.round(Math.max(0, similarity * 100));
      
      console.log(`Distance: ${metadata.distance}, Similarity: ${similarity}, Match: ${matchPercentage}%`);
    } else if (metadata.certainty !== undefined) {
      // Some Weaviate versions return certainty (-1 to 1)
      // Convert to 0-100 scale
      const normalizedCertainty = (metadata.certainty + 1) / 2;
      matchPercentage = Math.round(normalizedCertainty * 100);
    }
    
    return {
      _additional: {
        id: obj.uuid || '',
        creationTimeUnix: obj.properties?.posted_date || '',
        lastUpdateTimeUnix: obj.properties?.posted_date || '',
        distance: metadata.distance,
        score: metadata.score,
        certainty: metadata.certainty,
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

