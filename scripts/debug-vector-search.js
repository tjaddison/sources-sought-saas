const weaviate = require('weaviate-client').default;
const { ApiKey } = require('weaviate-client');
require('dotenv').config({ path: '.env.local' });

async function debugVectorSearch() {
  console.log('=== Debugging Vector Search ===\n');

  try {
    // Connect to Weaviate
    const client = await weaviate.connectToWeaviateCloud(
      process.env.WEAVIATE_URL,
      {
        authCredentials: new ApiKey(process.env.WEAVIATE_API_KEY),
        headers: {
          'X-OpenAI-Api-Key': process.env.OPENAI_API_KEY || '',
        },
      }
    );

    const collectionName = process.env.WEAVIATE_INDEX_NAME || 'SamOopsWeaviateCluster';
    const collection = client.collections.get(collectionName);

    // Check how many objects have vectors
    console.log('1. Checking objects with vectors...');
    const result = await collection.query.fetchObjects({
      limit: 10,
      includeVector: true
    });

    let objectsWithVectors = 0;
    result.objects.forEach(obj => {
      if (obj.vectors?.default && obj.vectors.default.length > 0) {
        objectsWithVectors++;
      }
    });
    console.log(`Objects checked: ${result.objects.length}`);
    console.log(`Objects with vectors: ${objectsWithVectors}\n`);

    // If we have an object with vectors, use its vector for search
    const objectWithVector = result.objects.find(obj => obj.vectors?.default && obj.vectors.default.length > 0);
    
    if (objectWithVector) {
      console.log('2. Using existing vector for search test...');
      console.log(`Using vector from: ${objectWithVector.properties.title}`);
      console.log(`Vector dimensions: ${objectWithVector.vectors.default.length}\n`);

      // Try different search methods
      console.log('3. Testing different search approaches...\n');

      // Test 1: nearVector with exact vector
      console.log('Test 1: nearVector with exact vector');
      try {
        const nearVectorResult = await collection.query.nearVector(objectWithVector.vectors.default, {
          limit: 5,
          returnMetadata: ['distance', 'certainty']
        });
        console.log(`Results: ${nearVectorResult.objects.length}`);
        if (nearVectorResult.objects.length > 0) {
          console.log(`First result: ${nearVectorResult.objects[0].properties.title} (distance: ${nearVectorResult.objects[0]._additional?.distance})`);
        }
      } catch (error) {
        console.log(`Error: ${error.message}`);
      }

      // Test 2: nearObject
      console.log('\nTest 2: nearObject');
      try {
        const nearObjectResult = await collection.query.nearObject(objectWithVector.uuid, {
          limit: 5,
          returnMetadata: ['distance', 'certainty']
        });
        console.log(`Results: ${nearObjectResult.objects.length}`);
        if (nearObjectResult.objects.length > 0) {
          console.log(`First result: ${nearObjectResult.objects[0].properties.title} (distance: ${nearObjectResult.objects[0]._additional?.distance})`);
        }
      } catch (error) {
        console.log(`Error: ${error.message}`);
      }

      // Test 3: fetchObjects with where filter
      console.log('\nTest 3: Simple fetch to verify data exists');
      try {
        const fetchResult = await collection.query.fetchObjects({
          limit: 5,
          where: {
            path: ['title'],
            operator: 'Like',
            valueText: '*software*'
          }
        });
        console.log(`Results: ${fetchResult.objects.length}`);
        if (fetchResult.objects.length > 0) {
          console.log(`First result: ${fetchResult.objects[0].properties.title}`);
        }
      } catch (error) {
        console.log(`Error: ${error.message}`);
      }

    } else {
      console.log('No objects with vectors found. Adding vectors to a few objects first...\n');
      
      // Add simple dummy vectors to test
      console.log('Adding dummy vectors to first 3 objects...');
      for (let i = 0; i < Math.min(3, result.objects.length); i++) {
        const obj = result.objects[i];
        const dummyVector = new Array(1536).fill(0).map(() => Math.random() * 0.1);
        
        try {
          await collection.data.update({
            id: obj.uuid,
            vectors: {
              default: dummyVector
            }
          });
          console.log(`✓ Added vector to: ${obj.properties.title}`);
        } catch (error) {
          console.log(`✗ Failed to add vector to ${obj.uuid}: ${error.message}`);
        }
      }
      
      console.log('\nRe-run this script to test vector search with the added vectors.');
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

debugVectorSearch();