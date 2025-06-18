import json
import logging
import os
from typing import Dict, Any
import boto3
from botocore.exceptions import ClientError
import weaviate
from weaviate.auth import AuthApiKey
import openai

# Configure logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Add custom formatter for better log readability
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
handler = logging.StreamHandler()
handler.setFormatter(formatter)
logger.addHandler(handler)

# Environment variables
WEAVIATE_URL = os.environ.get('WEAVIATE_URL')
WEAVIATE_API_KEY = os.environ.get('WEAVIATE_API_KEY')
OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')
WEAVIATE_INDEX_NAME = os.environ.get('WEAVIATE_INDEX_NAME', 'SamGovOpportunities')
AWS_REGION = os.environ.get('AWS_REGION', 'us-east-1')

# Log environment configuration (without sensitive data)
logger.info(f"Environment Configuration:")
logger.info(f"  WEAVIATE_URL: {'Set' if WEAVIATE_URL else 'Not set'}")
logger.info(f"  WEAVIATE_API_KEY: {'Set' if WEAVIATE_API_KEY else 'Not set'}")
logger.info(f"  OPENAI_API_KEY: {'Set' if OPENAI_API_KEY else 'Not set'}")
logger.info(f"  WEAVIATE_INDEX_NAME: {WEAVIATE_INDEX_NAME}")
logger.info(f"  AWS_REGION: {AWS_REGION}")

def get_secret(secret_name: str, region_name: str) -> Dict[str, Any]:
    """Retrieve secret from AWS Secrets Manager."""
    logger.info(f"Attempting to retrieve secret: {secret_name} from region: {region_name}")
    session = boto3.session.Session()
    client = session.client(
        service_name='secretsmanager',
        region_name=region_name
    )
    
    try:
        logger.debug("Calling Secrets Manager API...")
        response = client.get_secret_value(SecretId=secret_name)
        logger.info(f"Successfully retrieved secret: {secret_name}")
        secret_dict = json.loads(response['SecretString'])
        logger.debug(f"Secret contains {len(secret_dict)} keys")
        return secret_dict
    except ClientError as e:
        logger.error(f"Error retrieving secret {secret_name}: {e}")
        logger.error(f"Error code: {e.response['Error']['Code']}")
        logger.error(f"Error message: {e.response['Error']['Message']}")
        raise

def initialize_weaviate_client():
    """Initialize Weaviate client with authentication."""
    logger.info("Starting Weaviate client initialization...")
    try:
        # Get API keys from environment or secrets manager
        if not WEAVIATE_API_KEY or not OPENAI_API_KEY:
            logger.info("API keys not found in environment, retrieving from Secrets Manager")
            secrets = get_secret('samgov/api-keys', AWS_REGION)
            weaviate_key = WEAVIATE_API_KEY or secrets.get('WEAVIATE_API_KEY')
            openai_key = OPENAI_API_KEY or secrets.get('OPENAI_API_KEY')
            logger.info(f"API keys retrieved - Weaviate: {'Found' if weaviate_key else 'Missing'}, OpenAI: {'Found' if openai_key else 'Missing'}")
        else:
            logger.info("Using API keys from environment variables")
            weaviate_key = WEAVIATE_API_KEY
            openai_key = OPENAI_API_KEY
        
        # Validate required configuration
        if not WEAVIATE_URL:
            raise ValueError("WEAVIATE_URL is not configured")
        if not weaviate_key:
            raise ValueError("Weaviate API key is not available")
        if not openai_key:
            raise ValueError("OpenAI API key is not available")
        
        # Set OpenAI API key for embeddings
        logger.debug("Setting OpenAI API key...")
        openai.api_key = openai_key
        
        # Initialize Weaviate client (v4 API)
        logger.info(f"Connecting to Weaviate at: {WEAVIATE_URL}")
        client = weaviate.connect_to_weaviate_cloud(
            cluster_url=WEAVIATE_URL,
            auth_credentials=AuthApiKey(api_key=weaviate_key),
            headers={
                "X-OpenAI-Api-Key": openai_key
            }
        )
        
        logger.info(f"Successfully connected to Weaviate cluster")
        
        # Test connection
        try:
            logger.debug("Testing Weaviate connection...")
            client.is_ready()
            logger.info("Weaviate connection test successful")
        except Exception as test_error:
            logger.error(f"Weaviate connection test failed: {test_error}")
            raise
        
        # Ensure the class exists
        ensure_class_exists(client)
        
        return client
        
    except Exception as e:
        logger.error(f"Failed to initialize Weaviate client: {e}", exc_info=True)
        raise

def ensure_class_exists(client):
    """Ensure the Weaviate class exists with proper schema."""
    logger.info(f"Checking if collection '{WEAVIATE_INDEX_NAME}' exists...")
    try:
        # Check if collection exists
        try:
            collection = client.collections.get(WEAVIATE_INDEX_NAME)
            logger.info(f"Collection '{WEAVIATE_INDEX_NAME}' already exists")
            
            # Log collection info
            try:
                config = collection.config.get()
                logger.debug(f"Collection vectorizer: {config.vectorizer}")
                logger.debug(f"Collection properties count: {len(config.properties)}")
            except Exception as info_error:
                logger.debug(f"Could not retrieve collection info: {info_error}")
            
            return
        except Exception as e:
            logger.info(f"Collection does not exist (expected for first run): {e}")
            # Collection doesn't exist, create it
            pass
        
        logger.info(f"Creating new Weaviate collection: {WEAVIATE_INDEX_NAME}")
        
        # Create collection with v4 API
        from weaviate.classes.config import Configure, Property, DataType
        
        logger.debug("Defining collection schema...")
        properties = [
            Property(name="content", data_type=DataType.TEXT),
            Property(name="notice_id", data_type=DataType.TEXT),
            Property(name="title", data_type=DataType.TEXT),
            Property(name="posted_date", data_type=DataType.TEXT),
            Property(name="response_deadline", data_type=DataType.TEXT),
            Property(name="naics_code", data_type=DataType.TEXT),
            Property(name="classification_code", data_type=DataType.TEXT),
            Property(name="agency_name", data_type=DataType.TEXT),
            Property(name="agency_city", data_type=DataType.TEXT),
            Property(name="agency_state", data_type=DataType.TEXT),
            Property(name="agency_country", data_type=DataType.TEXT),
            Property(name="type", data_type=DataType.TEXT),
            Property(name="solicitationNumber", data_type=DataType.TEXT),
            Property(name="fullParentPathName", data_type=DataType.TEXT),
            Property(name="archived", data_type=DataType.BOOL),
            Property(name="cancelled", data_type=DataType.BOOL)
        ]
        
        logger.info(f"Creating collection with {len(properties)} properties...")
        client.collections.create(
            name=WEAVIATE_INDEX_NAME,
            vectorizer_config=Configure.Vectorizer.text2vec_openai(
                model="text-embedding-ada-002"
            ),
            properties=properties
        )
        logger.info(f"Successfully created collection: {WEAVIATE_INDEX_NAME}")
            
    except Exception as e:
        logger.error(f"Error ensuring collection exists: {e}", exc_info=True)
        raise

def create_weaviate_object_from_opportunity(opportunity: Dict[str, Any]) -> Dict[str, Any]:
    """
    Convert a SAM.gov opportunity into a Weaviate object.
    
    Args:
        opportunity: Dictionary containing opportunity data
        
    Returns:
        Dictionary formatted for Weaviate
    """
    # Extract key fields
    notice_id = opportunity.get('noticeId', '')
    title = opportunity.get('title', '')
    description = opportunity.get('OppDescription', opportunity.get('description', ''))
    posted_date = opportunity.get('postedDate', '')
    response_deadline = opportunity.get('responseDeadLine', '')
    naics_code = opportunity.get('naicsCode', '')
    classification_code = opportunity.get('classificationCode', '')
    agency = opportunity.get('officeAddress', {})
    
    # Create content text combining title and description
    content = f"{title}\n\n{description}" if description else title
    logger.debug(f"Created content for notice_id={notice_id}, title_length={len(title)}, desc_length={len(description) if description else 0}, total_length={len(content)}")
    
    # Create Weaviate object
    weaviate_obj = {
        'content': content,
        'notice_id': notice_id,
        'title': title,
        'posted_date': posted_date,
        'response_deadline': response_deadline,
        'naics_code': naics_code,
        'classification_code': classification_code,
        'agency_name': agency.get('name', ''),
        'agency_city': agency.get('city', ''),
        'agency_state': agency.get('state', ''),
        'agency_country': agency.get('countryCode', ''),
        'type': opportunity.get('type', ''),
        'solicitationNumber': opportunity.get('solicitationNumber', ''),
        'fullParentPathName': opportunity.get('fullParentPathName', ''),
        'archived': opportunity.get('archived', False),
        'cancelled': opportunity.get('cancelled', False)
    }
    
    # Remove None values
    weaviate_obj = {k: v for k, v in weaviate_obj.items() if v is not None}
    
    return weaviate_obj

def process_opportunity(opportunity: Dict[str, Any], client) -> bool:
    """
    Process a single opportunity and add it to Weaviate.
    
    Args:
        opportunity: Dictionary containing opportunity data
        client: Weaviate client instance
        
    Returns:
        Boolean indicating success
    """
    notice_id = opportunity.get('noticeId', 'unknown')
    logger.info(f"Starting to process opportunity: {notice_id}")
    
    try:
        # Log opportunity details
        logger.debug(f"Opportunity type: {opportunity.get('type', 'N/A')}")
        logger.debug(f"Agency: {opportunity.get('officeAddress', {}).get('name', 'N/A')}")
        logger.debug(f"Posted date: {opportunity.get('postedDate', 'N/A')}")
        
        # Get collection
        logger.debug(f"Getting collection: {WEAVIATE_INDEX_NAME}")
        collection = client.collections.get(WEAVIATE_INDEX_NAME)
        
        # Check if object already exists and delete if it does
        try:
            logger.debug(f"Checking if opportunity {notice_id} already exists...")
            existing = collection.data.get_by_id(notice_id)
            if existing:
                logger.info(f"Opportunity {notice_id} already exists, will update by deleting and re-inserting")
                collection.data.delete_by_id(notice_id)
                logger.debug(f"Deleted existing opportunity {notice_id}")
        except Exception as e:
            logger.debug(f"Opportunity {notice_id} does not exist (expected for new opportunities): {e}")
            # Object doesn't exist, which is fine
            pass
        
        # Convert to Weaviate object
        logger.debug(f"Converting opportunity to Weaviate object format...")
        weaviate_obj = create_weaviate_object_from_opportunity(opportunity)
        
        # Log object details
        logger.debug(f"Weaviate object has {len(weaviate_obj)} properties")
        logger.debug(f"Properties: {list(weaviate_obj.keys())}")
        
        # Add to Weaviate with notice_id as UUID
        logger.debug(f"Inserting opportunity into Weaviate with UUID: {notice_id}")
        collection.data.insert(
            properties=weaviate_obj,
            uuid=notice_id
        )
        
        logger.info(f"Successfully indexed opportunity: {notice_id}")
        return True
        
    except Exception as e:
        logger.error(f"Error processing opportunity {notice_id}: {type(e).__name__}: {e}", exc_info=True)
        # Log more details about the opportunity that failed
        logger.error(f"Failed opportunity data keys: {list(opportunity.keys())}")
        return False

def lambda_handler(event, context):
    """
    Lambda handler to process SQS messages and load opportunities into Weaviate.
    
    Args:
        event: SQS event containing messages
        context: Lambda context
        
    Returns:
        Response indicating processing status
    """
    # Log invocation details
    logger.info("=== Lambda Handler Invoked ===")
    logger.info(f"Request ID: {context.aws_request_id if context else 'N/A'}")
    logger.info(f"Function name: {context.function_name if context else 'N/A'}")
    logger.info(f"Memory limit: {context.memory_limit_in_mb if context else 'N/A'} MB")
    
    # Handle both direct list of records and SQS event format
    if isinstance(event, list):
        logger.info("Event is a direct list of records")
        records = event
    else:
        logger.info("Event is in SQS format")
        records = event.get('Records', [])
    
    logger.info(f"Lambda invoked with {len(records)} records to process")
    logger.debug(f"Environment - Weaviate URL: {WEAVIATE_URL}, Index: {WEAVIATE_INDEX_NAME}")
    
    # Return early if no records to process
    if not records:
        logger.info("No records to process, exiting")
        return {
            'statusCode': 200,
            'body': json.dumps({
                'message': 'No records to process',
                'processed': 0,
                'successful': 0,
                'failed': 0
            })
        }
    
    # Initialize clients
    try:
        weaviate_client = initialize_weaviate_client()
        logger.info("Weaviate client initialized successfully")
        
    except Exception as e:
        logger.error(f"Failed to initialize services: {e}", exc_info=True)
        return {
            'statusCode': 500,
            'body': json.dumps({
                'error': str(e),
                'message': 'Failed to initialize services'
            })
        }
    
    # Process messages
    successful = 0
    failed = 0
    
    for record in records:
        try:
            logger.debug(f"Processing record {successful + failed + 1} of {len(records)}")
            
            # Parse SQS message
            if isinstance(record, dict) and 'body' in record:
                logger.debug("Record is SQS message format")
                message_body = json.loads(record['body'])
                
                # Extract message attributes if available
                attributes = record.get('messageAttributes', {})
                notice_id = attributes.get('noticeId', {}).get('stringValue', 'unknown')
                receipt_handle = record.get('receiptHandle', '')
                
                logger.debug(f"SQS message - Notice ID: {notice_id}, Receipt handle: {receipt_handle[:20] if receipt_handle else 'N/A'}...")
            else:
                logger.debug("Record is direct opportunity format")
                message_body = record
                notice_id = message_body.get('noticeId', 'unknown')
            
            # Process the opportunity
            if process_opportunity(message_body, weaviate_client):
                successful += 1
                logger.debug(f"Successfully processed notice: {notice_id}")
            else:
                failed += 1
                logger.warning(f"Failed to process notice: {notice_id}")
                
        except json.JSONDecodeError as e:
            logger.error(f"Invalid JSON in message: {e}")
            logger.error(f"Raw record content: {str(record)[:500]}...")  # Log first 500 chars
            failed += 1
        except Exception as e:
            logger.error(f"Unexpected error processing record: {type(e).__name__}: {e}", exc_info=True)
            failed += 1
    
    # Log summary
    total = successful + failed
    logger.info("=== Processing Summary ===")
    logger.info(f"Total records processed: {total}")
    logger.info(f"Successful: {successful} ({(successful/total*100):.1f}%)" if total > 0 else "Successful: 0")
    logger.info(f"Failed: {failed} ({(failed/total*100):.1f}%)" if total > 0 else "Failed: 0")
    
    # Close Weaviate connection
    try:
        logger.debug("Closing Weaviate connection...")
        weaviate_client.close()
        logger.info("Weaviate client connection closed successfully")
    except Exception as e:
        logger.warning(f"Error closing Weaviate connection: {type(e).__name__}: {e}")
    
    # Return response
    response = {
        'statusCode': 200,
        'body': json.dumps({
            'message': 'Processing complete',
            'processed': total,
            'successful': successful,
            'failed': failed
        })
    }
    
    # If any messages failed, log warning
    if failed > 0:
        logger.warning(f"⚠️  {failed} messages failed processing - check error logs for details")
    
    # Log completion
    logger.info(f"=== Lambda Handler Complete - Status: {response['statusCode']} ===")
    
    return response