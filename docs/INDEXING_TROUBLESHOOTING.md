# Content Indexing Troubleshooting Guide

## Common Issues and Solutions

### 1. Voyage AI API Errors

**Error**: `401 Invalid Voyage AI API key`
**Solution**:
1. Sign up for a Voyage AI account at https://www.voyageai.com/
2. Get your API key from the dashboard
3. Add `VOYAGE_API_KEY=your-key` to your `.env.local` file

**Error**: `429 Voyage AI API rate limit exceeded`
**Solution**:
1. Wait a few minutes and try again
2. Consider upgrading your Voyage AI plan for higher rate limits
3. For testing without API calls, set `MOCK_EMBEDDINGS=true` in your `.env.local` file

**Error**: `402 Voyage AI API quota exceeded`
**Solution**:
1. Check your Voyage AI account billing
2. Add credits or upgrade your plan
3. For testing, use `MOCK_EMBEDDINGS=true`

### 2. PDF Extraction Issues

**Issue**: PDF text extraction may not work perfectly for all PDF types

**Current Implementation**:
- Basic PDF text extraction without external dependencies
- Works for most standard PDFs with embedded text
- May not work for scanned PDFs or complex layouts

**Future Improvements**:
- Consider using a more robust PDF library when pdf-parse issues are resolved
- Add OCR support for scanned PDFs

### 3. Legacy .doc Format Not Supported

**Error**: `Legacy .doc format not supported - please upload as .docx`

**Solution**:
- Convert .doc files to .docx format before uploading
- Only .docx files are supported for Word documents

### 4. DynamoDB Table Structure

**Issue**: The indexing jobs table was created with only a partition key, not a composite key

**Current Workaround**:
- Using a composite key pattern (`userId#jobId`) stored in the partition key
- This allows the existing table structure to work without recreation

**To Fix Permanently**:
Run the table recreation script:
```bash
node scripts/fix-indexing-table.js
```

## Testing Without Voyage AI

To test the indexing system without using Voyage AI credits:

1. Add to your `.env.local`:
```env
MOCK_EMBEDDINGS=true
```

2. The system will generate mock embeddings for testing
3. These mock embeddings won't provide real semantic search capabilities but allow testing the workflow

## Debugging Tips

1. **Check Logs**: The indexing processor logs detailed information about each step
2. **Verify S3 Access**: Ensure your AWS credentials have proper S3 permissions
3. **Document Formats**: Verify uploaded documents are in supported formats (PDF, DOCX, TXT)
4. **Table Structure**: Use `node scripts/check-dynamodb-tables.js` to verify table schemas

## Supported File Types

- **PDF** (.pdf) - Basic text extraction
- **Word** (.docx) - Full support via mammoth
- **Text** (.txt) - Direct text reading
- **Not Supported**: .doc (legacy Word), scanned PDFs without OCR

## Performance Considerations

- Large documents are automatically truncated to ~8000 tokens
- Batch processing multiple small documents is more efficient than single large documents
- Consider implementing document chunking for very large documents