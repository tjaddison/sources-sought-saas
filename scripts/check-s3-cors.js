const { S3Client, GetBucketCorsCommand, PutBucketCorsCommand } = require('@aws-sdk/client-s3');

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const bucketName = process.env.S3_BUCKET_NAME || 'onboarding-docs-bucket';

async function checkAndSetCORS() {
  try {
    // Try to get existing CORS configuration
    console.log(`Checking CORS configuration for bucket: ${bucketName}`);
    
    try {
      const getCorsCommand = new GetBucketCorsCommand({ Bucket: bucketName });
      const corsConfig = await s3Client.send(getCorsCommand);
      console.log('Current CORS configuration:', JSON.stringify(corsConfig.CORSRules, null, 2));
    } catch (error) {
      if (error.name === 'NoSuchCORSConfiguration') {
        console.log('No CORS configuration found. Setting up CORS...');
      } else {
        throw error;
      }
    }

    // Set proper CORS configuration
    const corsRules = [
      {
        AllowedHeaders: ['*'],
        AllowedMethods: ['PUT', 'POST', 'GET', 'HEAD'],
        AllowedOrigins: ['http://localhost:3000', 'http://localhost:3001', 'https://*'],
        ExposeHeaders: ['ETag'],
        MaxAgeSeconds: 3000
      }
    ];

    const putCorsCommand = new PutBucketCorsCommand({
      Bucket: bucketName,
      CORSConfiguration: {
        CORSRules: corsRules
      }
    });

    await s3Client.send(putCorsCommand);
    console.log('CORS configuration updated successfully!');
    console.log('New CORS rules:', JSON.stringify(corsRules, null, 2));

  } catch (error) {
    console.error('Error managing CORS configuration:', error);
    if (error.name === 'AccessDenied') {
      console.error('Access denied. Make sure your AWS credentials have the necessary permissions.');
    }
  }
}

// Load environment variables
require('dotenv').config({ path: '.env.local' });

checkAndSetCORS();