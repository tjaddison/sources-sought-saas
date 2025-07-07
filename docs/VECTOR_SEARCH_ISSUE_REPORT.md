# Vector Search Issue Investigation Report

## Executive Summary

The vector search functionality is returning 0 results because the Weaviate collection `SamOopsWeaviateCluster` has **no vectorizer configured** and the stored objects **do not contain vector embeddings**. This makes vector-based similarity search impossible.

## Findings

### 1. Collection Configuration
- **Collection Name**: `SamOopsWeaviateCluster`
- **Total Objects**: 2,824
- **Vectorizer**: None (❌ Not configured)
- **Vector Embeddings**: None (❌ Objects have empty vectors)

### 2. Current State
- BM25 (keyword) search: ✅ Working
- Vector search: ❌ Not possible without vectors
- Hybrid search: ❌ Requires both BM25 and vectors

### 3. Root Cause
The collection was created without a vectorizer module (e.g., `text2vec-openai`), which means:
- Objects are stored without automatic vector generation
- Vector similarity search cannot function
- The `nearVector` and `hybrid` queries fail

## Solutions

### Option 1: Immediate Fix - Use BM25 Search (Recommended)

Update the search functions to use BM25 keyword search instead of vector search:

```typescript
// Replace vector search with BM25
const result = await collection.query.bm25(query, {
  limit: limit,
  offset: offset,
  returnMetadata: ['score'],
});
```

**Pros**: 
- Works immediately
- No data migration needed
- Good for keyword matching

**Cons**: 
- No semantic similarity
- No user profile matching
- Less sophisticated than vector search

### Option 2: Add Vectors to Existing Objects

Manually generate and add embeddings to each object:

```javascript
// For each object:
const embedding = await openai.embeddings.create({
  model: 'text-embedding-ada-002',
  input: objectText,
});

await collection.data.update({
  id: objectId,
  vectors: embedding.data[0].embedding
});
```

**Pros**: 
- Keeps existing data
- Enables vector search

**Cons**: 
- Requires processing all 2,824 objects
- Time and API cost intensive
- No automatic vectorization for new objects

### Option 3: Create New Collection with Vectorizer

Create a properly configured collection:

```javascript
await client.collections.create({
  name: 'SourcesSoughtVectorized',
  vectorizer: {
    name: 'text2vec-openai',
    config: {
      model: 'ada',
      modelVersion: '002',
    }
  },
  // ... properties
});
```

**Pros**: 
- Automatic vectorization
- Best long-term solution
- Proper vector search support

**Cons**: 
- Requires data migration
- Downtime during migration
- Need to update collection name references

## Recommended Action Plan

### Immediate (Today)
1. **Deploy BM25 search** as a temporary fix
2. Update `hybridSearchWithUserProfile` to use BM25
3. Communicate limitation to users

### Short-term (This Week)
1. Test vector generation on sample data
2. Estimate costs for vectorizing all objects
3. Plan migration strategy

### Long-term (Next Sprint)
1. Create new collection with vectorizer
2. Migrate all data with proper vectors
3. Update application to use new collection
4. Enable full semantic search capabilities

## Code Changes Needed

### 1. Update `/lib/weaviate.ts`

Replace the vector search logic in `hybridSearchWithUserProfile` with BM25:

```typescript
// Use BM25 instead of nearVector
const result = await collection.query.bm25(query || '*', {
  limit: limit,
  offset: offset,
  returnMetadata: ['score'],
  where: typeFilter ? {
    path: ['type'],
    operator: 'Equal',
    valueText: typeFilter
  } : undefined
});
```

### 2. Update Search Endpoints

Modify `/app/api/sources-sought/hybrid-search/route.ts` to handle the lack of vectors gracefully.

### 3. User Communication

Add a notice that semantic search is temporarily using keyword matching.

## Testing

Use the provided test scripts to verify the fix:
- `scripts/test-weaviate-schema.js` - Diagnose issues
- `scripts/check-weaviate-details.js` - Check collection details
- `scripts/fix-weaviate-search.js` - Test BM25 implementation

## Conclusion

The vector search issue is due to a misconfigured Weaviate collection. The immediate fix is to use BM25 keyword search, but the long-term solution requires either adding vectors to existing objects or creating a new collection with proper vectorization enabled.