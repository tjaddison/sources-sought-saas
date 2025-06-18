import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import mammoth from 'mammoth';
import { extractTextFromPDF } from './pdf-extractor';

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
});

async function streamToBuffer(stream: Readable): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

export async function extractTextFromDocument(s3Key: string, mimeType: string): Promise<string> {
  try {
    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: s3Key,
    });

    const response = await s3Client.send(command);
    
    if (!response.Body) {
      throw new Error('No document body found');
    }

    const buffer = await streamToBuffer(response.Body as Readable);

    switch (mimeType) {
      case 'application/pdf':
        // Use our custom PDF extractor
        return await extractTextFromPDF(buffer);

      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        // Only process .docx files with mammoth
        try {
          const docResult = await mammoth.extractRawText({ buffer });
          return docResult.value;
        } catch (error) {
          console.error('Error processing DOCX:', error);
          return '[Unable to extract text from this document]';
        }
        
      case 'application/msword':
        // .doc files are not supported by mammoth
        console.warn('Legacy .doc format not supported, please convert to .docx');
        return '[Legacy .doc format not supported - please upload as .docx]';

      case 'text/plain':
        return buffer.toString('utf-8');

      default:
        throw new Error(`Unsupported mime type: ${mimeType}`);
    }
  } catch (error) {
    console.error('Error extracting text from document:', error);
    throw new Error(`Failed to extract text from document: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export function truncateText(text: string, maxTokens: number = 8000): string {
  // Rough estimate: 1 token ≈ 4 characters
  const maxChars = maxTokens * 4;
  
  if (text.length <= maxChars) {
    return text;
  }

  // Try to truncate at a sentence boundary
  const truncated = text.substring(0, maxChars);
  const lastPeriod = truncated.lastIndexOf('.');
  const lastNewline = truncated.lastIndexOf('\n');
  
  const cutoffPoint = Math.max(lastPeriod, lastNewline);
  
  if (cutoffPoint > maxChars * 0.8) {
    return truncated.substring(0, cutoffPoint + 1);
  }
  
  return truncated;
}