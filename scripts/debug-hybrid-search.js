const weaviate = require('weaviate-client').default;
const { ApiKey } = require('weaviate-client');
require('dotenv').config({ path: '.env.local' });

async function testWeaviateConnection() {
  console.log('=== Testing Weaviate Connection and Hybrid Search ===\n');

  // Check environment variables
  console.log('1. Checking environment variables...');
  console.log('WEAVIATE_URL:', process.env.WEAVIATE_URL ? 'Set' : 'Not set');
  console.log('WEAVIATE_API_KEY:', process.env.WEAVIATE_API_KEY ? 'Set' : 'Not set');
  console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? 'Set' : 'Not set');
  console.log('WEAVIATE_INDEX_NAME:', process.env.WEAVIATE_INDEX_NAME || 'SamOopsWeaviateCluster');

  if (!process.env.WEAVIATE_URL || !process.env.WEAVIATE_API_KEY) {
    console.error('\nError: Missing required environment variables');
    return;
  }

  try {
    // Connect to Weaviate
    console.log('\n2. Connecting to Weaviate...');
    const client = await weaviate.connectToWeaviateCloud(
      process.env.WEAVIATE_URL,
      {
        authCredentials: new ApiKey(process.env.WEAVIATE_API_KEY),
        headers: {
          'X-OpenAI-Api-Key': process.env.OPENAI_API_KEY || '',
        },
      }
    );
    console.log('✓ Connected successfully');

    // Get collection
    const collectionName = process.env.WEAVIATE_INDEX_NAME || 'SamOopsWeaviateCluster';
    console.log(`\n3. Getting collection "${collectionName}"...`);
    const collection = client.collections.get(collectionName);
    console.log('✓ Collection retrieved');

    // Check collection configuration
    console.log('\n4. Checking collection configuration...');
    try {
      const config = await collection.config.get();
      console.log('Collection config:', JSON.stringify(config, null, 2));
    } catch (error) {
      console.log('Could not retrieve collection config:', error.message);
    }

    // Get total count
    console.log('\n5. Getting total document count...');
    const countResult = await collection.aggregate.overAll();
    console.log('Total documents:', countResult.totalCount);

    // Test fetching objects
    console.log('\n6. Testing basic fetch...');
    const fetchResult = await collection.query.fetchObjects({
      limit: 5
    });
    console.log('Fetched objects count:', fetchResult.objects.length);
    
    if (fetchResult.objects.length > 0) {
      console.log('\nFirst object structure:');
      const firstObj = fetchResult.objects[0];
      console.log('- UUID:', firstObj.uuid);
      console.log('- Properties:', Object.keys(firstObj.properties));
      console.log('- Has vectors:', firstObj.vectors ? 'Yes' : 'No');
      if (firstObj.vectors) {
        console.log('- Vector keys:', Object.keys(firstObj.vectors));
      }
    }

    // Test vector search with a dummy embedding
    console.log('\n7. Testing vector search...');
    // Create a dummy 1536-dimensional vector (OpenAI embedding size)
    const dummyVector = new Array(1536).fill(0.1);
    
    try {
      const vectorResult = await collection.query.nearVector(dummyVector, {
        limit: 3,
        returnMetadata: ['distance', 'certainty']
      });
      console.log('✓ Vector search successful');
      console.log('Results count:', vectorResult.objects.length);
      
      if (vectorResult.objects.length > 0) {
        console.log('\nFirst result:');
        console.log('- Title:', vectorResult.objects[0].properties.title);
        console.log('- Distance:', vectorResult.objects[0]._additional?.distance);
        console.log('- Certainty:', vectorResult.objects[0]._additional?.certainty);
      }
    } catch (error) {
      console.error('✗ Vector search failed:', error.message);
      if (error.message.includes('dimension')) {
        console.log('\nDimension mismatch detected!');
        console.log('Expected vector dimensions: Check your Weaviate schema');
        console.log('Provided vector dimensions:', dummyVector.length);
      }
    }

    // Test hybrid search
    console.log('\n8. Testing hybrid search...');
    const testQuery = 'software development';
    
    try {
      const hybridResult = await collection.query.hybrid(testQuery, {
        limit: 3,
        vector: dummyVector,
        alpha: 0.5,
        returnMetadata: ['score', 'explainScore', 'distance']
      });
      console.log('✓ Hybrid search successful');
      console.log('Results count:', hybridResult.objects.length);
      
      if (hybridResult.objects.length > 0) {
        console.log('\nFirst result:');
        console.log('- Title:', hybridResult.objects[0].properties.title);
        console.log('- Score:', hybridResult.objects[0]._additional?.score);
        console.log('- Distance:', hybridResult.objects[0]._additional?.distance);
      }
    } catch (error) {
      console.error('✗ Hybrid search failed:', error.message);
    }

    // Test keyword search
    console.log('\n9. Testing keyword search...');
    try {
      const keywordResult = await collection.query.bm25(testQuery, {
        limit: 3,
        returnMetadata: ['score']
      });
      console.log('✓ Keyword search successful');
      console.log('Results count:', keywordResult.objects.length);
      
      if (keywordResult.objects.length > 0) {
        console.log('\nFirst result:');
        console.log('- Title:', keywordResult.objects[0].properties.title);
        console.log('- Score:', keywordResult.objects[0]._additional?.score);
      }
    } catch (error) {
      console.error('✗ Keyword search failed:', error.message);
    }

  } catch (error) {
    console.error('\nConnection failed:', error);
  }
}

// Run the test
testWeaviateConnection();