const fetch = require('node-fetch');
require('dotenv').config({ path: '.env.local' });

// First, let's check if we can get a user profile with embedding
const { DynamoDBClient, GetItemCommand } = require('@aws-sdk/client-dynamodb');

const dynamoClient = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function getUserProfile(userId) {
  const command = new GetItemCommand({
    TableName: process.env.DYNAMODB_USERS_TABLE,
    Key: {
      userId: { S: userId },
    },
  });

  const response = await dynamoClient.send(command);
  
  if (!response.Item) {
    return null;
  }

  // Parse the DynamoDB item
  const item = response.Item;
  const profile = {
    userId: item.userId?.S,
    email: item.email?.S,
    embedding: item.embedding?.L ? item.embedding.L.map(n => parseFloat(n.N)) : null,
    embeddingModel: item.embeddingModel?.S,
    lastIndexedAt: item.lastIndexedAt?.S,
    documentsIncluded: item.documentsIncluded?.M ? {
      capabilityStatements: parseInt(item.documentsIncluded.M.capabilityStatements?.N || '0'),
      resumes: parseInt(item.documentsIncluded.M.resumes?.N || '0'),
      keyPersonnelBios: parseInt(item.documentsIncluded.M.keyPersonnelBios?.N || '0'),
    } : null,
  };

  return profile;
}

async function testHybridSearchAPI() {
  console.log('=== Testing Hybrid Search API ===\n');

  // We need a real user ID to test - let's check the DynamoDB table
  console.log('1. Checking for test user profiles...');
  
  // For testing, you would need a real user ID from your Auth0 setup
  // For now, let's create a mock test
  console.log('\n2. Creating test embedding...');
  const testEmbedding = new Array(1536).fill(0).map(() => Math.random() * 0.1);
  
  // Test the hybrid search function directly
  const weaviate = require('weaviate-client').default;
  const { ApiKey } = require('weaviate-client');
  
  try {
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

    console.log('\n3. Testing hybrid search with test embedding...');
    
    // Test different alpha values
    const alphaValues = [0.0, 0.5, 1.0];
    
    for (const alpha of alphaValues) {
      console.log(`\nTesting with alpha=${alpha} (${alpha === 0 ? 'pure vector' : alpha === 1 ? 'pure keyword' : 'hybrid'}):`);
      
      try {
        let result;
        const query = 'software development';
        
        if (alpha === 0) {
          // Pure vector search
          result = await collection.query.nearVector(testEmbedding, {
            limit: 3,
            returnMetadata: ['distance', 'certainty']
          });
        } else if (alpha === 1) {
          // Pure keyword search
          result = await collection.query.bm25(query, {
            limit: 3,
            returnMetadata: ['score']
          });
        } else {
          // Hybrid search
          result = await collection.query.hybrid(query, {
            limit: 3,
            vector: testEmbedding,
            alpha: alpha,
            returnMetadata: ['score', 'explainScore', 'distance']
          });
        }
        
        console.log(`Results: ${result.objects.length}`);
        if (result.objects.length > 0) {
          console.log(`First result: ${result.objects[0].properties.title}`);
          console.log(`Metadata:`, result.objects[0]._additional);
        }
      } catch (error) {
        console.log(`Error: ${error.message}`);
      }
    }

    // Check how many objects actually have vectors
    console.log('\n4. Checking vector coverage in database...');
    const sampleSize = 100;
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

    console.log(`\nOut of ${sampleSize} sampled objects:`);
    console.log(`- Objects with vectors: ${objectsWithVectors} (${(objectsWithVectors/sampleSize*100).toFixed(1)}%)`);
    console.log(`- Objects without vectors: ${sampleSize - objectsWithVectors} (${((sampleSize - objectsWithVectors)/sampleSize*100).toFixed(1)}%)`);

  } catch (error) {
    console.error('Error:', error);
  }
}

testHybridSearchAPI();