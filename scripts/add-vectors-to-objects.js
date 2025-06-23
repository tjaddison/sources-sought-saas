const weaviate = require('weaviate-client').default;
const OpenAI = require('openai');

async function addVectorsToObjects() {
  try {
    // Initialize clients
    const client = await weaviate.connectToWeaviateCloud(
      process.env.WEAVIATE_URL,
      {
        authCredentials: new weaviate.ApiKey(process.env.WEAVIATE_API_KEY),
        headers: {
          'X-OpenAI-Api-Key': process.env.OPENAI_API_KEY,
        },
      }
    );

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const collectionName = process.env.WEAVIATE_INDEX_NAME || 'SamOopsWeaviateCluster';
    const collection = client.collections.get(collectionName);
    
    console.log('Starting to add vectors to objects in:', collectionName);
    
    let processedCount = 0;
    let errorCount = 0;
    let offset = 0;
    const batchSize = 10; // Process 10 at a time to avoid rate limits
    
    while (true) {
      const batch = await collection.query.fetchObjects({ 
        limit: batchSize,
        offset: offset 
      });
      
      if (batch.objects.length === 0) break;
      
      for (const obj of batch.objects) {
        try {
          // Create text for embedding
          const text = `${obj.properties.title || ''} ${obj.properties.content || ''}`.trim();
          
          if (!text) {
            console.log(`Skipping object ${obj.uuid} - no text content`);
            continue;
          }
          
          // Generate embedding
          console.log(`Generating embedding for: ${obj.properties.title?.substring(0, 50)}...`);
          const embeddingResponse = await openai.embeddings.create({
            input: text.substring(0, 8000), // Limit text length
            model: 'text-embedding-3-small',
          });
          
          const embedding = embeddingResponse.data[0].embedding;
          
          // Update object with vector
          await collection.data.update({
            id: obj.uuid,
            vector: embedding,
          });
          
          processedCount++;
          console.log(`✓ Processed ${processedCount} objects`);
          
        } catch (error) {
          errorCount++;
          console.error(`Error processing object ${obj.uuid}:`, error.message);
        }
      }
      
      offset += batchSize;
      
      // Progress update
      console.log(`\nProgress: Processed ${processedCount} objects, ${errorCount} errors`);
      
      // Optional: Stop after processing a certain number for testing
      // if (processedCount >= 100) {
      //   console.log('\nStopping after 100 objects for testing. Remove this limit to process all.');
      //   break;
      // }
      
      // Add a small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    console.log('\nComplete!');
    console.log(`Total processed: ${processedCount}`);
    console.log(`Total errors: ${errorCount}`);
    
    // Test vector search
    console.log('\nTesting vector search...');
    const testVector = new Array(1536).fill(0.1);
    const testResult = await collection.query.nearVector(testVector, { limit: 5 });
    console.log('Vector search now returns:', testResult.objects.length, 'results');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// Load environment variables
require('dotenv').config({ path: '.env.local' });

console.log('This script will add OpenAI embeddings to objects in Weaviate.');
// console.log('It will process 100 objects as a test. Remove the limit to process all.');
console.log('Press Ctrl+C to cancel, or wait 5 seconds to continue...\n');

setTimeout(() => {
  addVectorsToObjects();
}, 5000);