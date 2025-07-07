# Semantic Search Workaround

## Issue
The Weaviate collection (`SamOopsWeaviateCluster`) doesn't have vector embeddings for the opportunities, making true vector-based semantic search impossible.

## Current Solution
We've implemented a keyword-based matching system that:

1. **Extracts keywords** from user profile and documents
2. **Uses BM25 search** when keywords are provided
3. **Calculates match percentages** based on keyword similarity
4. **Provides visual feedback** with color-coded match scores

## How It Works

### 1. Keyword Extraction
- Extracts technical terms (software, cloud, data, etc.)
- Identifies service capabilities (consulting, support, etc.)
- Recognizes domain expertise (healthcare, defense, etc.)
- Removes common stop words
- Prioritizes important contracting terms

### 2. Search Process
- When "Use Profile Matching" is enabled:
  - With search query: Uses BM25 search with the query
  - Without query: Extracts keywords from profile and uses them for BM25 search
- Match percentages are calculated based on:
  - BM25 scores (when available)
  - Keyword overlap between profile and opportunity
  - NAICS code matches (20% boost)

### 3. Match Scoring
- **80-100%**: Excellent match (green)
- **60-79%**: Good match (yellow) 
- **40-59%**: Fair match (orange)
- **0-39%**: Weak match (gray)

## Limitations
- Not true semantic similarity (no vector embeddings)
- Relies on keyword matching
- May miss conceptually similar opportunities with different terminology
- Match percentages are approximations

## Permanent Fix Options

### Option 1: Add Vectors to Existing Collection
```javascript
// Process each opportunity to add vectors
for (const opportunity of opportunities) {
  const text = `${opportunity.title} ${opportunity.content}`;
  const embedding = await openai.embeddings.create({
    input: text,
    model: 'text-embedding-ada-002',
  });
  
  await weaviate.data
    .merger()
    .withId(opportunity.id)
    .withVector(embedding.data[0].embedding)
    .do();
}
```

### Option 2: Create New Collection with Vectorizer
```javascript
await client.collections.create({
  name: 'OpportunitiesWithVectors',
  vectorizer: weaviate.configure.vectorizer.text2VecOpenAI({
    model: 'text-embedding-ada-002',
    vectorizeCollectionName: false,
  }),
  properties: [
    // ... property definitions
  ],
});
```

## Testing the Current Solution
1. Navigate to Admin > Sources Sought
2. Enable "Use Profile Matching"
3. Try searching with and without keywords
4. Observe match percentages and color coding
5. Hover over info icons to see match insights

## Performance Considerations
- BM25 search is fast and efficient
- No additional API calls for embeddings
- Works immediately without data migration
- Suitable for production use as a temporary measure