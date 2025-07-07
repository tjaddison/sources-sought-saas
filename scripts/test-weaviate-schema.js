const weaviate = require('weaviate-client').default;
const { ApiKey } = require('weaviate-client');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: '.env.local' });

async function testWeaviateSchema() {
  console.log('=== Weaviate Schema Test Script ===\n');

  // Check environment variables
  const weaviateUrl = process.env.WEAVIATE_URL;
  const weaviateApiKey = process.env.WEAVIATE_API_KEY;
  const collectionName = process.env.WEAVIATE_INDEX_NAME || 'SamOopsWeaviateCluster';

  if (!weaviateUrl || !weaviateApiKey) {
    console.error('❌ Missing required environment variables:');
    console.error('  WEAVIATE_URL:', weaviateUrl ? '✓ Set' : '✗ Missing');
    console.error('  WEAVIATE_API_KEY:', weaviateApiKey ? '✓ Set' : '✗ Missing');
    process.exit(1);
  }

  console.log('✓ Environment variables loaded');
  console.log('  WEAVIATE_URL:', weaviateUrl);
  console.log('  Collection Name:', collectionName);
  console.log('');

  try {
    // Connect to Weaviate
    console.log('Connecting to Weaviate...');
    const client = await weaviate.connectToWeaviateCloud(weaviateUrl, {
      authCredentials: new ApiKey(weaviateApiKey),
      headers: {
        'X-OpenAI-Api-Key': process.env.OPENAI_API_KEY || '',
      },
    });
    console.log('✓ Connected to Weaviate\n');

    // Get the collection
    const collection = client.collections.get(collectionName);

    // Test 1: Check if collection exists and get its configuration
    console.log('=== Test 1: Collection Configuration ===');
    try {
      const config = await collection.config.get();
      console.log('✓ Collection exists:', collectionName);
      console.log('Configuration:');
      console.log('  - Vectorizer:', config.vectorizer || 'None');
      console.log('  - Vector Index Type:', config.vectorIndexType || 'Unknown');
      console.log('  - Properties:', config.properties?.length || 0);
      
      // Check if vectors are enabled
      if (config.vectorizer) {
        console.log('  - Vectors Enabled: ✓ Yes');
        console.log('  - Vector Dimensions:', config.vectorIndexConfig?.dimensions || 'Auto-detected');
      } else {
        console.log('  - Vectors Enabled: ✗ No');
      }

      // List all properties
      console.log('\nProperties in schema:');
      if (config.properties && config.properties.length > 0) {
        config.properties.forEach((prop) => {
          console.log(`  - ${prop.name}: ${prop.dataType.join(', ')}`);
        });
      }
    } catch (error) {
      console.error('❌ Error getting collection config:', error.message);
    }

    // Test 2: Count total objects
    console.log('\n=== Test 2: Object Count ===');
    try {
      const result = await collection.aggregate.overAll().exec();
      console.log('Total objects in collection:', result.totalCount || 0);
    } catch (error) {
      console.error('❌ Error counting objects:', error.message);
    }

    // Test 3: Fetch sample objects and check for vectors
    console.log('\n=== Test 3: Check Vector Embeddings ===');
    try {
      const sampleResult = await collection.query.fetchObjects({
        limit: 5,
        includeVector: true,
      });

      console.log(`Fetched ${sampleResult.objects.length} sample objects`);

      if (sampleResult.objects.length > 0) {
        console.log('\nChecking for vector embeddings:');
        sampleResult.objects.forEach((obj, index) => {
          const hasVector = obj.vectors && 
                           ((Array.isArray(obj.vectors) && obj.vectors.length > 0) ||
                            (obj.vectors.default && Array.isArray(obj.vectors.default) && obj.vectors.default.length > 0));
          
          console.log(`  Object ${index + 1}:`);
          console.log(`    - ID: ${obj.uuid}`);
          console.log(`    - Has Vector: ${hasVector ? '✓ Yes' : '✗ No'}`);
          
          if (hasVector) {
            const vector = Array.isArray(obj.vectors) ? obj.vectors : obj.vectors.default;
            console.log(`    - Vector Dimensions: ${vector.length}`);
            console.log(`    - First 5 values: [${vector.slice(0, 5).map(v => v.toFixed(4)).join(', ')}...]`);
          }
          
          // Show sample properties
          if (obj.properties) {
            console.log('    - Sample Properties:');
            console.log(`      Title: ${obj.properties.title || 'N/A'}`);
            console.log(`      Notice ID: ${obj.properties.notice_id || 'N/A'}`);
            console.log(`      Content length: ${obj.properties.content ? obj.properties.content.length : 0} chars`);
          }
        });
      }
    } catch (error) {
      console.error('❌ Error fetching sample objects:', error.message);
    }

    // Test 4: Test vector search with a dummy vector
    console.log('\n=== Test 4: Vector Search Test ===');
    try {
      // First, get the vector dimensions from an existing object
      const oneObject = await collection.query.fetchObjects({
        limit: 1,
        includeVector: true,
      });

      if (oneObject.objects.length > 0 && oneObject.objects[0].vectors) {
        const existingVector = Array.isArray(oneObject.objects[0].vectors) 
          ? oneObject.objects[0].vectors 
          : oneObject.objects[0].vectors.default;

        if (existingVector && existingVector.length > 0) {
          console.log(`Using vector with ${existingVector.length} dimensions for test`);
          
          // Create a test vector with same dimensions
          const testVector = new Array(existingVector.length).fill(0).map(() => Math.random() * 0.1);
          
          console.log('Attempting vector search...');
          const vectorResult = await collection.query.nearVector(testVector, {
            limit: 3,
            returnMetadata: ['distance', 'certainty'],
          });

          console.log(`✓ Vector search returned ${vectorResult.objects.length} results`);
          
          if (vectorResult.objects.length > 0) {
            console.log('\nVector search results:');
            vectorResult.objects.forEach((obj, index) => {
              console.log(`  Result ${index + 1}:`);
              console.log(`    - Title: ${obj.properties?.title || 'N/A'}`);
              console.log(`    - Distance: ${obj._additional?.distance || 'N/A'}`);
              console.log(`    - Certainty: ${obj._additional?.certainty || 'N/A'}`);
            });
          }
        } else {
          console.log('❌ No vector found on existing objects - vectors may not be enabled');
        }
      } else {
        console.log('❌ No objects found to determine vector dimensions');
      }
    } catch (error) {
      console.error('❌ Error in vector search test:', error.message);
      console.error('Full error:', error);
    }

    // Test 5: Test hybrid search
    console.log('\n=== Test 5: Hybrid Search Test ===');
    try {
      console.log('Testing hybrid search with query "technology"...');
      
      // Get a sample vector for hybrid search
      const oneObject = await collection.query.fetchObjects({
        limit: 1,
        includeVector: true,
      });

      if (oneObject.objects.length > 0 && oneObject.objects[0].vectors) {
        const existingVector = Array.isArray(oneObject.objects[0].vectors) 
          ? oneObject.objects[0].vectors 
          : oneObject.objects[0].vectors.default;

        if (existingVector && existingVector.length > 0) {
          const testVector = new Array(existingVector.length).fill(0).map(() => Math.random() * 0.1);
          
          const hybridResult = await collection.query.hybrid('technology', {
            limit: 3,
            vector: testVector,
            alpha: 0.5,
            returnMetadata: ['score', 'explainScore'],
          });

          console.log(`✓ Hybrid search returned ${hybridResult.objects.length} results`);
          
          if (hybridResult.objects.length > 0) {
            console.log('\nHybrid search results:');
            hybridResult.objects.forEach((obj, index) => {
              console.log(`  Result ${index + 1}:`);
              console.log(`    - Title: ${obj.properties?.title || 'N/A'}`);
              console.log(`    - Score: ${obj._additional?.score || 'N/A'}`);
            });
          }
        }
      }
    } catch (error) {
      console.error('❌ Error in hybrid search test:', error.message);
    }

    // Test 6: Test keyword search
    console.log('\n=== Test 6: Keyword Search Test ===');
    try {
      console.log('Testing keyword search with nearText...');
      const keywordResult = await collection.query.nearText('technology software', {
        limit: 3,
        returnMetadata: ['distance'],
      });

      console.log(`✓ Keyword search returned ${keywordResult.objects.length} results`);
      
      if (keywordResult.objects.length > 0) {
        console.log('\nKeyword search results:');
        keywordResult.objects.forEach((obj, index) => {
          console.log(`  Result ${index + 1}:`);
          console.log(`    - Title: ${obj.properties?.title || 'N/A'}`);
          console.log(`    - Distance: ${obj._additional?.distance || 'N/A'}`);
        });
      }
    } catch (error) {
      console.error('❌ Error in keyword search test:', error.message);
    }

    console.log('\n=== Summary ===');
    console.log('Test complete. Review the results above to diagnose vector search issues.');
    console.log('\nCommon issues:');
    console.log('1. If no vectors are found: The collection may not have vectorization enabled');
    console.log('2. If vector dimensions mismatch: User embeddings may use different dimensions');
    console.log('3. If hybrid search fails: Check if text2vec module is configured');

  } catch (error) {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  }
}

// Run the test
testWeaviateSchema().catch(console.error);