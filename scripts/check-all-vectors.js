const weaviate = require('weaviate-client').default;

async function checkAllVectors() {
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
    const collection = client.collections.get(collectionName);
    
    console.log('Checking vectors in collection:', collectionName);
    
    let totalObjects = 0;
    let objectsWithVectors = 0;
    let offset = 0;
    const batchSize = 100;
    
    while (true) {
      const batch = await collection.query.fetchObjects({ 
        limit: batchSize,
        offset: offset 
      });
      
      if (batch.objects.length === 0) break;
      
      for (const obj of batch.objects) {
        totalObjects++;
        if (obj.vector && obj.vector.length > 0) {
          objectsWithVectors++;
          if (objectsWithVectors === 1) {
            console.log('First object with vector found:');
            console.log('- UUID:', obj.uuid);
            console.log('- Title:', obj.properties.title);
            console.log('- Vector dimensions:', obj.vector.length);
          }
        }
      }
      
      console.log(`Checked ${totalObjects} objects, found ${objectsWithVectors} with vectors...`);
      
      offset += batchSize;
      if (offset > 1000) break; // Check first 1000 objects
    }
    
    console.log('\nFinal results:');
    console.log(`Total objects checked: ${totalObjects}`);
    console.log(`Objects with vectors: ${objectsWithVectors}`);
    console.log(`Percentage with vectors: ${(objectsWithVectors/totalObjects*100).toFixed(2)}%`);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// Load environment variables
require('dotenv').config({ path: '.env.local' });

checkAllVectors();