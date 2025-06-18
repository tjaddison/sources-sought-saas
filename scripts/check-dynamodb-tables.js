const { DynamoDBClient, DescribeTableCommand } = require('@aws-sdk/client-dynamodb');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function checkTableStructure() {
  const tableName = process.env.DYNAMODB_INDEXING_JOBS_TABLE || 'onboarding-indexing-jobs';
  
  try {
    const command = new DescribeTableCommand({
      TableName: tableName,
    });
    
    const response = await client.send(command);
    
    console.log(`\nTable: ${tableName}`);
    console.log('Key Schema:');
    response.Table.KeySchema.forEach(key => {
      console.log(`  - ${key.AttributeName}: ${key.KeyType}`);
    });
    
    console.log('\nAttribute Definitions:');
    response.Table.AttributeDefinitions.forEach(attr => {
      console.log(`  - ${attr.AttributeName}: ${attr.AttributeType}`);
    });
    
  } catch (error) {
    if (error.name === 'ResourceNotFoundException') {
      console.error(`Table ${tableName} does not exist`);
    } else {
      console.error('Error checking table:', error);
    }
  }
}

checkTableStructure();