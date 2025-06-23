# Semantic Search Feature Guide

## Overview
The semantic search feature uses AI-powered vector embeddings to match government contracting opportunities with your company's profile. This provides more intelligent matching than traditional keyword search by understanding the semantic meaning of your company description.

## How It Works

### 1. Profile Indexing
- Your company description is processed using OpenAI's text-embedding-3-small model
- This creates a 1536-dimensional vector representation of your company's capabilities
- The embedding captures semantic meaning from your company profile only, not uploaded documents
- Documents are stored for reference but not included in the matching vector

### 2. Opportunity Matching
- Each government opportunity in the database has its own embedding (also using text-embedding-3-small)
- When you enable "Use Profile Matching", the system:
  - Compares your profile embedding with opportunity embeddings using cosine similarity
  - For keyword searches, combines vector similarity with BM25 keyword matching (hybrid search)
  - Ranks opportunities by relevance to your capabilities

### 3. Match Scoring
Opportunities are scored and color-coded based on vector similarity:
- **80-100%** (Green) - Excellent match, high probability of success
- **60-79%** (Yellow) - Good match, worth pursuing
- **40-59%** (Orange) - Fair match, review requirements carefully
- **0-39%** (Gray) - Weak match, may not align with capabilities

## Using Semantic Search

### 1. Enable Profile Matching
- Toggle "Use Profile Matching" in the search interface
- The system will show when your profile was last indexed

### 2. Understanding Results
Each matched opportunity displays:
- **Match Percentage**: How well the opportunity aligns with your profile
- **Probability Label**: High/Medium/Low/Weak probability of match
- **Match Insights** (hover over info icon): Specific reasons for the match

### 3. Search Summary
When using semantic search, a summary card shows:
- Number of high matches (80%+)
- Number of good matches (60-79%)
- Average match score across all results

## Match Insights
The system analyzes matches based on:
- **Technology alignment**: Matching technical terms and capabilities
- **Service capabilities**: Alignment of service offerings
- **Domain expertise**: Industry and sector experience
- **NAICS codes**: Industry classification matches
- **Agency experience**: Previous work with similar agencies

## Best Practices

### 1. Keep Your Company Description Comprehensive
- Include all key capabilities in your company description
- Mention specific technologies, certifications, and expertise
- List relevant industry experience and past performance
- The company description is the ONLY text used for matching

### 2. Re-index After Updates
- Click "Start Indexing" after updating your company description
- Wait for indexing to complete before searching
- Check the "Last indexed" date to ensure freshness
- Note: Only the company description is indexed for matching

### 3. Combine with Keywords
- Use the search box to add specific keywords
- This creates a hybrid search combining semantic + keyword matching
- Useful for targeting specific technologies or requirements

### 4. Interpret Scores Wisely
- High match % indicates alignment, not guaranteed win
- Review all requirements carefully
- Lower scores may still be viable with the right approach
- Use insights to understand why opportunities match

## Technical Details

### Embedding Model
- **Model**: OpenAI text-embedding-3-small
- **Dimensions**: 1536
- **Distance Metric**: Cosine similarity

### Similarity Calculation
```
Match % = (1 - cosine_distance / 2) × 100
```
Where cosine_distance ranges from 0 (identical) to 2 (opposite)

### Hybrid Search
When keywords are provided:
- Alpha parameter balances vector (0) vs keyword (1) search
- Default alpha = 0.5 (equal weight to both vector similarity and keyword matching)
- Alpha = 0: Pure vector search (semantic similarity only)
- Alpha = 1: Pure keyword search (BM25 only)
- No keywords = Pure vector search based on profile embedding

## Troubleshooting

### No Match Percentages Showing
- Ensure profile is indexed (check Content Indexing page)
- Verify "Use Profile Matching" is enabled
- Check for any API errors in console

### Low Match Scores
- Review and enhance company description
- Upload more relevant documents
- Include specific technologies and capabilities
- Add industry certifications and qualifications

### Indexing Failures
- Check OpenAI API key is valid
- Ensure sufficient API credits
- Verify document formats are supported
- Check file size limits (8MB per document)

## Future Enhancements
- Adjustable similarity thresholds
- Save search preferences
- Email alerts for high matches
- Batch opportunity analysis
- Export matched opportunities