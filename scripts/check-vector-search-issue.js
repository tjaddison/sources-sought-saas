const weaviate = require('weaviate-client').default;

async function checkVectorSearchIssue() {
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

    const collectionName = process.env.WEAVIATE_INDEX_NAME || 'SamOopsWeaviateCluster';
    console.log('Using collection:', collectionName);
    
    const collection = client.collections.get(collectionName);
    
    // Test 1: Check if collection exists and has objects
    console.log('\n1. Checking collection...');
    const testFetch = await collection.query.fetchObjects({ limit: 5 });
    console.log('Collection has', testFetch.objects.length, 'objects (fetched 5)');
    
    // Test 2: Check if objects have vectors
    console.log('\n2. Checking if objects have vectors...');
    let hasVectors = 0;
    for (const obj of testFetch.objects) {
      if (obj.vector && obj.vector.length > 0) {
        hasVectors++;
        console.log('Object', obj.uuid, 'has vector with', obj.vector.length, 'dimensions');
      }
    }
    console.log(hasVectors, 'out of', testFetch.objects.length, 'objects have vectors');
    
    // Test 3: Try vector search with a test vector
    if (hasVectors > 0) {
      console.log('\n3. Testing vector search...');
      const testVector = new Array(1536).fill(0.1);
      
      try {
        const vectorResult = await collection.query.nearVector(testVector, {
          limit: 5,
          returnMetadata: ['distance', 'certainty'],
        });
        console.log('Vector search returned', vectorResult.objects.length, 'results');
        
        if (vectorResult.objects.length > 0) {
          console.log('First result distance:', vectorResult.objects[0].metadata?.distance);
        }
      } catch (error) {
        console.error('Vector search error:', error.message);
      }
    }
    
    // Test 4: Check collection configuration
    console.log('\n4. Checking collection configuration...');
    const schema = await client.collections.listAll();
    const collectionSchema = schema.find(c => c.name === collectionName);
    if (collectionSchema) {
      console.log('Vectorizer:', collectionSchema.vectorizer || 'none');
      console.log('Properties:', Object.keys(collectionSchema.properties || {}).length);
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// Load environment variables
require('dotenv').config({ path: '.env.local' });

checkVectorSearchIssue();