import { 
  getUserProfile, 
  getDocumentsByUserId, 
  updateIndexingJob, 
  updateUserEmbedding,
  markDocumentsAsIndexed,
  getIndexingJobHistory,
  IndexingJob 
} from './dynamodb';
import { extractTextFromDocument, truncateText } from './document-extractor';
import { generateEmbedding, combineTextsForIndexing } from './embedding-service';

export async function processIndexingJob(userId: string, jobId: string): Promise<void> {
  console.log(`Starting indexing job ${jobId} for user ${userId}`);
  
  try {
    // Update job status to processing
    await updateIndexingJob(userId, jobId, {
      status: 'processing',
    });

    // Get user profile for company description
    const userProfile = await getUserProfile(userId);
    if (!userProfile) {
      throw new Error('User profile not found');
    }

    // Get all documents for the user
    const documents = await getDocumentsByUserId(userId);
    
    if (documents.length === 0 && !userProfile.companyDescription) {
      throw new Error('No documents or company description to index');
    }

    console.log(`Found ${documents.length} documents to index`);

    // Extract text from each document
    const documentTexts: Array<{ type: string; text: string; documentId: string }> = [];
    const failedDocuments: string[] = [];

    for (const doc of documents) {
      try {
        console.log(`Extracting text from ${doc.fileName} (${doc.documentType})`);
        const text = await extractTextFromDocument(doc.s3Key, doc.mimeType);
        const truncatedText = truncateText(text);
        
        documentTexts.push({
          type: doc.documentType,
          text: truncatedText,
          documentId: doc.documentId,
        });
      } catch (error) {
        console.error(`Failed to extract text from document ${doc.documentId}:`, error);
        failedDocuments.push(doc.documentId);
      }
    }

    if (documentTexts.length === 0 && !userProfile.companyDescription) {
      throw new Error('Failed to extract text from any documents');
    }

    // Combine all texts for indexing
    const combinedText = combineTextsForIndexing(
      userProfile.companyDescription || '',
      documentTexts
    );

    console.log('Generating embedding for combined text');

    // Generate embedding for the combined text
    const embeddingResult = await generateEmbedding(combinedText);

    // Store embedding in user profile
    await updateUserEmbedding({
      userId,
      embedding: embeddingResult.embedding,
      embeddingModel: embeddingResult.model,
      lastIndexedAt: new Date().toISOString(),
      documentsIncluded: documentTexts.length,
      tokensUsed: embeddingResult.tokensUsed,
    });

    // Mark successfully processed documents as indexed
    const successfulDocumentIds = documentTexts.map(dt => dt.documentId);
    if (successfulDocumentIds.length > 0) {
      await markDocumentsAsIndexed(userId, successfulDocumentIds);
    }

    // Update job status to completed
    await updateIndexingJob(userId, jobId, {
      status: 'completed',
      completedAt: new Date().toISOString(),
      documentsProcessed: documentTexts.length,
    });

    console.log(`Indexing job ${jobId} completed successfully`);
  } catch (error) {
    console.error(`Indexing job ${jobId} failed:`, error);
    
    // Update job status to failed
    await updateIndexingJob(userId, jobId, {
      status: 'failed',
      completedAt: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    throw error;
  }
}

export async function checkIndexingJobStatus(userId: string, jobId: string): Promise<IndexingJob | null> {
  try {
    const jobs = await getIndexingJobHistory(userId);
    return jobs.find(job => job.jobId === jobId) || null;
  } catch (error) {
    console.error('Error checking indexing job status:', error);
    return null;
  }
}