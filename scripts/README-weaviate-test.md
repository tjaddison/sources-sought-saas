# Weaviate Schema Test Script

This script helps diagnose issues with vector search in Weaviate by:

1. **Checking Collection Configuration**: Verifies the collection exists and shows its vectorization settings
2. **Counting Objects**: Shows total number of objects in the collection
3. **Checking Vector Embeddings**: Examines sample objects to see if they have vector embeddings
4. **Testing Vector Search**: Attempts a vector search with a test vector
5. **Testing Hybrid Search**: Tests combining vector and keyword search
6. **Testing Keyword Search**: Tests text-based search functionality

## Usage

```bash
node scripts/test-weaviate-schema.js
```

## Common Issues and Solutions

### Issue: Vector search returns 0 results

**Possible causes:**
1. **No vectors in data**: Objects may not have been vectorized
2. **Dimension mismatch**: User embeddings have different dimensions than indexed vectors
3. **Wrong collection name**: Check WEAVIATE_INDEX_NAME environment variable
4. **Vectorizer not configured**: Collection may not have a vectorizer module enabled

### Issue: Hybrid search fails

**Possible causes:**
1. **No text2vec module**: Weaviate needs a text2vec module for keyword search
2. **API key issues**: OpenAI API key may be missing for text2vec-openai

### Required Environment Variables

- `WEAVIATE_URL`: Weaviate cluster URL
- `WEAVIATE_API_KEY`: Weaviate API key
- `WEAVIATE_INDEX_NAME`: Collection name (defaults to 'SamOopsWeaviateCluster')
- `OPENAI_API_KEY`: OpenAI API key (if using text2vec-openai)

## Output Interpretation

The script will show:
- ✓ for successful operations
- ✗ for failed operations or missing features
- Detailed information about vectors, dimensions, and search results

Look for:
- Whether vectors are enabled in the collection configuration
- The vector dimensions (e.g., 1536 for OpenAI ada-002)
- Whether existing objects have vector embeddings
- Whether vector/hybrid searches return results