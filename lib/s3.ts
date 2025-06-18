import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';

const region = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const clientConfig = {
  region: region,
  credentials: (accessKeyId && secretAccessKey) ? {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
  } : undefined,
};

const s3Client = new S3Client(clientConfig);

const bucketName = process.env.S3_BUCKET_NAME || 'onboarding-docs-bucket';

export async function generateUploadUrl(
  userId: string, 
  documentType: string, 
  documentId: string, 
  fileName: string,
  contentType: string
): Promise<{ uploadUrl: string; s3Key: string }> {
  const s3Key = `users/${userId}/${documentType}/${documentId}-${fileName}`;
  
  console.log('Generating S3 upload URL:', {
    bucket: bucketName,
    s3Key,
    contentType,
    region: process.env.AWS_REGION,
    hasCredentials: !!(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY)
  });
  
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: s3Key,
    ContentType: contentType,
  });

  try {
    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 900 }); // 15 minutes
    console.log('Generated presigned URL:', uploadUrl.substring(0, 100) + '...');
    return { uploadUrl, s3Key };
  } catch (error) {
    console.error('Error generating upload URL:', error);
    throw new Error('Could not generate upload URL');
  }
}

export async function generateDownloadUrl(s3Key: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: s3Key,
  });

  try {
    const downloadUrl = await getSignedUrl(s3Client, command, { expiresIn: 900 }); // 15 minutes
    return downloadUrl;
  } catch (error) {
    console.error('Error generating download URL:', error);
    throw new Error('Could not generate download URL');
  }
}

export async function deleteFile(s3Key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: s3Key,
  });

  try {
    await s3Client.send(command);
  } catch (error) {
    console.error('Error deleting file:', error);
    throw new Error('Could not delete file');
  }
}

export { s3Client };