import { NextRequest } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth-utils';
import { createDocument } from '@/lib/dynamodb';
import { generateUploadUrl } from '@/lib/s3';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

// Use Node.js runtime for AWS SDK compatibility
export const runtime = 'nodejs';

const uploadRequestSchema = z.object({
  fileName: z.string().min(1).max(255),
  fileSize: z.number().min(1).max(25 * 1024 * 1024), // 25MB max
  contentType: z.string().min(1),
});

const allowedTypes = ['capability', 'resume', 'proposal'] as const;
const allowedMimeTypes = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

export async function POST(req: NextRequest, { params }: { params: Promise<{ type: string }> }) {
  try {
    const user = await getAuthenticatedUser(req);
    
    if (!user) {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { type } = await params;
    
    if (!allowedTypes.includes(type as typeof allowedTypes[number])) {
      return Response.json(
        { error: 'Invalid document type' },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { fileName, fileSize, contentType } = uploadRequestSchema.parse(body);

    if (!allowedMimeTypes.includes(contentType)) {
      return Response.json(
        { error: 'Invalid file type. Only PDF, DOC, and DOCX files are allowed.' },
        { status: 400 }
      );
    }

    const documentId = uuidv4();
    
    // Generate S3 upload URL
    let uploadUrl, s3Key;
    try {
      const result = await generateUploadUrl(
        user.userId,
        type,
        documentId,
        fileName,
        contentType
      );
      uploadUrl = result.uploadUrl;
      s3Key = result.s3Key;
    } catch (error) {
      console.error('Failed to generate S3 upload URL:', error);
      return Response.json(
        { error: 'Failed to generate upload URL. Please check S3 configuration.' },
        { status: 500 }
      );
    }

    // Create document record in DynamoDB
    const document = await createDocument({
      userId: user.userId,
      documentId,
      documentType: type as 'capability' | 'resume' | 'proposal',
      fileName,
      s3Key,
      fileSize,
      mimeType: contentType,
      indexed: false,
      uploadedAt: new Date().toISOString(),
    });

    return Response.json({
      document,
      uploadUrl,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Error creating upload URL:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}