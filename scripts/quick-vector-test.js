const weaviate = require('weaviate-client').default;
require('dotenv').config({ path: '.env.local' });

async function quickTest() {
  const client = await weaviate.connectToWeaviateCloud(
    process.env.WEAVIATE_URL,
    {
      authCredentials: new weaviate.ApiKey(process.env.WEAVIATE_API_KEY),
      headers: { 'X-OpenAI-Api-Key': process.env.OPENAI_API_KEY },
    }
  );

  const collection = client.collections.get(process.env.WEAVIATE_INDEX_NAME || 'SamOopsWeaviateCluster');
  
  // Check a few objects
  console.log('Checking objects for vectors...');
  const batch = await collection.query.fetchObjects({ limit: 5 });
  
  batch.objects.forEach((obj, idx) => {
    console.log(`\nObject ${idx + 1}:`);
    console.log('- Title:', obj.properties.title?.substring(0, 50) + '...');
    console.log('- Has vector:', obj.vector ? `Yes (${obj.vector.length} dims)` : 'No');
    console.log('- UUID:', obj.uuid);
  });
  
  // Try a vector search with a test vector
  const testVector = new Array(1536).fill(0.1);
  console.log('\nTrying vector search...');
  
  try {
    const result = await collection.query.nearVector(testVector, {
      limit: 3,
      returnMetadata: ['distance', 'certainty'],
    });
    
    console.log(`Found ${result.objects.length} results`);
    result.objects.forEach((obj, idx) => {
      console.log(`\nResult ${idx + 1}:`);
      console.log('- Title:', obj.properties.title?.substring(0, 50) + '...');
      console.log('- Metadata:', obj.metadata);
      console.log('- Has vector:', !!obj.vector);
    });
  } catch (error) {
    console.error('Vector search error:', error.message);
  }
}

quickTest().catch(console.error);