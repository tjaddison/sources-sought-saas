import { NextRequest } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth-utils';
import { createDocument } from '@/lib/dynamodb';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

const allowedTypes = ['capability', 'resume', 'proposal'] as const;
const allowedMimeTypes = [
  'application/pdf',
  'application/msword',  
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) ? {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  } : undefined,
});

const bucketName = process.env.S3_BUCKET_NAME || 'onboarding-docs-bucket';

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

    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return Response.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!allowedMimeTypes.includes(file.type)) {
      return Response.json(
        { error: 'Invalid file type. Only PDF, DOC, and DOCX files are allowed.' },
        { status: 400 }
      );
    }

    if (file.size > 25 * 1024 * 1024) {
      return Response.json(
        { error: 'File too large. Maximum size is 25MB.' },
        { status: 400 }
      );
    }

    const documentId = uuidv4();
    const s3Key = `users/${user.userId}/${type}/${documentId}-${file.name}`;
    
    console.log('Generated unique documentId:', documentId);
    console.log('File details:', { userId: user.userId, documentType: type, fileName: file.name });
    
    // Upload file to S3
    try {
      const buffer = Buffer.from(await file.arrayBuffer());
      
      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: s3Key,
        Body: buffer,
        ContentType: file.type,
      });

      console.log('Uploading to S3:', { bucket: bucketName, key: s3Key, size: file.size });
      await s3Client.send(command);
      console.log('S3 upload successful');
      
    } catch (error) {
      console.error('S3 upload error:', error);
      return Response.json(
        { error: 'Failed to upload file to storage' },
        { status: 500 }
      );
    }

    // Create document record in DynamoDB
    const document = await createDocument({
      userId: user.userId,
      documentId,
      documentType: type as 'capability' | 'resume' | 'proposal',
      fileName: file.name,
      s3Key,
      fileSize: file.size,
      mimeType: file.type,
      indexed: false,
      uploadedAt: new Date().toISOString(),
    });

    return Response.json({
      document,
      message: 'File uploaded successfully'
    });
  } catch (error) {
    console.error('Error in upload-direct:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}