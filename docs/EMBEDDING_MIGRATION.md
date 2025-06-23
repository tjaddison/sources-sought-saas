# Embedding Model Migration: VoyageAI to OpenAI

## Overview
This document describes the migration from VoyageAI embeddings to OpenAI embeddings for the Sources Sought SaaS application.

## Changes Made

### 1. Embedding Service (`lib/embedding-service.ts`)
- **Before**: Used VoyageAI's `voyage-large-2` model (1024 dimensions)
- **After**: Uses OpenAI's `text-embedding-ada-002` model (1536 dimensions)
- Both single and batch embedding functions updated
- Mock embeddings updated to generate 1536 dimensions

### 2. Dependencies
- **Removed**: `voyageai` package
- **Added**: `openai` package

### 3. Environment Variables
- **Removed**: `VOYAGE_API_KEY`
- **Required**: `OPENAI_API_KEY` (already used for Weaviate)

### 4. Documentation Updates
- Updated `INDEXING_TROUBLESHOOTING.md` to reference OpenAI errors
- Updated `INDEXING_ARCHITECTURE.md` to reference OpenAI embeddings
- Updated `.env.example` to remove VoyageAI configuration

## Benefits of This Change

1. **Compatibility**: User embeddings now match Weaviate's OpenAI embeddings, enabling true semantic search
2. **Single API Key**: Only need one OpenAI API key instead of managing both OpenAI and VoyageAI
3. **Better Integration**: Direct compatibility with the existing Weaviate vector database
4. **Cost Efficiency**: Single billing relationship with OpenAI

## Migration Steps for Existing Users

1. **Update Environment Variables**:
   - Remove `VOYAGE_API_KEY` from `.env.local`
   - Ensure `OPENAI_API_KEY` is set

2. **Re-index User Profiles**:
   - All existing user profiles need to be re-indexed with OpenAI embeddings
   - Navigate to Admin Panel > Content Indexing
   - Click "Start Indexing" to generate new embeddings

3. **Verify Semantic Search**:
   - Test the "Use Profile Matching" feature in Sources Sought search
   - Confirm that match percentages are displayed correctly

## Technical Details

### Embedding Dimensions
- VoyageAI `voyage-large-2`: 1024 dimensions
- OpenAI `text-embedding-ada-002`: 1536 dimensions

### API Response Format
The OpenAI API response format differs slightly from VoyageAI:
- Token usage: `response.usage.total_tokens` (OpenAI) vs `response.usage.totalTokens` (VoyageAI)
- Model name: `response.model` (both APIs)

### Error Handling
Updated error messages to reference OpenAI instead of VoyageAI:
- 401: Invalid OpenAI API key
- 429: OpenAI API rate limit exceeded
- 402: OpenAI API quota exceeded

## Notes
- The mock embedding mode (`MOCK_EMBEDDINGS=true`) continues to work for testing
- All embedding-related functionality remains the same from the user's perspective
- The hybrid search now properly uses vector similarity for matching user profiles to opportunities