const weaviate = require('weaviate-client').default;
const { ApiKey } = require('weaviate-client');
const OpenAI = require('openai');
require('dotenv').config({ path: '.env.local' });

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function testAddSingleVector() {
  console.log('=== Testing Vector Addition to Single Object ===\n');

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

    // Fetch one object
    console.log('1. Fetching a test object...');
    const result = await collection.query.fetchObjects({
      limit: 1,
      includeVector: true
    });

    if (result.objects.length === 0) {
      console.log('No objects found');
      return;
    }

    const testObject = result.objects[0];
    console.log(`Object ID: ${testObject.uuid}`);
    console.log(`Title: ${testObject.properties.title}`);
    console.log(`Current vector status: ${JSON.stringify(testObject.vectors)}\n`);

    // Generate embedding
    console.log('2. Generating embedding with OpenAI...');
    const textForEmbedding = `${testObject.properties.title || ''} ${testObject.properties.content || ''}`.substring(0, 8000);
    
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: textForEmbedding,
    });
    
    const embedding = embeddingResponse.data[0].embedding;
    console.log(`Embedding generated - dimensions: ${embedding.length}`);
    console.log(`First 5 values: ${embedding.slice(0, 5).join(', ')}\n`);

    // Update object with vector
    console.log('3. Updating object with vector...');
    await collection.data.update({
      id: testObject.uuid,
      vectors: {
        default: embedding
      }
    });
    console.log('✓ Vector added successfully\n');

    // Verify the update
    console.log('4. Verifying the update...');
    const updatedResult = await collection.query.fetchObjectById(testObject.uuid, {
      includeVector: true
    });
    
    console.log(`Updated object vectors: ${Object.keys(updatedResult.vectors || {}).join(', ')}`);
    if (updatedResult.vectors?.default) {
      console.log(`Vector dimensions: ${updatedResult.vectors.default.length}`);
      console.log(`First 5 values match: ${JSON.stringify(updatedResult.vectors.default.slice(0, 5)) === JSON.stringify(embedding.slice(0, 5))}`);
    }

    // Test vector search with this object
    console.log('\n5. Testing vector search...');
    const searchResult = await collection.query.nearVector(embedding, {
      limit: 3,
      returnMetadata: ['distance', 'certainty']
    });

    console.log(`Search results: ${searchResult.objects.length}`);
    searchResult.objects.forEach((obj, index) => {
      console.log(`${index + 1}. ${obj.properties.title} (distance: ${obj._additional?.distance})`);
    });

  } catch (error) {
    console.error('Error:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

testAddSingleVector();