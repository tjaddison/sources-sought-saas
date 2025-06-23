const weaviate = require('weaviate-client').default;
const OpenAI = require('openai');
require('dotenv').config({ path: '.env.local' });

async function testMatchPercentage() {
  try {
    // 1. Generate a test embedding
    console.log('1. Generating test embedding...');
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    
    const testDescription = "Software development company specializing in cloud computing and cybersecurity";
    
    const embeddingResponse = await openai.embeddings.create({
      input: testDescription,
      model: 'text-embedding-3-small',
    });
    
    const testEmbedding = embeddingResponse.data[0].embedding;
    console.log('- Embedding dimensions:', testEmbedding.length);
    
    // 2. Connect to Weaviate
    console.log('\n2. Connecting to Weaviate...');
    const client = await weaviate.connectToWeaviateCloud(
      process.env.WEAVIATE_URL,
      {
        authCredentials: new weaviate.ApiKey(process.env.WEAVIATE_API_KEY),
        headers: { 'X-OpenAI-Api-Key': process.env.OPENAI_API_KEY },
      }
    );
    
    const collection = client.collections.get(process.env.WEAVIATE_INDEX_NAME || 'SamOopsWeaviateCluster');
    
    // 3. Perform vector search
    console.log('\n3. Performing vector search...');
    const result = await collection.query.nearVector(testEmbedding, {
      limit: 5,
      returnMetadata: ['distance', 'certainty', 'score'],
    });
    
    console.log('- Found', result.objects.length, 'results\n');
    
    // 4. Calculate and display match percentages
    console.log('MATCH PERCENTAGE CALCULATION TEST:');
    console.log('==================================\n');
    
    result.objects.forEach((obj, idx) => {
      console.log(`Result ${idx + 1}:`);
      console.log('- Title:', obj.properties.title?.substring(0, 60) + '...');
      
      // Check metadata structure
      console.log('- Has metadata?', !!obj.metadata);
      console.log('- Has _additional?', !!obj._additional);
      
      const metadata = obj.metadata || obj._additional || {};
      console.log('- Distance:', metadata.distance);
      console.log('- Certainty:', metadata.certainty);
      console.log('- Score:', metadata.score);
      
      // Calculate match percentage
      let matchPercentage = 0;
      if (metadata.distance !== undefined) {
        const similarity = 1 - (metadata.distance / 2);
        matchPercentage = Math.round(Math.max(0, similarity * 100));
      }
      
      console.log(`- MATCH: ${matchPercentage}%`);
      console.log('');
    });
    
    // 5. Test with fetch request to API
    console.log('\nTesting API endpoint...');
    const apiUrl = 'http://localhost:3003/api/sources-sought/hybrid-search?page=1&pageSize=5';
    console.log('Note: This requires authentication. Check the browser for results.\n');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testMatchPercentage();