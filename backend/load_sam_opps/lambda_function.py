import json
import logging
import os
from typing import Dict, Any, Optional
import boto3
from botocore.exceptions import ClientError
import weaviate
from weaviate.auth import AuthApiKey
import openai
import time
from datetime import datetime

# Configure logging - reduced verbosity for performance
logger = logging.getLogger()
logger.setLevel(logging.INFO)  # Change to DEBUG to see vector creation logs

# Remove duplicate handlers and simplify
if not logger.handlers:
    handler = logging.StreamHandler()
    formatter = logging.Formatter('%(levelname)s - %(message)s')
    handler.setFormatter(formatter)
    logger.addHandler(handler)

# Environment variables
WEAVIATE_URL = os.environ.get('WEAVIATE_URL')
WEAVIATE_API_KEY = os.environ.get('WEAVIATE_API_KEY')
OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')
WEAVIATE_INDEX_NAME = os.environ.get('WEAVIATE_INDEX_NAME', 'SamGovOpportunities')
AWS_REGION = os.environ.get('AWS_REGION', 'us-east-1')

# Global client to reuse connections across invocations
_weaviate_client = None
_client_initialized = False

def get_secret(secret_name: str, region_name: str) -> Dict[str, Any]:
    """Retrieve secret from AWS Secrets Manager with caching."""
    logger.info(f"Retrieving secret: {secret_name}")
    session = boto3.session.Session()
    client = session.client(
        service_name='secretsmanager',
        region_name=region_name
    )
    
    try:
        response = client.get_secret_value(SecretId=secret_name)
        secret_dict = json.loads(response['SecretString'])
        logger.info(f"Successfully retrieved secret with {len(secret_dict)} keys")
        return secret_dict
    except ClientError as e:
        logger.error(f"Error retrieving secret {secret_name}: {e.response['Error']['Code']}")
        raise

def initialize_weaviate_client():
    """Initialize Weaviate client with optimized settings."""
    global _weaviate_client, _client_initialized
    
    # Return existing client if available and working
    if _client_initialized and _weaviate_client:
        try:
            # Quick health check
            if _weaviate_client.is_ready():
                logger.info("Reusing existing Weaviate client")
                return _weaviate_client
        except:
            logger.info("Existing client failed health check, reinitializing")
            _client_initialized = False
            _weaviate_client = None
    
    logger.info("Initializing new Weaviate client")
    start_time = time.time()
    
    try:
        # Get API keys
        if not WEAVIATE_API_KEY or not OPENAI_API_KEY:
            logger.info("Retrieving API keys from Secrets Manager")
            secrets = get_secret('samgov/api-keys', AWS_REGION)
            weaviate_key = WEAVIATE_API_KEY or secrets.get('WEAVIATE_API_KEY')
            openai_key = OPENAI_API_KEY or secrets.get('OPENAI_API_KEY')
        else:
            weaviate_key = WEAVIATE_API_KEY
            openai_key = OPENAI_API_KEY
        
        # Validate required configuration
        if not WEAVIATE_URL or not weaviate_key or not openai_key:
            raise ValueError("Missing required configuration")
        
        # Set OpenAI API key
        openai.api_key = openai_key
        
        # Create Weaviate client with optimized timeouts
        logger.info(f"Connecting to Weaviate: {WEAVIATE_URL}")
        
        # Prepare headers
        headers = {"X-OpenAI-Api-Key": openai_key}
        
        # Create client with shorter timeouts for Lambda
        client = weaviate.connect_to_weaviate_cloud(
            cluster_url=WEAVIATE_URL,
            auth_credentials=weaviate.auth.AuthApiKey(api_key=weaviate_key),
            headers=headers,
            additional_config=weaviate.config.AdditionalConfig(
                timeout=weaviate.config.Timeout(init=10, query=30, insert=60)  # Reduced timeouts
            )
        )
        
        # Test connection
        if not client.is_ready():
            client.close()
            raise Exception("Weaviate cluster is not ready")
        
        # Ensure collection exists (async in background if needed)
        ensure_class_exists(client)
        
        connect_time = time.time() - start_time
        logger.info(f"Weaviate client initialized successfully in {connect_time:.2f}s")
        
        # Cache the client
        _weaviate_client = client
        _client_initialized = True
        
        return client
        
    except Exception as e:
        logger.error(f"Failed to initialize Weaviate client: {type(e).__name__}: {e}")
        raise

def convert_to_rfc3339(date_string: Optional[str]) -> Optional[str]:
    """Convert various date formats to RFC3339 format for Weaviate."""
    if not date_string or date_string.strip() == '':
        return None
    
    # Common date formats from SAM.gov
    date_formats = [
        '%Y-%m-%d',                    # 2025-06-20
        '%Y-%m-%dT%H:%M:%S',          # 2025-06-20T15:30:00
        '%Y-%m-%dT%H:%M:%S.%f',       # 2025-06-20T15:30:00.123
        '%Y-%m-%dT%H:%M:%SZ',         # 2025-06-20T15:30:00Z
        '%Y-%m-%dT%H:%M:%S.%fZ',      # 2025-06-20T15:30:00.123Z
        '%m/%d/%Y',                    # 06/20/2025
        '%m-%d-%Y',                    # 06-20-2025
    ]
    
    for fmt in date_formats:
        try:
            # Parse the date
            dt = datetime.strptime(date_string.strip(), fmt)
            # Convert to RFC3339 format with UTC timezone
            return dt.strftime('%Y-%m-%dT%H:%M:%SZ')
        except ValueError:
            continue
    
    # If already in RFC3339 format, return as is
    try:
        # Check if it's already RFC3339 by parsing it
        datetime.fromisoformat(date_string.replace('Z', '+00:00'))
        return date_string
    except:
        pass
    
    logger.warning(f"Could not parse date: {date_string}")
    return None

def ensure_class_exists(client):
    """Ensure the Weaviate collection exists with minimal overhead."""
    try:
        # Quick check if collection exists
        collection = client.collections.get(WEAVIATE_INDEX_NAME)
        logger.info(f"Collection '{WEAVIATE_INDEX_NAME}' exists")
        return
    except Exception:
        # Collection doesn't exist, create it
        logger.info(f"Creating collection: {WEAVIATE_INDEX_NAME}")
        
        from weaviate.classes.config import Configure, Property, DataType
        
        properties = [
            Property(
                name="content", 
                data_type=DataType.TEXT,
                vectorize_property_name=True,
                tokenization=Configure.Tokenization.word
            ),
            Property(name="notice_id", data_type=DataType.TEXT),
            Property(name="title", data_type=DataType.TEXT),
            Property(name="posted_date", data_type=DataType.DATE),
            Property(name="response_deadline", data_type=DataType.DATE),
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
        
        client.collections.create(
            name=WEAVIATE_INDEX_NAME,
            vectorizer_config=Configure.Vectorizer.text2vec_openai(
                model="text-embedding-3-small",
                vectorize_collection_name=False
            ),
            properties=properties,
            generative_config=Configure.Generative.openai()
        )
        logger.info(f"Created collection: {WEAVIATE_INDEX_NAME}")

def create_weaviate_object_from_opportunity(opportunity: Dict[str, Any]) -> Dict[str, Any]:
    """Convert SAM.gov opportunity to Weaviate object."""
    # Extract key fields
    notice_id = opportunity.get('noticeId', '')
    title = opportunity.get('title', '')
    description = opportunity.get('OppDescription', opportunity.get('description', ''))
    agency = opportunity.get('officeAddress', {})
    
    # Create content text
    content = f"{title}\n\n{description}" if description else title
    
    # Convert date fields to RFC3339 format
    posted_date = convert_to_rfc3339(opportunity.get('postedDate', ''))
    response_deadline = convert_to_rfc3339(opportunity.get('responseDeadLine', ''))
    
    # Create Weaviate object
    weaviate_obj = {
        'content': content,
        'notice_id': notice_id,
        'title': title,
        'posted_date': posted_date if posted_date else None,
        'response_deadline': response_deadline if response_deadline else None,
        'naics_code': opportunity.get('naicsCode', ''),
        'classification_code': opportunity.get('classificationCode', ''),
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
    
    # Remove None values and empty strings
    return {k: v for k, v in weaviate_obj.items() if v is not None and v != ''}

def process_opportunity(opportunity: Dict[str, Any], client) -> bool:
    """Process a single opportunity and add/update it in Weaviate."""
    notice_id = opportunity.get('noticeId', 'unknown')
    
    try:
        # Get collection
        collection = client.collections.get(WEAVIATE_INDEX_NAME)
        
        # Convert opportunity to Weaviate object
        weaviate_obj = create_weaviate_object_from_opportunity(opportunity)
        
        # Check if object exists and use appropriate method
        if collection.data.exists(notice_id):
            # Update existing object
            result = collection.data.update(
                uuid=notice_id,
                properties=weaviate_obj
            )
            logger.info(f"Updated opportunity: {notice_id}")
            
            # Verify vector was updated
            updated_obj = collection.query.fetch_object_by_id(notice_id, include_vector=True)
            if updated_obj and hasattr(updated_obj, 'vector') and updated_obj.vector:
                logger.debug(f"Vector updated for {notice_id}, dimension: {len(updated_obj.vector)}")
        else:
            # Insert new object
            result = collection.data.insert(
                properties=weaviate_obj,
                uuid=notice_id
            )
            logger.info(f"Inserted new opportunity: {notice_id}")
            
            # Verify vector was created
            inserted_obj = collection.query.fetch_object_by_id(notice_id, include_vector=True)
            if inserted_obj and hasattr(inserted_obj, 'vector') and inserted_obj.vector:
                logger.debug(f"Vector created for {notice_id}, dimension: {len(inserted_obj.vector)}")
        
        return True
        
    except Exception as e:
        logger.error(f"Error processing {notice_id}: {type(e).__name__}: {e}")
        return False

def lambda_handler(event, context):
    """Optimized Lambda handler for processing opportunities."""
    # Get remaining time to manage timeouts
    remaining_time = context.get_remaining_time_in_millis() if context else 300000
    start_time = time.time()
    
    logger.info(f"Lambda started - Remaining time: {remaining_time}ms")
    
    # Handle event format
    if isinstance(event, list):
        records = event
    else:
        records = event.get('Records', [])
    
    logger.info(f"Processing {len(records)} records")
    
    if not records:
        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'No records to process', 'processed': 0})
        }
    
    # Initialize client with timeout consideration
    try:
        # Reserve time for processing
        init_timeout = min(remaining_time * 0.3, 15000)  # Max 15s for init
        
        logger.info(f"Initializing client (timeout: {init_timeout/1000:.1f}s)")
        weaviate_client = initialize_weaviate_client()
        
    except Exception as e:
        logger.error(f"Client initialization failed: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e), 'message': 'Client initialization failed'})
        }
    
    # Process records with time management
    successful = 0
    failed = 0
    
    try:
        for i, record in enumerate(records):
            # Check remaining time
            elapsed = (time.time() - start_time) * 1000
            remaining = remaining_time - elapsed
            
            if remaining < 5000:  # Reserve 5s for cleanup
                logger.warning(f"Time limit approaching, processed {i}/{len(records)} records")
                break
            
            try:
                # Parse record
                if isinstance(record, dict) and 'body' in record:
                    message_body = json.loads(record['body'])
                else:
                    message_body = record
                
                # Process opportunity
                if process_opportunity(message_body, weaviate_client):
                    successful += 1
                else:
                    failed += 1
                    
            except Exception as e:
                logger.error(f"Record processing error: {type(e).__name__}: {e}")
                failed += 1
    
    except Exception as e:
        logger.error(f"Batch processing error: {e}")
        failed += len(records) - successful
    
    # Log summary
    total = successful + failed
    elapsed = (time.time() - start_time) * 1000
    logger.info(f"Complete - Processed: {total}, Success: {successful}, Failed: {failed}, Time: {elapsed:.0f}ms")
    
    return {
        'statusCode': 200,
        'body': json.dumps({
            'message': 'Processing complete',
            'processed': total,
            'successful': successful,
            'failed': failed,
            'elapsed_ms': int(elapsed)
        })
    }