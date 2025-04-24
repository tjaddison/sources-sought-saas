import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { GetCommand, PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";

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

const tableName = process.env.DYNAMODB_TABLE_NAME;

// Example: Get an item by its primary key
export async function getItemById(id: string) {
  if (!tableName) throw new Error("DYNAMODB_TABLE_NAME is not set.");
  if (!id) throw new Error("ID parameter is required.");

  const params = {
    TableName: tableName,
    Key: {
      // Replace 'id' with your actual primary key attribute name
      id: id,
    },
  };

  try {
    const data = await ddbDocClient.send(new GetCommand(params));
    return data.Item; // Returns the item object or undefined if not found
  } catch (error) {
    console.error("Error getting item from DynamoDB:", error);
    throw new Error("Could not fetch item.");
  }
}

// Example: Add or update an item
export async function putItem(item: Record<string, unknown>) {
  if (!tableName) throw new Error("DYNAMODB_TABLE_NAME is not set.");
  if (!item || typeof item !== 'object') throw new Error("Item parameter must be an object.");
  // Add validation for required keys if necessary, e.g., item.id

  const params = {
    TableName: tableName,
    Item: item,
  };

  try {
    await ddbDocClient.send(new PutCommand(params));
    return item; // Return the item that was put
  } catch (error) {
    console.error("Error putting item into DynamoDB:", error);
    throw new Error("Could not save item.");
  }
}

// Example: Scan the entire table (Use with caution on large tables!)
export async function scanTable() {
  if (!tableName) throw new Error("DYNAMODB_TABLE_NAME is not set.");

  const params = {
    TableName: tableName,
    // Add ProjectionExpression to fetch only specific attributes if needed
    // ProjectionExpression: "id, title, description",
  };

  try {
    const data = await ddbDocClient.send(new ScanCommand(params));
    return data.Items; // Returns an array of items
  } catch (error) {
    console.error("Error scanning table:", error);
    throw new Error("Could not scan table.");
  }
}

// Add more functions as needed (e.g., query, updateItem, deleteItem)

export { ddbDocClient }; 