import json
import logging
import os
from typing import Dict, Any, Optional
import boto3
from botocore.exceptions import ClientError
import time
from datetime import datetime, timedelta

# Configure logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Remove duplicate handlers and simplify
if not logger.handlers:
    handler = logging.StreamHandler()
    formatter = logging.Formatter('%(levelname)s - %(message)s')
    handler.setFormatter(formatter)
    logger.addHandler(handler)

# Environment variables
AWS_REGION = os.environ.get('AWS_REGION', 'us-east-1')
S3_BUCKET = os.environ.get('S3_BUCKET')
DYNAMODB_TABLE = os.environ.get('DYNAMODB_TABLE', 'sam_opps')
S3_FOLDER = os.environ.get('S3_FOLDER', 'sam-opportunities')
S3_INACTIVE_FOLDER = os.environ.get('S3_INACTIVE_FOLDER', 'sam-opportunities-inactive')

# Global clients to reuse connections across invocations
_s3_client = None
_dynamodb_client = None
_clients_initialized = False

def initialize_clients():
    """Initialize AWS clients."""
    global _s3_client, _dynamodb_client, _clients_initialized
    
    if _clients_initialized:
        logger.info("Reusing existing AWS clients")
        return _s3_client, _dynamodb_client
    
    logger.info("Initializing AWS clients")
    
    try:
        _s3_client = boto3.client('s3', region_name=AWS_REGION)
        _dynamodb_client = boto3.client('dynamodb', region_name=AWS_REGION)
        
        # Validate required configuration
        if not S3_BUCKET:
            raise ValueError("S3_BUCKET environment variable is required")
        
        _clients_initialized = True
        logger.info("AWS clients initialized successfully")
        
        return _s3_client, _dynamodb_client
        
    except Exception as e:
        logger.error(f"Failed to initialize AWS clients: {type(e).__name__}: {e}")
        raise

def parse_date(date_string: Optional[str]) -> Optional[str]:
    """Parse various date formats and return ISO format string."""
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
            dt = datetime.strptime(date_string.strip(), fmt)
            return dt.strftime('%Y-%m-%d')
        except ValueError:
            continue
    
    # If already in ISO format, return as is
    try:
        datetime.fromisoformat(date_string.replace('Z', ''))
        return date_string
    except:
        pass
    
    logger.warning(f"Could not parse date: {date_string}")
    return None

def is_record_inactive(opportunity: Dict[str, Any]) -> bool:
    """Determine if a record should be marked as inactive."""
    # Check if active is "No"
    active = opportunity.get('active', '').lower()
    if active == 'no':
        return True
    
    # Check if active_status is "inactive"
    active_status = opportunity.get('active_status', '').lower()
    if active_status == 'inactive':
        return True
    
    # Check if current date > archiveDate
    archive_date_str = opportunity.get('archiveDate', '')
    if archive_date_str:
        archive_date = parse_date(archive_date_str)
        if archive_date:
            try:
                archive_dt = datetime.strptime(archive_date, '%Y-%m-%d')
                current_dt = datetime.now()
                if current_dt > archive_dt:
                    return True
            except ValueError:
                logger.warning(f"Could not compare archive date: {archive_date}")
    
    return False

def should_delete_from_inactive(opportunity: Dict[str, Any]) -> bool:
    """Determine if a record should be deleted from inactive folder (> 90 days past archive date)."""
    # Check if archive date is more than 90 days ago
    archive_date_str = opportunity.get('archiveDate', '')
    if archive_date_str:
        archive_date = parse_date(archive_date_str)
        if archive_date:
            try:
                archive_dt = datetime.strptime(archive_date, '%Y-%m-%d')
                current_dt = datetime.now()
                days_since_archive = (current_dt - archive_dt).days
                if days_since_archive >= 90:
                    return True
            except ValueError:
                logger.warning(f"Could not compare archive date: {archive_date}")
    
    return False

def prepare_dynamodb_item(opportunity: Dict[str, Any]) -> Dict[str, Any]:
    """Convert opportunity to DynamoDB item format."""
    notice_id = opportunity.get('noticeId', '')
    
    # Determine if record is inactive
    inactive = is_record_inactive(opportunity)
    
    # Basic item structure
    item = {
        'notice_id': {'S': notice_id},
        'active_status': {'S': 'inactive' if inactive else 'active'},
        'updated_at': {'S': datetime.now().isoformat()}
    }
    
    # Add all opportunity fields as strings (DynamoDB format)
    for key, value in opportunity.items():
        if key == 'noticeId':  # Skip since we use notice_id
            continue
            
        if value is not None and value != '':
            if isinstance(value, bool):
                item[key] = {'BOOL': value}
            elif isinstance(value, (int, float)):
                item[key] = {'N': str(value)}
            elif isinstance(value, dict):
                item[key] = {'S': json.dumps(value)}
            elif isinstance(value, list):
                item[key] = {'S': json.dumps(value)}
            else:
                item[key] = {'S': str(value)}
    
    return item

def save_to_dynamodb(opportunity: Dict[str, Any], dynamodb_client) -> bool:
    """Save or update opportunity in DynamoDB."""
    notice_id = opportunity.get('noticeId', '')
    
    try:
        item = prepare_dynamodb_item(opportunity)
        
        # Use PUT operation to insert or update
        response = dynamodb_client.put_item(
            TableName=DYNAMODB_TABLE,
            Item=item
        )
        
        status = item['active_status']['S']
        logger.info(f"DynamoDB operation successful for {notice_id} (status: {status})")
        return True
        
    except Exception as e:
        logger.error(f"Error saving to DynamoDB {notice_id}: {type(e).__name__}: {e}")
        return False

def save_to_s3(opportunity: Dict[str, Any], s3_client) -> bool:
    """Save opportunity to S3, move to inactive folder if inactive, or delete from inactive if > 90 days past archive."""
    notice_id = opportunity.get('noticeId', '')
    active_s3_key = f"{S3_FOLDER}/{notice_id}.json"
    inactive_s3_key = f"{S3_INACTIVE_FOLDER}/{notice_id}.json"
    
    try:
        inactive = is_record_inactive(opportunity)
        should_delete = should_delete_from_inactive(opportunity)
        
        if inactive:
            if should_delete:
                # Delete from inactive folder if it's been 90+ days past archive date
                try:
                    s3_client.delete_object(Bucket=S3_BUCKET, Key=inactive_s3_key)
                    logger.info(f"Deleted S3 object from inactive folder (90+ days past archive): {notice_id}")
                except ClientError as e:
                    if e.response['Error']['Code'] != 'NoSuchKey':
                        logger.warning(f"Error deleting from inactive folder: {e}")
                
                # Also delete from active folder if it exists
                try:
                    s3_client.delete_object(Bucket=S3_BUCKET, Key=active_s3_key)
                    logger.info(f"Deleted S3 object from active folder (90+ days past archive): {notice_id}")
                except ClientError as e:
                    if e.response['Error']['Code'] != 'NoSuchKey':
                        logger.warning(f"Error deleting from active folder: {e}")
            else:
                # Save to inactive folder (inactive but not yet 90+ days past archive)
                s3_client.put_object(
                    Bucket=S3_BUCKET,
                    Key=inactive_s3_key,
                    Body=json.dumps(opportunity, indent=2),
                    ContentType='application/json'
                )
                logger.info(f"Saved S3 object to inactive folder: {notice_id}")
                
                # Delete from active folder if it exists
                try:
                    s3_client.delete_object(Bucket=S3_BUCKET, Key=active_s3_key)
                    logger.info(f"Moved S3 object from active to inactive folder: {notice_id}")
                except ClientError as e:
                    if e.response['Error']['Code'] == 'NoSuchKey':
                        logger.info(f"S3 object was already not in active folder: {notice_id}")
                    else:
                        raise
        else:
            # Active record - save to active folder
            s3_client.put_object(
                Bucket=S3_BUCKET,
                Key=active_s3_key,
                Body=json.dumps(opportunity, indent=2),
                ContentType='application/json'
            )
            logger.info(f"Saved S3 object to active folder: {notice_id}")
            
            # Delete from inactive folder if it exists (in case it was previously inactive)
            try:
                s3_client.delete_object(Bucket=S3_BUCKET, Key=inactive_s3_key)
                logger.info(f"Removed S3 object from inactive folder (now active): {notice_id}")
            except ClientError as e:
                if e.response['Error']['Code'] != 'NoSuchKey':
                    logger.warning(f"Error removing from inactive folder: {e}")
        
        return True
        
    except Exception as e:
        logger.error(f"Error with S3 operation for {notice_id}: {type(e).__name__}: {e}")
        return False

def process_opportunity(opportunity: Dict[str, Any], s3_client, dynamodb_client) -> bool:
    """Process a single opportunity and save to S3 and DynamoDB."""
    notice_id = opportunity.get('noticeId', 'unknown')
    
    try:
        # Save to DynamoDB
        dynamodb_success = save_to_dynamodb(opportunity, dynamodb_client)
        
        # Save to S3
        s3_success = save_to_s3(opportunity, s3_client)
        
        if dynamodb_success and s3_success:
            logger.info(f"Successfully processed opportunity: {notice_id}")
            return True
        else:
            logger.error(f"Partial failure processing {notice_id} - DynamoDB: {dynamodb_success}, S3: {s3_success}")
            return False
        
    except Exception as e:
        logger.error(f"Error processing {notice_id}: {type(e).__name__}: {e}")
        return False

def lambda_handler(event, context):
    """Lambda handler for processing SAM.gov opportunities."""
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
    
    # Initialize AWS clients
    try:
        s3_client, dynamodb_client = initialize_clients()
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
                if process_opportunity(message_body, s3_client, dynamodb_client):
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