# Hybrid Search Implementation

## Overview
The Sources Sought search now uses Weaviate's hybrid search capability, combining:
- **Vector Search**: Semantic similarity using OpenAI embeddings
- **BM25 Search**: Traditional keyword matching

## Configuration

### Vector Embeddings
- Model: OpenAI text-embedding-3-small
- Dimensions: 1536
- Applied to both user profiles and opportunities

### Search Modes

1. **Pure Vector Search** (no query text)
   - Uses only the user's profile embedding
   - Finds opportunities semantically similar to user capabilities
   - Best for discovering relevant opportunities you might not think to search for

2. **Hybrid Search** (with query text)
   - Combines vector similarity with keyword matching
   - Alpha parameter controls the balance:
     - α = 0: Pure vector search
     - α = 0.5: Equal weight (default)
     - α = 1: Pure keyword search

## Match Scoring

### Vector Distance to Percentage
```
Cosine Distance → Similarity → Match %
0.0 (identical) → 1.0 → 100%
1.0 (orthogonal) → 0.5 → 50%
2.0 (opposite) → 0.0 → 0%

Formula: match% = (1 - distance/2) × 100
```

### Score Interpretation
- **80-100%**: Excellent semantic match
- **60-79%**: Good alignment with profile
- **40-59%**: Moderate relevance
- **0-39%**: Low similarity

## API Endpoints

### `/api/sources-sought/hybrid-search`
Performs semantic/hybrid search using user profile embeddings.

Query Parameters:
- `q`: Search query (optional)
- `page`: Page number
- `pageSize`: Results per page
- `type`: Opportunity type filter
- `alpha`: Hybrid search balance (0-1)

Response includes:
- Match percentages for each result
- User profile metadata
- Total results count

## Benefits

1. **Semantic Understanding**: Finds conceptually similar opportunities even with different wording
2. **Keyword Precision**: Still supports exact term matching when needed
3. **Personalized Results**: Automatically tailored to each user's profile
4. **Flexible Search**: Users can influence results with keywords while maintaining personalization

## Usage Tips

1. **For Broad Discovery**: Use without keywords to find all semantically relevant opportunities
2. **For Specific Needs**: Add keywords to narrow down while keeping semantic relevance
3. **Fine-tuning**: Adjust alpha parameter if needed (lower = more semantic, higher = more keyword-based)