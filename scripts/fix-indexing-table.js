const { DynamoDBClient, CreateTableCommand, DeleteTableCommand, DescribeTableCommand } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand, BatchWriteCommand } = require('@aws-sdk/lib-dynamodb');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const docClient = DynamoDBDocumentClient.from(client);

const tableName = process.env.DYNAMODB_INDEXING_JOBS_TABLE || 'onboarding-indexing-jobs';

async function backupExistingData() {
  console.log('Backing up existing data...');
  try {
    const response = await docClient.send(new ScanCommand({
      TableName: tableName,
    }));
    
    console.log(`Found ${response.Items?.length || 0} items to backup`);
    return response.Items || [];
  } catch (error) {
    console.error('Error backing up data:', error);
    return [];
  }
}

async function waitForTableDeletion() {
  console.log('Waiting for table deletion...');
  while (true) {
    try {
      await client.send(new DescribeTableCommand({ TableName: tableName }));
      await new Promise(resolve => setTimeout(resolve, 5000));
    } catch (error) {
      if (error.name === 'ResourceNotFoundException') {
        console.log('Table deleted successfully');
        break;
      }
    }
  }
}

async function waitForTableCreation() {
  console.log('Waiting for table to be active...');
  while (true) {
    try {
      const response = await client.send(new DescribeTableCommand({ TableName: tableName }));
      if (response.Table.TableStatus === 'ACTIVE') {
        console.log('Table is active');
        break;
      }
    } catch (error) {
      // Table might not exist yet
    }
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
}

async function recreateTable() {
  console.log('\n⚠️  WARNING: This script will recreate the indexing jobs table with the correct schema.');
  console.log('Current table has only userId as partition key.');
  console.log('New table will have userId (partition) and jobId (sort) as composite key.\n');
  
  // Backup existing data
  const backupData = await backupExistingData();
  
  if (backupData.length > 0) {
    console.log('\nExisting data:');
    backupData.forEach(item => {
      console.log(`  - User: ${item.userId}, Job: ${item.jobId || 'NO JOB ID'}, Status: ${item.status}`);
    });
    
    console.log('\n⚠️  This data will be migrated to the new table structure.');
    console.log('Press Ctrl+C to cancel, or wait 10 seconds to continue...\n');
    await new Promise(resolve => setTimeout(resolve, 10000));
  }
  
  try {
    // Delete existing table
    console.log('Deleting existing table...');
    await client.send(new DeleteTableCommand({ TableName: tableName }));
    await waitForTableDeletion();
    
    // Create new table with correct schema
    console.log('Creating new table with composite key...');
    const createParams = {
      TableName: tableName,
      KeySchema: [
        { AttributeName: 'userId', KeyType: 'HASH' },  // Partition key
        { AttributeName: 'jobId', KeyType: 'RANGE' }   // Sort key
      ],
      AttributeDefinitions: [
        { AttributeName: 'userId', AttributeType: 'S' },
        { AttributeName: 'jobId', AttributeType: 'S' }
      ],
      BillingMode: 'PAY_PER_REQUEST',
    };
    
    await client.send(new CreateTableCommand(createParams));
    await waitForTableCreation();
    
    // Restore data
    if (backupData.length > 0) {
      console.log('Restoring backed up data...');
      
      // Filter out items without jobId and add it if missing
      const itemsToRestore = backupData.map(item => {
        if (!item.jobId) {
          console.log(`  Warning: Adding missing jobId for user ${item.userId}`);
          return {
            ...item,
            jobId: item.startedAt || new Date().toISOString(), // Use timestamp as jobId
          };
        }
        return item;
      });
      
      // Batch write items
      const chunks = [];
      for (let i = 0; i < itemsToRestore.length; i += 25) {
        chunks.push(itemsToRestore.slice(i, i + 25));
      }
      
      for (const chunk of chunks) {
        const putRequests = chunk.map(item => ({
          PutRequest: { Item: item }
        }));
        
        await docClient.send(new BatchWriteCommand({
          RequestItems: {
            [tableName]: putRequests
          }
        }));
      }
      
      console.log(`Restored ${itemsToRestore.length} items`);
    }
    
    console.log('\n✅ Table recreation completed successfully!');
    console.log('The indexing jobs table now has the correct composite key structure.');
    
  } catch (error) {
    console.error('Error recreating table:', error);
    process.exit(1);
  }
}

// Run the script
recreateTable();