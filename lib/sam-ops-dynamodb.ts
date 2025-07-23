import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand, GetCommand, ScanCommandInput } from '@aws-sdk/lib-dynamodb';

let client: DynamoDBDocumentClient | null = null;

export function getDynamoDBClient(): DynamoDBDocumentClient {
  if (client) {
    return client;
  }

  const dynamoClient = new DynamoDBClient({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
  });

  client = DynamoDBDocumentClient.from(dynamoClient);
  return client;
}

export interface SourcesSoughtItem {
  notice_id: string;
  title?: string;
  postedDate?: string;
  responseDeadLine?: string;
  naicsCode?: string;
  classificationCode?: string;
  fullParentPathName?: string;
  type?: string;
  solicitationNumber?: string;
  active?: string;
  active_status?: string;
  OppDescription?: string;
  description?: string;
  archiveDate?: string;
  uiLink?: string;
  officeAddress?: any;
  placeOfPerformance?: any;
  pointOfContact?: any;
  resourceLinks?: any;
  updated_at?: string;
  [key: string]: any;
}

export interface SearchResult {
  items: SourcesSoughtItem[];
  total: number;
  lastEvaluatedKey?: any;
}

export async function searchSourcesSought(
  query: string = '',
  limit: number = 25,
  offset: number = 0,
  sortBy: 'updated_date' | 'title_asc' | 'title_desc' | 'relevance' = 'updated_date',
  typeFilter?: string,
  lastEvaluatedKey?: any
): Promise<SearchResult> {
  const client = getDynamoDBClient();
  const tableName = process.env.DYNAMODB_TABLE || 'sam_opps';

  try {
    // First, get a count of all matching items for total
    let totalCount = 0;
    let countLastEvaluatedKey = undefined;
    
    // Scan to count total matching items
    do {
      const countParams: ScanCommandInput = {
        TableName: tableName,
        Select: 'COUNT',
        ExclusiveStartKey: countLastEvaluatedKey,
        FilterExpression: 'active = :status',
        ExpressionAttributeValues: {
          ':status': 'Yes'
        }
      };

      // Add text search filter if query provided
      if (query && query.trim() !== '') {
        const queryLower = query.toLowerCase();
        countParams.FilterExpression += ' AND (contains(#title, :query) OR contains(#desc, :query) OR contains(#oppDesc, :query))';
        countParams.ExpressionAttributeNames = {
          '#title': 'title',
          '#desc': 'description', 
          '#oppDesc': 'OppDescription'
        };
        countParams.ExpressionAttributeValues = {
          ...countParams.ExpressionAttributeValues,
          ':query': queryLower
        };
      }

      // Add type filter if specified
      if (typeFilter && typeFilter.trim() !== '') {
        countParams.FilterExpression += ' AND #type = :typeFilter';
        countParams.ExpressionAttributeNames = {
          ...countParams.ExpressionAttributeNames,
          '#type': 'type'
        };
        countParams.ExpressionAttributeValues = {
          ...countParams.ExpressionAttributeValues,
          ':typeFilter': typeFilter
        };
      }

      const countCommand = new ScanCommand(countParams);
      const countResponse = await client.send(countCommand);
      
      totalCount += countResponse.Count || 0;
      countLastEvaluatedKey = countResponse.LastEvaluatedKey;
    } while (countLastEvaluatedKey);

    // Now get the actual items for the requested page
    let allItems: SourcesSoughtItem[] = [];
    let itemsScanned = 0;
    let currentLastEvaluatedKey = lastEvaluatedKey;
    
    // Calculate how many items we need (offset + limit)
    const itemsNeeded = offset + limit;
    
    while (allItems.length < itemsNeeded && (currentLastEvaluatedKey !== undefined || itemsScanned === 0)) {
      const scanParams: ScanCommandInput = {
        TableName: tableName,
        Limit: Math.max(itemsNeeded * 2, 100), // Get extra items to handle filtering
        ExclusiveStartKey: currentLastEvaluatedKey,
        FilterExpression: 'active = :status',
        ExpressionAttributeValues: {
          ':status': 'Yes'
        }
      };

      // Add text search filter if query provided
      if (query && query.trim() !== '') {
        const queryLower = query.toLowerCase();
        scanParams.FilterExpression += ' AND (contains(#title, :query) OR contains(#desc, :query) OR contains(#oppDesc, :query))';
        scanParams.ExpressionAttributeNames = {
          '#title': 'title',
          '#desc': 'description', 
          '#oppDesc': 'OppDescription'
        };
        scanParams.ExpressionAttributeValues = {
          ...scanParams.ExpressionAttributeValues,
          ':query': queryLower
        };
      }

      // Add type filter if specified
      if (typeFilter && typeFilter.trim() !== '') {
        scanParams.FilterExpression += ' AND #type = :typeFilter';
        scanParams.ExpressionAttributeNames = {
          ...scanParams.ExpressionAttributeNames,
          '#type': 'type'
        };
        scanParams.ExpressionAttributeValues = {
          ...scanParams.ExpressionAttributeValues,
          ':typeFilter': typeFilter
        };
      }

      const command = new ScanCommand(scanParams);
      const response = await client.send(command);
      
      if (response.Items) {
        const items = response.Items.map(item => item as SourcesSoughtItem);
        allItems.push(...items);
        itemsScanned += response.Items.length;
      }

      currentLastEvaluatedKey = response.LastEvaluatedKey;
      
      if (!currentLastEvaluatedKey) {
        break;
      }

      // Safety check
      if (itemsScanned > 20000) {
        console.warn('Reached safety limit while scanning DynamoDB');
        break;
      }
    }

    // Apply sorting to all items
    allItems = applySorting(allItems, sortBy);

    // Apply pagination
    const paginatedItems = allItems.slice(offset, offset + limit);

    return {
      items: paginatedItems,
      total: totalCount, // Use the actual total count from the count scan
      lastEvaluatedKey: currentLastEvaluatedKey
    };

  } catch (error) {
    console.error('Error searching DynamoDB:', error);
    throw new Error('Failed to search government opportunities');
  }
}

export async function getSourcesSoughtById(noticeId: string): Promise<SourcesSoughtItem | null> {
  const client = getDynamoDBClient();
  const tableName = process.env.DYNAMODB_TABLE || 'sam_opps';

  try {
    const command = new GetCommand({
      TableName: tableName,
      Key: {
        notice_id: noticeId
      }
    });

    const response = await client.send(command);
    
    if (!response.Item) {
      return null;
    }

    return response.Item as SourcesSoughtItem;
  } catch (error) {
    console.error('Error getting opportunity by ID:', error);
    throw new Error('Failed to get opportunity details');
  }
}

// Optimized pagination for better UX - cursor-based pagination
export async function searchSourcesSoughtWithCursor(
  query: string = '',
  limit: number = 25,
  cursor?: string,
  sortBy: 'updated_date' | 'title_asc' | 'title_desc' | 'relevance' = 'updated_date',
  typeFilter?: string
): Promise<SearchResult & { nextCursor?: string }> {
  const client = getDynamoDBClient();
  const tableName = process.env.DYNAMODB_TABLE || 'sam_opps';

  try {
    let exclusiveStartKey: any = undefined;
    
    // Decode cursor if provided
    if (cursor) {
      try {
        exclusiveStartKey = JSON.parse(Buffer.from(cursor, 'base64').toString());
      } catch (e) {
        console.warn('Invalid cursor provided, starting from beginning');
      }
    }

    const scanParams: ScanCommandInput = {
      TableName: tableName,
      Limit: limit * 2, // Get extra items for filtering
      ExclusiveStartKey: exclusiveStartKey,
      FilterExpression: 'active = :status',
      ExpressionAttributeValues: {
        ':status': 'Yes'
      }
    };

    // Add text search filter if query provided
    if (query && query.trim() !== '') {
      const queryLower = query.toLowerCase();
      scanParams.FilterExpression += ' AND (contains(#title, :query) OR contains(#desc, :query) OR contains(#oppDesc, :query))';
      scanParams.ExpressionAttributeNames = {
        '#title': 'title',
        '#desc': 'description',
        '#oppDesc': 'OppDescription'
      };
      scanParams.ExpressionAttributeValues = {
        ...scanParams.ExpressionAttributeValues,
        ':query': queryLower
      };
    }

    // Add type filter if specified
    if (typeFilter && typeFilter.trim() !== '') {
      scanParams.FilterExpression += ' AND #type = :typeFilter';
      scanParams.ExpressionAttributeNames = {
        ...scanParams.ExpressionAttributeNames,
        '#type': 'type'
      };
      scanParams.ExpressionAttributeValues = {
        ...scanParams.ExpressionAttributeValues,
        ':typeFilter': typeFilter
      };
    }

    const command = new ScanCommand(scanParams);
    const response = await client.send(command);
    
    let items: SourcesSoughtItem[] = [];
    if (response.Items) {
      items = response.Items.map(item => item as SourcesSoughtItem);
    }

    // Apply sorting
    items = applySorting(items, sortBy);

    // Limit to requested number
    const resultItems = items.slice(0, limit);

    // Create next cursor if there are more items
    let nextCursor: string | undefined;
    if (response.LastEvaluatedKey && items.length >= limit) {
      nextCursor = Buffer.from(JSON.stringify(response.LastEvaluatedKey)).toString('base64');
    }

    return {
      items: resultItems,
      total: resultItems.length,
      nextCursor
    };

  } catch (error) {
    console.error('Error searching DynamoDB with cursor:', error);
    throw new Error('Failed to search government opportunities');
  }
}


function applySorting(items: SourcesSoughtItem[], sortBy: string): SourcesSoughtItem[] {
  switch (sortBy) {
    case 'title_asc':
      return items.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    case 'title_desc':
      return items.sort((a, b) => (b.title || '').localeCompare(a.title || ''));
    case 'updated_date':
      return items.sort((a, b) => {
        const dateA = a.updated_at || a.postedDate || '';
        const dateB = b.updated_at || b.postedDate || '';
        return dateB.localeCompare(dateA); // Newest first
      });
    case 'relevance':
    default:
      // For relevance, we'd ideally use text matching scores, but for now just use updated_date
      return items.sort((a, b) => {
        const dateA = a.updated_at || a.postedDate || '';
        const dateB = b.updated_at || b.postedDate || '';
        return dateB.localeCompare(dateA);
      });
  }
}