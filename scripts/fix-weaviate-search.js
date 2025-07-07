const weaviate = require('weaviate-client').default;
const { ApiKey } = require('weaviate-client');
const { OpenAI } = require('openai');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: '.env.local' });

/**
 * This script provides solutions for the vector search issue:
 * 1. Demonstrates BM25 search as an immediate workaround
 * 2. Shows how to add vectors to existing objects
 * 3. Provides code to create a new collection with proper vectorization
 */

async function fixWeaviateSearch() {
  console.log('=== Weaviate Search Solutions ===\n');

  const weaviateUrl = process.env.WEAVIATE_URL;
  const weaviateApiKey = process.env.WEAVIATE_API_KEY;
  const openaiApiKey = process.env.OPENAI_API_KEY;
  const collectionName = process.env.WEAVIATE_INDEX_NAME || 'SamOopsWeaviateCluster';

  if (!weaviateUrl || !weaviateApiKey) {
    console.error('Missing Weaviate credentials');
    process.exit(1);
  }

  // Connect to Weaviate
  const client = await weaviate.connectToWeaviateCloud(weaviateUrl, {
    authCredentials: new ApiKey(weaviateApiKey),
    headers: {
      'X-OpenAI-Api-Key': openaiApiKey || '',
    },
  });

  const collection = client.collections.get(collectionName);

  // Solution 1: Use BM25 search instead of vector search
  console.log('=== Solution 1: BM25 Search (Immediate Workaround) ===');
  console.log('You can use BM25 search which works without vectors:\n');

  async function searchWithBM25(query, limit = 10) {
    try {
      const result = await collection.query.bm25(query, {
        limit: limit,
        returnMetadata: ['score'],
      });

      return {
        items: result.objects.map(obj => ({
          ...obj.properties,
          _additional: {
            id: obj.uuid,
            score: obj._additional?.score || 0,
          },
          // Convert BM25 score to match percentage (approximate)
          matchPercentage: Math.min(100, Math.round((obj._additional?.score || 0) * 100))
        })),
        total: result.objects.length
      };
    } catch (error) {
      console.error('BM25 search error:', error);
      return { items: [], total: 0 };
    }
  }

  // Demo BM25 search
  const bm25Results = await searchWithBM25('technology software', 5);
  console.log(`BM25 search found ${bm25Results.total} results:`);
  bm25Results.items.forEach((item, idx) => {
    console.log(`  ${idx + 1}. ${item.title} (Match: ${item.matchPercentage}%)`);
  });

  // Solution 2: Add vectors to existing objects
  console.log('\n=== Solution 2: Add Vectors to Existing Objects ===');
  
  if (openaiApiKey) {
    console.log('OpenAI API key found. Demonstrating how to add vectors...\n');
    
    const openai = new OpenAI({ apiKey: openaiApiKey });

    async function generateEmbedding(text) {
      try {
        const response = await openai.embeddings.create({
          model: 'text-embedding-ada-002',
          input: text,
        });
        return response.data[0].embedding;
      } catch (error) {
        console.error('Error generating embedding:', error);
        return null;
      }
    }

    // Example: Add vector to one object
    try {
      const sampleResult = await collection.query.fetchObjects({ limit: 1 });
      if (sampleResult.objects.length > 0) {
        const obj = sampleResult.objects[0];
        const textToEmbed = `${obj.properties.title} ${obj.properties.content}`.slice(0, 8000);
        
        console.log('Generating embedding for:', obj.properties.title);
        const embedding = await generateEmbedding(textToEmbed);
        
        if (embedding) {
          console.log('Generated embedding with', embedding.length, 'dimensions');
          console.log('To update the object with this vector, you would use:');
          console.log(`
await collection.data.update({
  id: '${obj.uuid}',
  vectors: embedding
});
          `);
        }
      }
    } catch (error) {
      console.error('Error in vector generation demo:', error.message);
    }
  } else {
    console.log('No OpenAI API key found. Cannot generate embeddings.');
  }

  // Solution 3: Show how to create a properly configured collection
  console.log('\n=== Solution 3: Create New Collection with Vectorizer ===');
  console.log('To create a collection with automatic vectorization:\n');
  
  console.log(`
// Create collection with text2vec-openai
await client.collections.create({
  name: 'SourcesSoughtVectorized',
  vectorizer: {
    name: 'text2vec-openai',
    config: {
      model: 'ada',
      modelVersion: '002',
      type: 'text',
    }
  },
  properties: [
    { name: 'title', dataType: 'text' },
    { name: 'content', dataType: 'text' },
    { name: 'notice_id', dataType: 'text' },
    { name: 'agency_name', dataType: 'text' },
    { name: 'posted_date', dataType: 'text' },
    { name: 'response_deadline', dataType: 'text' },
    { name: 'type', dataType: 'text' },
    // ... other properties
  ],
  vectorIndexConfig: {
    distance: 'cosine',
  }
});
  `);

  // Solution 4: Modified search function for the application
  console.log('\n=== Solution 4: Updated Search Function ===');
  console.log('Here\'s a modified search function that uses BM25:\n');

  console.log(`
// In lib/weaviate.ts, modify the hybridSearchWithUserProfile function:

export async function hybridSearchWithUserProfile(
  userEmbedding: number[],
  query: string,
  limit: number = 25,
  offset: number = 0,
  typeFilter?: string,
  alpha: number = 0.5
): Promise<{ items: WeaviateSourcesSoughtItem[]; total: number }> {
  const client = await getWeaviateClient();
  const collectionName = process.env.WEAVIATE_INDEX_NAME || 'SamOopsWeaviateCluster';
  const collection = client.collections.get(collectionName);

  // Since vectors aren't available, use BM25 search
  console.log('Using BM25 search (vectors not available)');
  
  try {
    // Use BM25 for text search
    const result = await collection.query.bm25(query || '*', {
      limit: limit,
      offset: offset,
      returnMetadata: ['score'],
      where: typeFilter ? {
        path: ['type'],
        operator: 'Equal',
        valueText: typeFilter
      } : undefined
    });

    // Transform results
    const items = result.objects.map((obj: any) => ({
      _additional: {
        id: obj.uuid || '',
        creationTimeUnix: obj.properties?.posted_date || '',
        lastUpdateTimeUnix: obj.properties?.posted_date || '',
        score: obj._additional?.score,
      },
      ...obj.properties,
      // Convert BM25 score to match percentage
      matchPercentage: Math.min(100, Math.round((obj._additional?.score || 0) * 100))
    }));

    return {
      items: items as WeaviateSourcesSoughtItem[],
      total: items.length,
    };
  } catch (error) {
    console.error('BM25 search error:', error);
    // Fallback to regular fetch
    const result = await collection.query.fetchObjects({
      limit: limit,
      offset: offset,
      where: typeFilter ? {
        path: ['type'],
        operator: 'Equal',
        valueText: typeFilter
      } : undefined
    });

    const items = result.objects.map((obj: any) => ({
      _additional: {
        id: obj.uuid || '',
        creationTimeUnix: obj.properties?.posted_date || '',
        lastUpdateTimeUnix: obj.properties?.posted_date || '',
      },
      ...obj.properties,
      matchPercentage: 50 // Default match for non-scored results
    }));

    return {
      items: items as WeaviateSourcesSoughtItem[],
      total: items.length,
    };
  }
}
  `);

  console.log('\n=== Summary ===');
  console.log('The vector search returns 0 results because:');
  console.log('1. The Weaviate collection has no vectorizer configured');
  console.log('2. Objects don\'t have vector embeddings');
  console.log('\nImmediate fix: Use BM25 (keyword) search instead');
  console.log('Long-term fix: Either add vectors to objects or recreate collection with vectorizer');
}

// Run the fix demonstrations
fixWeaviateSearch().catch(console.error);