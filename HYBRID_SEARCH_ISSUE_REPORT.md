# Hybrid Search Issue Report

## Problem Summary
The hybrid search is returning no results because **99% of the objects in Weaviate do not have vector embeddings**. The hybrid search requires vectors to perform similarity matching with the user's profile embedding.

## Root Cause Analysis

1. **Weaviate Configuration**: The collection is configured with `vectorizer: "none"`, meaning Weaviate doesn't automatically generate vectors when objects are inserted.

2. **Current State**: 
   - Total documents: 1,863
   - Documents with vectors: ~18 (1%)
   - Documents without vectors: ~1,845 (99%)

3. **Search Behavior**:
   - When `alpha=0` (pure vector search): Returns only the 1% of documents that have vectors
   - When `alpha=0.5` (hybrid): Falls back mostly to keyword search due to lack of vectors
   - When `alpha=1` (pure keyword): Works normally with BM25 text search

## Why This Happened
The Weaviate collection was likely populated with data before vectors were generated, or the import process didn't include vector generation.

## Solutions

### Option 1: Generate Vectors for All Objects (Recommended)
Run the vectorization script to generate embeddings for all objects:

```bash
node scripts/vectorize-all-objects.js
```

**Pros:**
- Enables true hybrid search combining semantic similarity and keyword matching
- Better matching with user profiles
- Improved search relevance

**Cons:**
- Takes time (~30-60 minutes for 1,863 documents)
- Incurs OpenAI API costs (~$0.10-0.20 for embeddings)
- Requires one-time processing

### Option 2: Use Pure Keyword Search (Quick Fix)
Temporarily set `alpha=1.0` in the hybrid search to use only keyword search:

```javascript
// In app/api/sources-sought/hybrid-search/route.ts
const alpha = parseFloat(searchParams.get('alpha') || '1.0'); // Changed from 0.5
```

**Pros:**
- Immediate fix
- No additional costs
- Works with current data

**Cons:**
- Loses semantic search capabilities
- No personalization based on user profile
- Not utilizing the full potential of the system

### Option 3: Configure Weaviate Auto-Vectorization
Update Weaviate schema to use OpenAI vectorizer for automatic embedding generation:

**Pros:**
- Automatic vector generation for new data
- No manual processing needed

**Cons:**
- Requires schema migration
- Still need to vectorize existing data
- Ongoing API costs for new data

## Immediate Actions

1. **For Testing**: Run a small vectorization test:
   ```bash
   node scripts/test-add-single-vector.js
   ```

2. **For Production**: Choose one of the solutions above based on your priorities:
   - If you need hybrid search working ASAP: Run the full vectorization (Option 1)
   - If you need search working now: Switch to keyword-only search (Option 2)
   - If you're planning long-term: Implement auto-vectorization (Option 3)

## Verification
After implementing a solution, verify it works:

```bash
node scripts/debug-hybrid-search.js
```

This will show:
- Vector coverage percentage
- Search results for different alpha values
- Confirmation that hybrid search is working

## Cost Estimation
- OpenAI text-embedding-ada-002: $0.0001 per 1,000 tokens
- Average document: ~500-1000 tokens
- Total cost for 1,863 documents: ~$0.10-0.20

## Timeline
- Small test (10 documents): ~1 minute
- Full vectorization (1,863 documents): ~30-60 minutes
- Keyword-only fix: Immediate