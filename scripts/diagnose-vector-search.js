const weaviate = require('weaviate-client').default;

async function diagnoseVectorSearch() {
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
    
    console.log('=== WEAVIATE VECTOR SEARCH DIAGNOSTICS ===\n');
    
    // 1. Check how many objects have vectors now
    console.log('1. Checking vector coverage...');
    let totalObjects = 0;
    let objectsWithVectors = 0;
    let vectorDimensions = new Set();
    
    const sampleBatch = await collection.query.fetchObjects({ limit: 100 });
    
    for (const obj of sampleBatch.objects) {
      totalObjects++;
      if (obj.vector && obj.vector.length > 0) {
        objectsWithVectors++;
        vectorDimensions.add(obj.vector.length);
      }
    }
    
    console.log(`- Sample of ${totalObjects} objects`);
    console.log(`- Objects with vectors: ${objectsWithVectors} (${(objectsWithVectors/totalObjects*100).toFixed(1)}%)`);
    console.log(`- Vector dimensions found: ${Array.from(vectorDimensions).join(', ')}`);
    
    // 2. Test a simple vector search
    if (objectsWithVectors > 0) {
      console.log('\n2. Testing vector search with a sample vector...');
      
      // Get a vector from an existing object
      const objWithVector = sampleBatch.objects.find(obj => obj.vector && obj.vector.length > 0);
      if (objWithVector) {
        const testVector = objWithVector.vector;
        console.log(`- Using vector from object: ${objWithVector.properties.title?.substring(0, 50)}...`);
        console.log(`- Vector dimensions: ${testVector.length}`);
        
        try {
          const searchResult = await collection.query.nearVector(testVector, {
            limit: 5,
            returnMetadata: ['distance', 'certainty'],
          });
          
          console.log(`- Vector search returned: ${searchResult.objects.length} results`);
          
          if (searchResult.objects.length > 0) {
            console.log('\n  Top 3 results:');
            searchResult.objects.slice(0, 3).forEach((obj, idx) => {
              console.log(`  ${idx + 1}. ${obj.properties.title?.substring(0, 60)}...`);
              console.log(`     Distance: ${obj.metadata?.distance}, Certainty: ${obj.metadata?.certainty}`);
              console.log(`     Has vector: ${obj.vector && obj.vector.length > 0 ? 'Yes' : 'No'}`);
            });
          }
        } catch (error) {
          console.error('- Vector search error:', error.message);
        }
      }
    }
    
    // 3. Check collection schema
    console.log('\n3. Checking collection schema...');
    const collections = await client.collections.listAll();
    const collectionSchema = collections.find(c => c.name === collectionName);
    
    if (collectionSchema) {
      console.log(`- Collection: ${collectionSchema.name}`);
      console.log(`- Vectorizer: ${collectionSchema.vectorizer?.default || 'none'}`);
      console.log(`- Vector index config:`, JSON.stringify(collectionSchema.vectorIndexConfig || {}, null, 2));
    }
    
    // 4. Test with a new OpenAI embedding
    console.log('\n4. Testing with a fresh OpenAI embedding...');
    const OpenAI = require('openai');
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    
    const testText = "government contracting software development cloud computing";
    console.log(`- Creating embedding for: "${testText}"`);
    
    const embeddingResponse = await openai.embeddings.create({
      input: testText,
      model: 'text-embedding-3-small',
    });
    
    const freshVector = embeddingResponse.data[0].embedding;
    console.log(`- Fresh vector dimensions: ${freshVector.length}`);
    
    try {
      const freshSearchResult = await collection.query.nearVector(freshVector, {
        limit: 5,
        returnMetadata: ['distance', 'certainty'],
      });
      
      console.log(`- Fresh vector search returned: ${freshSearchResult.objects.length} results`);
      
      if (freshSearchResult.objects.length > 0) {
        console.log('\n  Top result:');
        const topResult = freshSearchResult.objects[0];
        console.log(`  Title: ${topResult.properties.title?.substring(0, 80)}...`);
        console.log(`  Distance: ${topResult.metadata?.distance}`);
        console.log(`  Has vector: ${topResult.vector && topResult.vector.length > 0 ? 'Yes' : 'No'}`);
      }
    } catch (error) {
      console.error('- Fresh vector search error:', error.message);
    }
    
    // 5. Check if vectors are being stored correctly
    console.log('\n5. Checking vector storage...');
    const firstObjWithVector = sampleBatch.objects.find(obj => obj.vector && obj.vector.length > 0);
    if (firstObjWithVector) {
      console.log('- First 5 values of a stored vector:', firstObjWithVector.vector.slice(0, 5));
      console.log('- Vector appears to be:', 
        firstObjWithVector.vector.every(v => v === 0) ? 'All zeros (BAD)' : 
        firstObjWithVector.vector.every(v => Math.abs(v) < 0.0001) ? 'Near zeros (BAD)' : 
        'Normal values (GOOD)'
      );
    }
    
  } catch (error) {
    console.error('Diagnostic error:', error);
  }
}

// Load environment variables
require('dotenv').config({ path: '.env.local' });

diagnoseVectorSearch();