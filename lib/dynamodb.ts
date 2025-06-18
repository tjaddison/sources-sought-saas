import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { GetCommand, PutCommand, ScanCommand, QueryCommand, DeleteCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

// Ensure environment variables are set
const region = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

if (!region || !accessKeyId || !secretAccessKey) {
  // In production, rely on IAM roles or instance profiles.
  // For local dev, these env vars are needed.
  if (process.env.NODE_ENV !== 'production') {
    console.warn(
      "AWS credentials or region not fully configured via environment variables. " +
      "Ensure AWS_REGION, AWS_ACCESS_KEY_ID, and AWS_SECRET_ACCESS_KEY are set for local development, " +
      "or rely on IAM roles/profiles in production."
    );
  }
}

const clientConfig = {
  region: region,
  // Only provide credentials explicitly if they are set in the environment
  // In production (e.g., Lambda, EC2 with IAM role), the SDK automatically uses the role's credentials
  credentials: (accessKeyId && secretAccessKey) ? {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
  } : undefined,
};

const client = new DynamoDBClient(clientConfig);

const marshallOptions = {
  // Whether to automatically convert empty strings, blobs, and sets to `null`.
  convertEmptyValues: false, // false, by default.
  // Whether to remove undefined values while marshalling.
  removeUndefinedValues: true, // false, by default.
  // Whether to convert typeof object to map attribute.
  convertClassInstanceToMap: false, // false, by default.
};

const unmarshallOptions = {
  // Whether to return numbers as strings instead of converting them to native JavaScript numbers.
  wrapNumbers: false, // false, by default.
};

const translateConfig = { marshallOptions, unmarshallOptions };

// Create the DynamoDB Document client.
const ddbDocClient = DynamoDBDocumentClient.from(client, translateConfig);

// Table names from environment
const usersTableName = process.env.DYNAMODB_USERS_TABLE || 'onboarding-users';
const documentsTableName = process.env.DYNAMODB_DOCUMENTS_TABLE || 'onboarding-documents';
const indexingJobsTableName = process.env.DYNAMODB_INDEXING_JOBS_TABLE || 'onboarding-indexing-jobs';

// User Profile Functions
export interface UserProfile {
  userId: string;
  email: string;
  companyDescription?: string;
  companyWebsite?: string;
  onboardingCompleted: boolean;
  onboardingSkipped: boolean;
  createdAt: string;
  updatedAt: string;
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  if (!userId) throw new Error("User ID is required");

  const params = {
    TableName: usersTableName,
    Key: { userId }
  };

  try {
    const data = await ddbDocClient.send(new GetCommand(params));
    return data.Item as UserProfile || null;
  } catch (error) {
    console.error("Error getting user profile:", error);
    throw new Error("Could not fetch user profile");
  }
}

export async function createOrUpdateUserProfile(profile: Partial<UserProfile> & { userId: string }): Promise<UserProfile> {
  const timestamp = new Date().toISOString();
  
  const item: UserProfile = {
    userId: profile.userId,
    email: profile.email || '',
    companyDescription: profile.companyDescription || '',
    companyWebsite: profile.companyWebsite || '',
    onboardingCompleted: profile.onboardingCompleted ?? false,
    onboardingSkipped: profile.onboardingSkipped ?? false,
    createdAt: profile.createdAt || timestamp,
    updatedAt: timestamp
  };

  const params = {
    TableName: usersTableName,
    Item: item
  };

  try {
    await ddbDocClient.send(new PutCommand(params));
    return item;
  } catch (error) {
    console.error("Error creating/updating user profile:", error);
    throw new Error("Could not save user profile");
  }
}

// Document Functions
export interface Document {
  userId: string;
  documentId: string;
  documentType: 'capability' | 'resume' | 'proposal';
  fileName: string;
  s3Key: string;
  fileSize: number;
  mimeType: string;
  indexed: boolean;
  uploadedAt: string;
}

export async function getAllDocumentsForUser(userId: string): Promise<Document[]> {
  if (!userId) throw new Error("User ID is required");

  console.log('Fetching all documents for user:', { userId, tableName: documentsTableName });

  // Since we're using composite keys, we need to scan with a filter
  const params = {
    TableName: documentsTableName,
    FilterExpression: "originalUserId = :userId",
    ExpressionAttributeValues: {
      ":userId": userId
    }
  };

  try {
    const data = await ddbDocClient.send(new ScanCommand(params));
    console.log(`Found ${data.Items?.length || 0} total documents for user ${userId}`);
    
    // Transform items back to original structure
    const documents = (data.Items || []).map(item => {
      const { originalUserId, ...rest } = item;
      return {
        ...rest,
        userId: originalUserId || userId // Restore original userId
      };
    });
    
    return documents as Document[];
  } catch (error) {
    console.error("Error getting documents:", error);
    throw new Error("Could not fetch documents");
  }
}

export async function getDocumentsByUserId(userId: string): Promise<Document[]> {
  if (!userId) throw new Error("User ID is required");

  console.log('Fetching all documents for user:', { userId, tableName: documentsTableName });

  // Since we're using composite keys, we need to scan with a filter
  const params = {
    TableName: documentsTableName,
    FilterExpression: "originalUserId = :userId",
    ExpressionAttributeValues: {
      ":userId": userId
    }
  };

  try {
    const data = await ddbDocClient.send(new ScanCommand(params));
    console.log(`Found ${data.Items?.length || 0} documents for user ${userId}`);
    
    // Transform items back to original structure
    const documents = (data.Items || []).map(item => {
      const { originalUserId, ...rest } = item;
      return {
        ...rest,
        userId: originalUserId || userId // Restore original userId
      };
    });
    
    return documents as Document[];
  } catch (error) {
    console.error("Error getting documents:", error);
    throw new Error("Could not fetch documents");
  }
}

export async function getDocumentsByType(userId: string, documentType: string): Promise<Document[]> {
  if (!userId || !documentType) throw new Error("User ID and document type are required");

  console.log('Fetching documents:', { userId, documentType, tableName: documentsTableName });

  // Since we're using composite keys, we need to scan with a filter
  const params = {
    TableName: documentsTableName,
    FilterExpression: "originalUserId = :userId AND documentType = :documentType",
    ExpressionAttributeValues: {
      ":userId": userId,
      ":documentType": documentType
    }
  };

  try {
    const data = await ddbDocClient.send(new ScanCommand(params));
    console.log(`Found ${data.Items?.length || 0} documents of type ${documentType} for user ${userId}`);
    
    // Transform items back to original structure
    const documents = (data.Items || []).map(item => {
      const { originalUserId, ...rest } = item;
      return {
        ...rest,
        userId: originalUserId || userId // Restore original userId
      };
    });
    
    return documents as Document[];
  } catch (error) {
    console.error("Error getting documents:", error);
    throw new Error("Could not fetch documents");
  }
}

export async function createDocument(document: Document): Promise<Document> {
  console.log('Creating document in DynamoDB:', {
    userId: document.userId,
    documentId: document.documentId,
    documentType: document.documentType,
    fileName: document.fileName,
    tableName: documentsTableName
  });
  
  // Since the table only has userId as the primary key, we need to use a composite key
  // Store the original userId in a separate field and use userId#documentId as the key
  const itemToStore = {
    ...document,
    userId: `${document.userId}#${document.documentId}`, // Composite key
    originalUserId: document.userId // Store original userId for queries
  };
  
  const params = {
    TableName: documentsTableName,
    Item: itemToStore
  };

  try {
    await ddbDocClient.send(new PutCommand(params));
    console.log('Document created successfully:', document.documentId);
    return document; // Return original document structure
  } catch (error) {
    console.error("Error creating document:", error);
    throw new Error("Could not save document");
  }
}

export async function deleteDocument(userId: string, documentId: string): Promise<void> {
  // Use composite key for deletion
  const params = {
    TableName: documentsTableName,
    Key: { userId: `${userId}#${documentId}` }
  };

  try {
    await ddbDocClient.send(new DeleteCommand(params));
  } catch (error) {
    console.error("Error deleting document:", error);
    throw new Error("Could not delete document");
  }
}

// Indexing Job Functions
export interface IndexingJob {
  userId: string;
  jobId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  startedAt: string;
  completedAt?: string;
  documentsProcessed?: number;
  error?: string;
}

export async function createIndexingJob(job: IndexingJob): Promise<IndexingJob> {
  // Ensure the job has both userId and jobId
  if (!job.userId || !job.jobId) {
    throw new Error("Both userId and jobId are required for indexing job");
  }
  
  // Since the table only has userId as key, we'll store the composite key as userId#jobId
  const itemToStore = {
    ...job,
    userId: `${job.userId}#${job.jobId}`, // Composite key
    originalUserId: job.userId // Store original userId for queries
  };
  
  const params = {
    TableName: indexingJobsTableName,
    Item: itemToStore
  };

  try {
    await ddbDocClient.send(new PutCommand(params));
    console.log('Indexing job created:', { userId: job.userId, jobId: job.jobId });
    return job; // Return original structure
  } catch (error) {
    console.error("Error creating indexing job:", error);
    throw new Error("Could not create indexing job");
  }
}

export async function getIndexingJobHistory(userId: string): Promise<IndexingJob[]> {
  // Since we're using composite keys, we need to scan with a filter
  const params = {
    TableName: indexingJobsTableName,
    FilterExpression: "originalUserId = :userId",
    ExpressionAttributeValues: {
      ":userId": userId
    }
  };

  try {
    const data = await ddbDocClient.send(new ScanCommand(params));
    
    // Transform items back to original structure
    const jobs = (data.Items || []).map(item => {
      const { originalUserId, ...rest } = item;
      return {
        ...rest,
        userId: originalUserId || userId // Restore original userId
      } as IndexingJob;
    });
    
    // Sort by startedAt descending (most recent first)
    jobs.sort((a, b) => {
      const dateA = new Date(a.startedAt).getTime();
      const dateB = new Date(b.startedAt).getTime();
      return dateB - dateA;
    });
    
    return jobs;
  } catch (error) {
    console.error("Error getting indexing job history:", error);
    throw new Error("Could not fetch indexing job history");
  }
}

export async function updateIndexingJob(userId: string, jobId: string, updates: Partial<IndexingJob>): Promise<void> {
  console.log('Updating indexing job:', { userId, jobId, updates });
  
  const updateExpressions: string[] = [];
  const expressionAttributeNames: Record<string, string> = {};
  const expressionAttributeValues: Record<string, any> = {};

  Object.entries(updates).forEach(([key, value]) => {
    if (value !== undefined && key !== 'userId' && key !== 'jobId' && key !== 'originalUserId') {
      updateExpressions.push(`#${key} = :${key}`);
      expressionAttributeNames[`#${key}`] = key;
      expressionAttributeValues[`:${key}`] = value;
    }
  });

  if (updateExpressions.length === 0) return;

  // Use composite key for update
  const params = {
    TableName: indexingJobsTableName,
    Key: { userId: `${userId}#${jobId}` }, // Composite key matching what we stored
    UpdateExpression: `SET ${updateExpressions.join(', ')}`,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
  };

  console.log('UpdateCommand params:', JSON.stringify(params, null, 2));

  try {
    await ddbDocClient.send(new UpdateCommand(params));
    console.log('Indexing job updated successfully');
  } catch (error) {
    console.error("Error updating indexing job:", error);
    throw new Error("Could not update indexing job");
  }
}

// User Profile Embedding Functions
export interface UserEmbedding {
  userId: string;
  embedding: number[];
  embeddingModel: string;
  lastIndexedAt: string;
  documentsIncluded: number;
  tokensUsed: number;
}

export async function updateUserEmbedding(embedding: UserEmbedding): Promise<void> {
  const params = {
    TableName: usersTableName,
    Key: { userId: embedding.userId },
    UpdateExpression: `SET embedding = :embedding, 
                          embeddingModel = :embeddingModel, 
                          lastIndexedAt = :lastIndexedAt,
                          documentsIncluded = :documentsIncluded,
                          tokensUsed = :tokensUsed`,
    ExpressionAttributeValues: {
      ':embedding': embedding.embedding,
      ':embeddingModel': embedding.embeddingModel,
      ':lastIndexedAt': embedding.lastIndexedAt,
      ':documentsIncluded': embedding.documentsIncluded,
      ':tokensUsed': embedding.tokensUsed,
    },
  };

  try {
    await ddbDocClient.send(new UpdateCommand(params));
  } catch (error) {
    console.error("Error updating user embedding:", error);
    throw new Error("Could not update user embedding");
  }
}

export async function markDocumentsAsIndexed(userId: string, documentIds: string[]): Promise<void> {
  const updatePromises = documentIds.map(async (documentId) => {
    const params = {
      TableName: documentsTableName,
      Key: { userId: `${userId}#${documentId}` },
      UpdateExpression: 'SET #indexed = :indexed',
      ExpressionAttributeNames: {
        '#indexed': 'indexed'
      },
      ExpressionAttributeValues: {
        ':indexed': true,
      },
    };

    return ddbDocClient.send(new UpdateCommand(params));
  });

  try {
    await Promise.all(updatePromises);
    console.log(`Marked ${documentIds.length} documents as indexed`);
  } catch (error) {
    console.error("Error marking documents as indexed:", error);
    throw new Error("Could not mark documents as indexed");
  }
}

// Generic utility functions for backwards compatibility
export async function scanTable(tableName?: string): Promise<Record<string, unknown>[]> {
  const params = {
    TableName: tableName || 'waitlist' // Default table for backward compatibility
  };

  try {
    const data = await ddbDocClient.send(new ScanCommand(params));
    return data.Items || [];
  } catch (error) {
    console.error("Error scanning table:", error);
    throw new Error("Could not scan table");
  }
}

export async function putItem(item: Record<string, unknown>, tableName?: string): Promise<Record<string, unknown>> {
  const params = {
    TableName: tableName || 'waitlist', // Default table for backward compatibility
    Item: item
  };

  try {
    await ddbDocClient.send(new PutCommand(params));
    return item;
  } catch (error) {
    console.error("Error putting item:", error);
    throw new Error("Could not save item");
  }
}

export async function getItemById(id: string, tableName?: string): Promise<Record<string, unknown> | null> {
  const params = {
    TableName: tableName || 'waitlist', // Default table for backward compatibility
    Key: { id }
  };

  try {
    const data = await ddbDocClient.send(new GetCommand(params));
    return data.Item || null;
  } catch (error) {
    console.error("Error getting item by ID:", error);
    throw new Error("Could not fetch item");
  }
}

export { ddbDocClient }; 