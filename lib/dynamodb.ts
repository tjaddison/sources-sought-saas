import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { GetCommand, PutCommand, ScanCommand, QueryCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";

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

export async function getDocumentsByType(userId: string, documentType: string): Promise<Document[]> {
  if (!userId || !documentType) throw new Error("User ID and document type are required");

  const params = {
    TableName: documentsTableName,
    KeyConditionExpression: "userId = :userId",
    FilterExpression: "documentType = :documentType",
    ExpressionAttributeValues: {
      ":userId": userId,
      ":documentType": documentType
    }
  };

  try {
    const data = await ddbDocClient.send(new QueryCommand(params));
    return data.Items as Document[] || [];
  } catch (error) {
    console.error("Error getting documents:", error);
    throw new Error("Could not fetch documents");
  }
}

export async function createDocument(document: Document): Promise<Document> {
  const params = {
    TableName: documentsTableName,
    Item: document
  };

  try {
    await ddbDocClient.send(new PutCommand(params));
    return document;
  } catch (error) {
    console.error("Error creating document:", error);
    throw new Error("Could not save document");
  }
}

export async function deleteDocument(userId: string, documentId: string): Promise<void> {
  const params = {
    TableName: documentsTableName,
    Key: { userId, documentId }
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
  const params = {
    TableName: indexingJobsTableName,
    Item: job
  };

  try {
    await ddbDocClient.send(new PutCommand(params));
    return job;
  } catch (error) {
    console.error("Error creating indexing job:", error);
    throw new Error("Could not create indexing job");
  }
}

export async function getIndexingJobHistory(userId: string): Promise<IndexingJob[]> {
  const params = {
    TableName: indexingJobsTableName,
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": userId
    },
    ScanIndexForward: false // Most recent first
  };

  try {
    const data = await ddbDocClient.send(new QueryCommand(params));
    return data.Items as IndexingJob[] || [];
  } catch (error) {
    console.error("Error getting indexing job history:", error);
    throw new Error("Could not fetch indexing job history");
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