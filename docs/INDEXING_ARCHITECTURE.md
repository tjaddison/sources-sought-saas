# Content Indexing Architecture

## Overview

The content indexing system processes user documents and company information to generate searchable embeddings for semantic matching with contract opportunities.

## Components

### 1. Document Extraction (`lib/document-extractor.ts`)
- Extracts text from various document formats:
  - PDF files using `pdf-parse`
  - Word documents (.docx) using `mammoth`
  - Plain text files
- Retrieves documents from S3 storage
- Implements text truncation to manage token limits

### 2. Embedding Generation (`lib/embedding-service.ts`)
- Uses OpenAI's `text-embedding-ada-002` model
- Combines company description with document content
- Generates 1536-dimensional embeddings for semantic search
- Supports batch processing for efficiency
- Includes mock mode for testing without API credits

### 3. Indexing Processor (`lib/indexing-processor.ts`)
- Orchestrates the entire indexing workflow
- Handles job status updates
- Manages error handling and recovery
- Marks documents as indexed upon completion

### 4. Database Storage
- **User Profiles**: Stores embeddings directly in user records
- **Documents**: Tracks indexing status for each document
- **Indexing Jobs**: Maintains job history and status

## Workflow

1. User clicks "Start Content Indexing" button
2. API creates a new indexing job with "pending" status
3. Background processor is triggered (async in dev, queue-based in production)
4. Processor:
   - Updates job status to "processing"
   - Retrieves user profile and documents
   - Extracts text from each document
   - Combines all text content
   - Generates embedding
   - Stores embedding in user profile
   - Marks documents as indexed
   - Updates job status to "completed" or "failed"

## API Endpoints

### POST `/api/indexing/start`
Initiates a new indexing job for the authenticated user.

### POST `/api/indexing/process`
Processes a specific indexing job (called by background worker).

### GET `/api/indexing/status`
Returns the current indexing status and job history.

### GET `/api/indexing/history`
Returns the complete indexing job history for a user.

## Environment Variables

```env
# OpenAI API Key for embedding generation
OPENAI_API_KEY=your-openai-api-key

# DynamoDB table names
DYNAMODB_USERS_TABLE=onboarding-users
DYNAMODB_DOCUMENTS_TABLE=onboarding-documents
DYNAMODB_INDEXING_JOBS_TABLE=onboarding-indexing-jobs

# S3 bucket for document storage
S3_BUCKET_NAME=your-s3-bucket-name

# Mock embeddings for testing (set to 'true' to test without API)
MOCK_EMBEDDINGS=false
```

## Production Considerations

### Background Processing
In production, replace the setTimeout-based processing with:
- AWS Lambda triggered by SQS/SNS
- Dedicated job queue (Bull, Bee-Queue)
- Serverless function with queue integration

### Scaling
- Implement rate limiting for OpenAI API calls
- Use batch embedding generation for multiple documents
- Consider caching embeddings for unchanged documents

### Error Handling
- Implement retry logic for transient failures
- Log failed documents for manual review
- Monitor job processing times and success rates

### Security
- Secure the `/api/indexing/process` endpoint
- Implement request signing for background workers
- Ensure proper IAM roles for S3 and DynamoDB access

## Future Enhancements

1. **Incremental Indexing**: Only process new or modified documents
2. **Document Chunking**: Split large documents for better embedding quality
3. **Multi-model Support**: Allow different embedding models
4. **Real-time Updates**: WebSocket notifications for job progress
5. **Embedding Versions**: Track model versions for re-indexing