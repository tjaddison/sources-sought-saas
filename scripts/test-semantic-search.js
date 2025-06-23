const fetch = require('node-fetch');

async function testSemanticSearch() {
  const baseUrl = 'http://localhost:3000';
  
  // Test parameters
  const params = new URLSearchParams({
    q: '',  // Empty query to test profile-based search
    page: '1',
    pageSize: '10',
    type: ''
  });
  
  console.log('Testing semantic search with profile matching...\n');
  
  try {
    // Test the hybrid search endpoint
    const response = await fetch(`${baseUrl}/api/sources-sought/hybrid-search?${params}`, {
      headers: {
        // Add any necessary auth headers here if needed
        'Cookie': 'your-auth-cookie-here' // Replace with actual auth cookie
      }
    });
    
    if (!response.ok) {
      const error = await response.text();
      console.error('Error response:', response.status, error);
      return;
    }
    
    const data = await response.json();
    
    console.log('Search Results:');
    console.log('Total results:', data.total);
    console.log('Page:', data.page);
    console.log('Page size:', data.pageSize);
    console.log('Search mode:', data.searchMode);
    
    if (data.userProfile) {
      console.log('\nUser Profile Info:');
      console.log('Last indexed:', data.userProfile.lastIndexedAt);
      console.log('Documents included:', data.userProfile.documentsIncluded);
      console.log('Embedding model:', data.userProfile.embeddingModel);
    }
    
    if (data.items && data.items.length > 0) {
      console.log('\nFirst 3 results with match scores:');
      data.items.slice(0, 3).forEach((item, index) => {
        console.log(`\n${index + 1}. ${item.title}`);
        console.log(`   Notice ID: ${item.notice_id}`);
        console.log(`   Type: ${item.type}`);
        console.log(`   Agency: ${item.agency_name}`);
        console.log(`   Match: ${item.matchPercentage}%`);
      });
    } else {
      console.log('\nNo results found');
    }
    
  } catch (error) {
    console.error('Error testing semantic search:', error);
  }
}

// Note: You'll need to be authenticated to test this endpoint
console.log('NOTE: This test requires authentication. Make sure to:');
console.log('1. Log in to the application at http://localhost:3000');
console.log('2. Copy your auth cookie from browser DevTools');
console.log('3. Replace "your-auth-cookie-here" in the script');
console.log('\nAlternatively, test directly in the browser at:');
console.log('http://localhost:3000/admin/sources-sought');

// Uncomment to run the test
// testSemanticSearch();