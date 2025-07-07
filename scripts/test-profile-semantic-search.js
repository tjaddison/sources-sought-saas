const weaviate = require('weaviate-client').default;
const OpenAI = require('openai');
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand } = require("@aws-sdk/lib-dynamodb");

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// Initialize DynamoDB client
const dynamoClient = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const ddbDocClient = DynamoDBDocumentClient.from(dynamoClient);

async function testProfileSemanticSearch(userId) {
  try {
    console.log('=== PROFILE SEMANTIC SEARCH TEST ===\n');
    
    // 1. Get user profile from DynamoDB
    console.log('1. Fetching user profile...');
    const usersTableName = process.env.DYNAMODB_USERS_TABLE || 'onboarding-users';
    
    const profileResult = await ddbDocClient.send(new GetCommand({
      TableName: usersTableName,
      Key: { userId }
    }));
    
    const userProfile = profileResult.Item;
    if (!userProfile) {
      console.error('User profile not found for userId:', userId);
      return;
    }
    
    console.log('- Company:', userProfile.companyName || 'Not specified');
    console.log('- Description length:', userProfile.companyDescription?.length || 0);
    console.log('- Has existing embedding:', !!userProfile.embedding);
    console.log('- Existing embedding model:', userProfile.embeddingModel || 'None');
    
    // 2. Generate fresh embedding from company description
    if (!userProfile.companyDescription) {
      console.error('No company description found in profile');
      return;
    }
    
    console.log('\n2. Generating fresh embedding from company description...');
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    
    const embeddingResponse = await openai.embeddings.create({
      input: userProfile.companyDescription,
      model: 'text-embedding-3-small',
    });
    
    const profileEmbedding = embeddingResponse.data[0].embedding;
    console.log('- Generated embedding dimensions:', profileEmbedding.length);
    console.log('- First 5 values:', profileEmbedding.slice(0, 5));
    
    // 3. Connect to Weaviate and perform semantic search
    console.log('\n3. Connecting to Weaviate...');
    const client = await weaviate.connectToWeaviateCloud(
      process.env.WEAVIATE_URL,
      {
        authCredentials: new weaviate.ApiKey(process.env.WEAVIATE_API_KEY),
        headers: { 'X-OpenAI-Api-Key': process.env.OPENAI_API_KEY },
      }
    );
    
    const collectionName = process.env.WEAVIATE_INDEX_NAME || 'SamOopsWeaviateCluster';
    const collection = client.collections.get(collectionName);
    console.log('- Collection:', collectionName);
    
    // 4. Perform vector search
    console.log('\n4. Performing semantic search...');
    try {
      const searchResult = await collection.query.nearVector(profileEmbedding, {
        limit: 10,
        returnMetadata: ['distance', 'certainty', 'score'],
      });
      
      console.log(`- Found ${searchResult.objects.length} results\n`);
      
      if (searchResult.objects.length === 0) {
        console.log('No results found. This could mean:');
        console.log('- Objects in Weaviate don\'t have vectors');
        console.log('- Vector dimensions mismatch');
        console.log('- Collection is empty');
        return;
      }
      
      // 5. Calculate and display match percentages
      console.log('TOP 10 SEMANTIC MATCHES:');
      console.log('========================\n');
      
      searchResult.objects.forEach((obj, idx) => {
        // Calculate match percentage from distance
        let matchPercentage = 0;
        
        if (obj.metadata?.distance !== undefined) {
          // Cosine distance: 0 (identical) to 2 (opposite)
          // Convert to similarity percentage
          const similarity = 1 - (obj.metadata.distance / 2);
          matchPercentage = Math.round(Math.max(0, similarity * 100));
        } else if (obj.metadata?.certainty !== undefined) {
          // Certainty: -1 to 1, convert to 0-100%
          matchPercentage = Math.round((obj.metadata.certainty + 1) * 50);
        }
        
        console.log(`${idx + 1}. ${matchPercentage}% Match`);
        console.log(`   Title: ${obj.properties.title?.substring(0, 80)}...`);
        console.log(`   Agency: ${obj.properties.agency_name}`);
        console.log(`   Type: ${obj.properties.type}`);
        console.log(`   Notice ID: ${obj.properties.notice_id}`);
        console.log(`   Distance: ${obj.metadata?.distance?.toFixed(4) || 'N/A'}`);
        console.log(`   Certainty: ${obj.metadata?.certainty?.toFixed(4) || 'N/A'}`);
        console.log(`   Has Vector: ${obj.vector ? 'Yes' : 'No'}`);
        console.log('');
      });
      
      // 6. Summary statistics
      const distances = searchResult.objects
        .map(obj => obj.metadata?.distance)
        .filter(d => d !== undefined);
      
      if (distances.length > 0) {
        const avgDistance = distances.reduce((a, b) => a + b, 0) / distances.length;
        const avgSimilarity = 1 - (avgDistance / 2);
        const avgMatchPercent = Math.round(Math.max(0, avgSimilarity * 100));
        
        console.log('SUMMARY STATISTICS:');
        console.log('==================');
        console.log(`Average Distance: ${avgDistance.toFixed(4)}`);
        console.log(`Average Match: ${avgMatchPercent}%`);
        console.log(`Best Match: ${Math.round(Math.max(0, (1 - distances[0] / 2) * 100))}%`);
        console.log(`Worst Match: ${Math.round(Math.max(0, (1 - distances[distances.length - 1] / 2) * 100))}%`);
      }
      
    } catch (error) {
      console.error('Vector search error:', error.message);
      console.error('This usually means:');
      console.error('- Objects in Weaviate don\'t have vectors');
      console.error('- Vector dimensions mismatch');
      console.error('- Weaviate configuration issue');
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// Get userId from command line or use default
const userId = process.argv[2] || 'google-oauth2|109490343001177541998';

console.log('Testing semantic search with profile embedding');
console.log('User ID:', userId);
console.log('');

testProfileSemanticSearch(userId);