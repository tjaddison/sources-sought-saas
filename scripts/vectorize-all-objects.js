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

async function vectorizeAllObjects() {
  console.log('=== Vectorizing All Weaviate Objects ===\n');
  console.log('This process will generate embeddings for all objects without vectors.');
  console.log('Note: This may take a while and will incur OpenAI API costs.\n');

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
    console.log(`Total documents in collection: ${countResult.totalCount}`);

    // First, count how many objects need vectors
    console.log('\nChecking current vector coverage...');
    const sampleSize = Math.min(1000, countResult.totalCount);
    const sampleResult = await collection.query.fetchObjects({
      limit: sampleSize,
      includeVector: true
    });

    let objectsWithVectors = 0;
    sampleResult.objects.forEach(obj => {
      if (obj.vectors?.default && obj.vectors.default.length > 0) {
        objectsWithVectors++;
      }
    });

    const vectorCoverage = (objectsWithVectors / sampleSize) * 100;
    console.log(`Current vector coverage: ${vectorCoverage.toFixed(1)}% (based on ${sampleSize} samples)`);
    
    const estimatedObjectsNeedingVectors = Math.floor(countResult.totalCount * (1 - vectorCoverage / 100));
    console.log(`Estimated objects needing vectors: ${estimatedObjectsNeedingVectors}`);

    // Ask for confirmation
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const answer = await new Promise(resolve => {
      readline.question(`\nDo you want to proceed with vectorizing ~${estimatedObjectsNeedingVectors} objects? (yes/no): `, resolve);
    });
    readline.close();

    if (answer.toLowerCase() !== 'yes') {
      console.log('Vectorization cancelled.');
      return;
    }

    // Process in batches
    const batchSize = 50; // Smaller batch size to avoid rate limits
    let offset = 0;
    let processedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    const startTime = Date.now();

    console.log('\nStarting vectorization process...\n');

    while (offset < countResult.totalCount) {
      // Fetch batch
      const result = await collection.query.fetchObjects({
        limit: batchSize,
        offset: offset,
        includeVector: true
      });

      if (result.objects.length === 0) break;

      console.log(`\nProcessing batch: ${offset + 1} - ${offset + result.objects.length} of ${countResult.totalCount}`);

      // Process each object in the batch
      for (const obj of result.objects) {
        try {
          // Skip if already has vector
          if (obj.vectors?.default && obj.vectors.default.length > 0) {
            skippedCount++;
            continue;
          }

          // Create text for embedding from title and content
          const title = obj.properties.title || '';
          const content = obj.properties.content || '';
          const textForEmbedding = `${title} ${content}`.trim();
          
          if (!textForEmbedding) {
            console.log(`  Skipping object ${obj.uuid} - no text content`);
            skippedCount++;
            continue;
          }

          // Truncate to avoid token limits (roughly 4 chars per token, 8k tokens max)
          const truncatedText = textForEmbedding.substring(0, 30000);

          // Generate embedding
          const embedding = await generateEmbedding(truncatedText);
          
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
          
          // Progress update
          if (processedCount % 10 === 0) {
            const elapsed = (Date.now() - startTime) / 1000;
            const rate = processedCount / elapsed;
            const remaining = (estimatedObjectsNeedingVectors - processedCount) / rate;
            console.log(`  Progress: ${processedCount} vectorized | Rate: ${rate.toFixed(1)}/sec | Est. time remaining: ${(remaining / 60).toFixed(1)} min`);
          }

          // Rate limiting - OpenAI has rate limits
          await new Promise(resolve => setTimeout(resolve, 200)); // 200ms delay = ~5 requests per second

        } catch (error) {
          console.error(`  Error processing object ${obj.uuid}:`, error.message);
          errorCount++;
          
          // If we hit rate limit, wait longer
          if (error.message.includes('rate')) {
            console.log('  Rate limit hit, waiting 60 seconds...');
            await new Promise(resolve => setTimeout(resolve, 60000));
          }
        }
      }

      offset += batchSize;
    }

    const totalTime = (Date.now() - startTime) / 1000;
    
    console.log(`\n=== Vectorization Complete ===`);
    console.log(`Total time: ${(totalTime / 60).toFixed(1)} minutes`);
    console.log(`Objects vectorized: ${processedCount}`);
    console.log(`Objects skipped (already had vectors): ${skippedCount}`);
    console.log(`Errors: ${errorCount}`);
    console.log(`Average rate: ${(processedCount / totalTime).toFixed(1)} objects/second`);

    // Test the hybrid search
    console.log('\n=== Testing Hybrid Search ===');
    const testVector = await generateEmbedding('software development services');
    
    if (testVector) {
      const hybridResult = await collection.query.hybrid('software development', {
        limit: 5,
        vector: testVector,
        alpha: 0.5,
        returnMetadata: ['score', 'distance']
      });

      console.log(`\nHybrid search results: ${hybridResult.objects.length}`);
      hybridResult.objects.forEach((obj, index) => {
        console.log(`${index + 1}. ${obj.properties.title}`);
        console.log(`   Score: ${obj._additional?.score}, Distance: ${obj._additional?.distance}`);
      });
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the vectorization
vectorizeAllObjects();