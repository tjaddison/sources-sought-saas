const weaviate = require('weaviate-client').default;
const { ApiKey } = require('weaviate-client');
require('dotenv').config({ path: '.env.local' });

async function checkVectors() {
  console.log('=== Checking Vector Storage in Weaviate ===\n');

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

    // Fetch a few objects with all metadata
    console.log('Fetching objects to check vector storage...\n');
    const result = await collection.query.fetchObjects({
      limit: 3,
      includeVector: true
    });

    console.log(`Total objects fetched: ${result.objects.length}\n`);

    result.objects.forEach((obj, index) => {
      console.log(`\nObject ${index + 1}:`);
      console.log(`- UUID: ${obj.uuid}`);
      console.log(`- Title: ${obj.properties.title}`);
      console.log(`- Has vectors property: ${obj.vectors ? 'Yes' : 'No'}`);
      
      if (obj.vectors) {
        console.log(`- Vector type: ${typeof obj.vectors}`);
        console.log(`- Vector keys: ${Object.keys(obj.vectors).join(', ') || 'None'}`);
        
        if (obj.vectors.default) {
          console.log(`- Default vector length: ${obj.vectors.default.length}`);
          console.log(`- First 5 vector values: ${obj.vectors.default.slice(0, 5).join(', ')}`);
        } else if (Array.isArray(obj.vectors)) {
          console.log(`- Vector length: ${obj.vectors.length}`);
          console.log(`- First 5 vector values: ${obj.vectors.slice(0, 5).join(', ')}`);
        } else {
          console.log(`- Vector structure: ${JSON.stringify(obj.vectors, null, 2)}`);
        }
      }
    });

    // Check schema to see if vectors are configured
    console.log('\n\nChecking collection schema for vector configuration...');
    const config = await collection.config.get();
    
    console.log('\nVectorizers configuration:');
    console.log(JSON.stringify(config.vectorizers, null, 2));

    // Try to get a specific object by ID to see full details
    if (result.objects.length > 0) {
      console.log('\n\nFetching specific object by ID for detailed inspection...');
      const objectId = result.objects[0].uuid;
      
      try {
        const specificObject = await collection.query.fetchObjectById(objectId, {
          includeVector: true
        });
        
        console.log('\nSpecific object details:');
        console.log('- All keys:', Object.keys(specificObject));
        console.log('- Vector info:', specificObject.vectors);
      } catch (error) {
        console.log('Error fetching specific object:', error.message);
      }
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

checkVectors();