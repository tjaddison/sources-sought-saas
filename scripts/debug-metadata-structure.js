const weaviate = require('weaviate-client').default;
require('dotenv').config({ path: '.env.local' });

async function debugMetadata() {
  try {
    const client = await weaviate.connectToWeaviateCloud(
      process.env.WEAVIATE_URL,
      {
        authCredentials: new weaviate.ApiKey(process.env.WEAVIATE_API_KEY),
        headers: { 'X-OpenAI-Api-Key': process.env.OPENAI_API_KEY },
      }
    );
    
    const collection = client.collections.get(process.env.WEAVIATE_INDEX_NAME || 'SamOopsWeaviateCluster');
    
    // Create a test vector
    const testVector = new Array(1536).fill(0.1);
    
    console.log('Performing vector search to check metadata structure...\n');
    
    const result = await collection.query.nearVector(testVector, {
      limit: 2,
      returnMetadata: ['distance', 'certainty', 'score'],
    });
    
    console.log('Number of results:', result.objects.length);
    
    if (result.objects.length > 0) {
      const obj = result.objects[0];
      
      console.log('\nFirst object structure:');
      console.log('- Has obj.metadata?', !!obj.metadata);
      console.log('- Has obj._additional?', !!obj._additional);
      console.log('- Has obj.properties?', !!obj.properties);
      
      if (obj.metadata) {
        console.log('\nobj.metadata contents:', obj.metadata);
      }
      
      if (obj._additional) {
        console.log('\nobj._additional contents:', obj._additional);
      }
      
      console.log('\nFull object keys:', Object.keys(obj));
      
      // Try to access distance in different ways
      console.log('\nDistance value checks:');
      console.log('- obj.metadata?.distance:', obj.metadata?.distance);
      console.log('- obj._additional?.distance:', obj._additional?.distance);
      console.log('- obj.distance:', obj.distance);
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

debugMetadata();