const weaviate = require('weaviate-client').default;

async function testVectorSearch() {
  try {
    // Connect to Weaviate
    const client = await weaviate.connectToWeaviateCloud(
      process.env.WEAVIATE_URL,
      {
        authCredentials: new weaviate.ApiKey(process.env.WEAVIATE_API_KEY),
        headers: {
          'X-OpenAI-Api-Key': process.env.OPENAI_API_KEY,
        },
      }
    );

    // Get the correct collection name from environment
    const collectionName = process.env.WEAVIATE_INDEX_NAME || 'SamOopsWeaviateCluster';
    console.log('Using collection name:', collectionName);
    
    const collection = client.collections.get(collectionName);
    
    // Create a test vector (1536 dimensions for OpenAI)
    const testVector = new Array(1536).fill(0.1);
    
    console.log('Testing vector search with a dummy vector...\n');
    
    try {
      // Try nearVector search
      const result = await collection.query.nearVector(testVector, {
        limit: 5,
        returnMetadata: ['distance', 'certainty'],
      });
      
      console.log('Vector search result:', result.objects.length, 'objects found');
      
      if (result.objects.length > 0) {
        console.log('\nFirst result:');
        console.log('Title:', result.objects[0].properties.title);
        console.log('Distance:', result.objects[0].metadata?.distance);
        console.log('Certainty:', result.objects[0].metadata?.certainty);
      }
    } catch (error) {
      console.error('Error in nearVector search:', error.message);
      
      // Try to get collection config
      console.log('\nChecking collection configuration...');
      const collectionConfig = await client.collections.get('SourcesSought');
      console.log('Collection exists:', !!collectionConfig);
      
      // Try a simple fetch to verify connection
      console.log('\nTrying simple fetch...');
      const simpleResult = await collection.query.fetchObjects({ limit: 1 });
      console.log('Simple fetch returned:', simpleResult.objects.length, 'objects');
      
      if (simpleResult.objects.length > 0) {
        console.log('First object has vector?', !!simpleResult.objects[0].vector);
        console.log('Object keys:', Object.keys(simpleResult.objects[0]));
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// Load environment variables
require('dotenv').config({ path: '.env.local' });

testVectorSearch();