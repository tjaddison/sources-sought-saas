const weaviate = require('weaviate-client').default;
const OpenAI = require('openai');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

async function testSemanticSearch(companyDescription) {
  try {
    console.log('=== SIMPLE SEMANTIC SEARCH TEST ===\n');
    
    // 1. Generate embedding from company description
    console.log('1. Generating embedding from company description...');
    console.log('- Description:', companyDescription.substring(0, 100) + '...\n');
    
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    
    const embeddingResponse = await openai.embeddings.create({
      input: companyDescription,
      model: 'text-embedding-3-small',
    });
    
    const profileEmbedding = embeddingResponse.data[0].embedding;
    console.log('- Generated embedding dimensions:', profileEmbedding.length);
    console.log('- Model used:', embeddingResponse.model);
    
    // 2. Connect to Weaviate
    console.log('\n2. Connecting to Weaviate...');
    const client = await weaviate.connectToWeaviateCloud(
      process.env.WEAVIATE_URL,
      {
        authCredentials: new weaviate.ApiKey(process.env.WEAVIATE_API_KEY),
        headers: { 'X-OpenAI-Api-Key': process.env.OPENAI_API_KEY },
      }
    );
    
    const collectionName = process.env.WEAVIATE_INDEX_NAME || 'SamOopsWeaviateCluster';
    const collection = client.collections.get(collectionName);
    
    // 3. Perform vector search
    console.log('\n3. Performing semantic search...');
    const searchResult = await collection.query.nearVector(profileEmbedding, {
      limit: 5,
      returnMetadata: ['distance', 'certainty'],
    });
    
    console.log(`- Found ${searchResult.objects.length} results\n`);
    
    if (searchResult.objects.length === 0) {
      console.log('❌ No results found!');
      console.log('\nPossible issues:');
      console.log('- Objects in Weaviate don\'t have vectors');
      console.log('- Run: node scripts/add-vectors-to-objects.js');
      return;
    }
    
    // 4. Display results with match percentages
    console.log('TOP SEMANTIC MATCHES:');
    console.log('====================\n');
    
    const matchResults = [];
    
    searchResult.objects.forEach((obj, idx) => {
      // Calculate match percentage from distance
      let matchPercentage = 0;
      
      if (obj.metadata?.distance !== undefined) {
        // Cosine distance: 0 (identical) to 2 (opposite)
        const similarity = 1 - (obj.metadata.distance / 2);
        matchPercentage = Math.round(Math.max(0, similarity * 100));
      }
      
      matchResults.push({
        title: obj.properties.title,
        agency: obj.properties.agency_name,
        type: obj.properties.type,
        noticeId: obj.properties.notice_id,
        distance: obj.metadata?.distance,
        matchPercentage
      });
      
      console.log(`${idx + 1}. ${matchPercentage}% Match`);
      console.log(`   Title: ${obj.properties.title?.substring(0, 70)}...`);
      console.log(`   Agency: ${obj.properties.agency_name}`);
      console.log(`   Type: ${obj.properties.type}`);
      console.log(`   Distance: ${obj.metadata?.distance?.toFixed(4)}`);
      console.log('');
    });
    
    // 5. Return results
    return matchResults;
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.message.includes('dimension')) {
      console.error('\n⚠️  Vector dimension mismatch!');
      console.error('Make sure Weaviate objects use text-embedding-3-small vectors');
    }
  }
}

// Example usage
const exampleDescription = `
We are a software development company specializing in cloud computing, 
artificial intelligence, and cybersecurity solutions for government agencies. 
Our team has extensive experience with AWS, Azure, and Google Cloud platforms. 
We provide custom software development, system integration, and IT consulting services.
We hold ISO 27001 certification and have active security clearances.
Our core competencies include machine learning, data analytics, and secure cloud architecture.
`;

// Get description from command line or use example
const description = process.argv[2] || exampleDescription;

console.log('Running semantic search test...');
console.log('Using OpenAI text-embedding-3-small model\n');

testSemanticSearch(description).then(results => {
  if (results && results.length > 0) {
    console.log('\n✅ Semantic search is working!');
    console.log(`Average match: ${Math.round(results.reduce((sum, r) => sum + r.matchPercentage, 0) / results.length)}%`);
  }
});