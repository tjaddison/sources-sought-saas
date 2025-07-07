const weaviate = require('weaviate-client').default;
const { ApiKey } = require('weaviate-client');
const OpenAI = require('openai');
require('dotenv').config({ path: '.env.local' });

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateEmbedding(text) {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: text,
    });
    return response.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error.message);
    return null;
  }
}

async function addVectorsToWeaviate() {
  console.log('=== Adding Vectors to Weaviate Objects ===\n');

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

    // Get total count
    const countResult = await collection.aggregate.overAll();
    console.log(`Total documents in collection: ${countResult.totalCount}\n`);

    // Process in batches
    const batchSize = 100;
    let offset = 0;
    let processedCount = 0;
    let errorCount = 0;

    console.log('Processing documents in batches...\n');

    while (offset < countResult.totalCount) {
      // Fetch batch
      const result = await collection.query.fetchObjects({
        limit: batchSize,
        offset: offset,
      });

      if (result.objects.length === 0) break;

      console.log(`Processing batch: ${offset} - ${offset + result.objects.length}`);

      // Process each object in the batch
      for (const obj of result.objects) {
        try {
          // Create text for embedding from title and content
          const textForEmbedding = `${obj.properties.title || ''} ${obj.properties.content || ''}`.trim();
          
          if (!textForEmbedding) {
            console.log(`Skipping object ${obj.uuid} - no text content`);
            continue;
          }

          // Generate embedding
          const embedding = await generateEmbedding(textForEmbedding.substring(0, 8000)); // Limit text length
          
          if (!embedding) {
            errorCount++;
            continue;
          }

          // Update object with vector
          await collection.data.update({
            id: obj.uuid,
            vectors: {
              default: embedding
            }
          });

          processedCount++;
          
          if (processedCount % 10 === 0) {
            console.log(`Progress: ${processedCount} documents vectorized`);
          }

          // Rate limiting - OpenAI has rate limits
          await new Promise(resolve => setTimeout(resolve, 100)); // 100ms delay between requests

        } catch (error) {
          console.error(`Error processing object ${obj.uuid}:`, error.message);
          errorCount++;
        }
      }

      offset += batchSize;
    }

    console.log(`\n=== Vectorization Complete ===`);
    console.log(`Total processed: ${processedCount}`);
    console.log(`Errors: ${errorCount}`);

    // Test the vector search again
    console.log('\n=== Testing Vector Search ===');
    const testVector = await generateEmbedding('software development');
    
    if (testVector) {
      const searchResult = await collection.query.nearVector(testVector, {
        limit: 3,
        returnMetadata: ['distance', 'certainty']
      });

      console.log(`\nVector search results: ${searchResult.objects.length}`);
      searchResult.objects.forEach((obj, index) => {
        console.log(`${index + 1}. ${obj.properties.title} (distance: ${obj._additional?.distance})`);
      });
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

// Add command line argument to limit processing
const args = process.argv.slice(2);
if (args[0] === '--test') {
  console.log('Running in test mode - will only process first 10 documents\n');
}

addVectorsToWeaviate();