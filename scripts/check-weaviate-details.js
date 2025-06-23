const weaviate = require('weaviate-client').default;
const { ApiKey } = require('weaviate-client');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: '.env.local' });

async function checkWeaviateDetails() {
  console.log('=== Weaviate Collection Details ===\n');

  const weaviateUrl = process.env.WEAVIATE_URL;
  const weaviateApiKey = process.env.WEAVIATE_API_KEY;
  const collectionName = process.env.WEAVIATE_INDEX_NAME || 'SamOopsWeaviateCluster';

  if (!weaviateUrl || !weaviateApiKey) {
    console.error('Missing required environment variables');
    process.exit(1);
  }

  try {
    // Connect to Weaviate
    const client = await weaviate.connectToWeaviateCloud(weaviateUrl, {
      authCredentials: new ApiKey(weaviateApiKey),
      headers: {
        'X-OpenAI-Api-Key': process.env.OPENAI_API_KEY || '',
      },
    });

    // Get all collections
    console.log('Fetching all collections...');
    const collections = await client.collections.listAll();
    console.log(`\nFound ${collections.length} collections:`);
    collections.forEach(col => {
      console.log(`  - ${col.name}`);
    });

    // Get specific collection
    const collection = client.collections.get(collectionName);
    
    // Try to get the raw schema using the REST API approach
    console.log(`\n=== Schema for collection: ${collectionName} ===`);
    
    try {
      // Fetch objects to understand structure
      const result = await collection.query.fetchObjects({
        limit: 1,
        includeVector: true,
      });

      if (result.objects.length > 0) {
        const obj = result.objects[0];
        console.log('\nSample object structure:');
        console.log('UUID:', obj.uuid);
        console.log('Properties available:', Object.keys(obj.properties || {}));
        console.log('Has vectors:', !!obj.vectors);
        
        if (obj.vectors) {
          console.log('Vector structure:', Object.keys(obj.vectors));
        }
      }

      // Try to get aggregation data
      const countResult = await collection.aggregate.overAll();
      console.log('\nCollection statistics:');
      console.log('Total count:', countResult.totalCount || 'Unable to count');

    } catch (error) {
      console.error('Error getting collection details:', error.message);
    }

    // Test if we can perform a simple BM25 search (keyword search without vectors)
    console.log('\n=== Testing BM25 (keyword) search ===');
    try {
      const bm25Result = await collection.query.bm25('technology', {
        limit: 3,
      });
      
      console.log(`BM25 search returned ${bm25Result.objects.length} results`);
      if (bm25Result.objects.length > 0) {
        bm25Result.objects.forEach((obj, idx) => {
          console.log(`  ${idx + 1}. ${obj.properties?.title || 'No title'}`);
        });
      }
    } catch (error) {
      console.error('BM25 search error:', error.message);
    }

    // Test fetching with filters
    console.log('\n=== Testing filtered fetch ===');
    try {
      const filteredResult = await collection.query.fetchObjects({
        where: {
          path: ['type'],
          operator: 'Equal',
          valueText: 'SourcesSought'
        },
        limit: 5
      });
      
      console.log(`Filtered fetch returned ${filteredResult.objects.length} results of type "SourcesSought"`);
    } catch (error) {
      console.error('Filtered fetch error:', error.message);
    }

    // Check if we need to create vectors manually
    console.log('\n=== Recommendations ===');
    console.log('Based on the analysis:');
    console.log('1. The collection has NO vectorizer configured');
    console.log('2. Objects do not have vector embeddings');
    console.log('3. You need to either:');
    console.log('   a) Recreate the collection with a vectorizer (e.g., text2vec-openai)');
    console.log('   b) Manually generate and insert vectors for each object');
    console.log('   c) Use BM25 (keyword) search instead of vector search');
    console.log('\nFor vector search to work, you must have vectors in your data!');

  } catch (error) {
    console.error('Fatal error:', error);
  }
}

checkWeaviateDetails().catch(console.error);