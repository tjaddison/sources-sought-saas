# sam_gov_reader
# from src.config.secrets import get_config
import boto3
import json
import requests
from datetime import datetime, timedelta, date
import time
from botocore.exceptions import ClientError
import logging
from typing import Dict, List, Optional
from io import StringIO
import csv
import os
from typing import Dict, Generator, Optional, Tuple
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
from contextlib import closing
from io import TextIOWrapper

# Configure logging with more detailed format
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - [%(funcName)s:%(lineno)d] - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
logger = logging.getLogger(__name__)

# Log environment configuration at startup
DAYS_POSTED_FROM = os.environ.get('DAYS_POSTED_FROM', '7')
ACTIVE_REGION = os.environ.get('ACTIVE_REGION', 'us-east-1')
SAM_API_BASE_URL = os.environ.get('SAM_API_BASE_URL')
SAM_OPPS_CSV = os.environ.get('SAM_OPPS_CSV')
SQS_QUEUE_NAME = 'load_sam_opps_queue'

logger.info(f"Environment Configuration - DAYS_POSTED_FROM: {DAYS_POSTED_FROM}, ACTIVE_REGION: {ACTIVE_REGION}")
logger.info(f"SAM_API_BASE_URL: {SAM_API_BASE_URL}")
logger.info(f"SAM_OPPS_CSV: {SAM_OPPS_CSV}")

def lambda_handler(event, context):
    start_time = datetime.now()
    logger.info(f"=== LAMBDA EXECUTION STARTED at {start_time} ===")
    logger.info(f"Lambda function invoked with event: {json.dumps(event) if event else 'No event'}")
    logger.info(f"Lambda context - function_name: {context.function_name if context else 'N/A'}, "
                f"memory_limit: {context.memory_limit_in_mb if context else 'N/A'}, "
                f"remaining_time: {context.get_remaining_time_in_millis() if context else 'N/A'}ms")
    
    # Configuration
    try:
        posted_from = (datetime.now() - timedelta(days=int(DAYS_POSTED_FROM)+1)).strftime('%m/%d/%Y')
        posted_to = datetime.now().strftime('%m/%d/%Y')
        
        logger.info(f"Date range calculation - DAYS_POSTED_FROM: {DAYS_POSTED_FROM} days")
        logger.info(f"Processing opportunities from {posted_from} to {posted_to}")
        logger.info(f"Using SQS queue: {SQS_QUEUE_NAME}")
    except Exception as e:
        logger.error(f"Failed to calculate date range: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Date configuration error', 'details': str(e)})
        }
    
    try:
        # Initialize and run ETL
        logger.info("Initializing SAMOpportunitiesETL...")
        etl = SAMOpportunitiesETL()
        logger.info("ETL initialized successfully, starting ETL process...")
        
        etl.run_etl(posted_from, posted_from)
        
        execution_time = datetime.now() - start_time
        response = {
            'statusCode': 200,
            'body': json.dumps({
                'message': 'ETL process completed successfully',
                'processedDate': posted_from,
                'executionTimeSeconds': execution_time.total_seconds()
            })
        }
        logger.info(f"=== LAMBDA EXECUTION COMPLETED SUCCESSFULLY in {execution_time.total_seconds():.2f} seconds ===")
        return response
        
    except Exception as e:
        execution_time = datetime.now() - start_time
        logger.error(f"=== LAMBDA EXECUTION FAILED after {execution_time.total_seconds():.2f} seconds ===")
        logger.error(f"Lambda execution failed: {str(e)}", exc_info=True)
        return {
            'statusCode': 500,
            'body': json.dumps({
                'error': str(e),
                'message': 'ETL process failed',
                'executionTimeSeconds': execution_time.total_seconds()
            })
        }

def get_secret(secret_name, region_name):
    logger.info(f"Retrieving secret '{secret_name}' from region '{region_name}'")
    session = boto3.session.Session()
    client = session.client(
        service_name='secretsmanager',
        region_name=region_name
    )
    
    try:
        logger.debug(f"Making request to AWS Secrets Manager for secret: {secret_name}")
        response = client.get_secret_value(SecretId=secret_name)
        logger.info(f"Successfully retrieved secret '{secret_name}'")
        return json.loads(response['SecretString'])
    except Exception as e:
        logger.error(f"Failed to retrieve secret '{secret_name}': {str(e)}")
        raise e

def get_config():
    logger.info("Loading configuration from environment and secrets...")
    region = ACTIVE_REGION
    logger.info(f"Using AWS region: {region}")

    # Retrieve secrets from Secrets Manager
    try:
        secrets = get_secret('samgov/api-keys', region)
        logger.info("Successfully loaded secrets from AWS Secrets Manager")
        
        # Log which keys are available (without values)
        secret_keys = list(secrets.keys())
        logger.debug(f"Available secret keys: {secret_keys}")
        
        config = {
            'aws': {
                'region': region,
                'access_key': secrets['AWS_ACCESS_KEY_ID'],
                'secret_key': secrets['AWS_SECRET_ACCESS_KEY']
            },
            'sam_gov': {
                'api_key': secrets['SAM_GOV_API_KEY_2']
            },
            'anthropic': {
                'api_key': secrets['ANTHROPIC_API_KEY']
            }
        }
        
        logger.info("Configuration loaded successfully")
        return config
        
    except KeyError as e:
        logger.error(f"Missing required secret key: {str(e)}")
        raise
    except Exception as e:
        logger.error(f"Failed to load configuration: {str(e)}")
        raise


class OpportunitiesDownloader:
    def __init__(self):
        logger.info("Initializing OpportunitiesDownloader...")
        self.session = self._create_session()
        self.logger = logging.getLogger(__name__ + '.OpportunitiesDownloader')
        logger.info("OpportunitiesDownloader initialized successfully")
        
    def _create_session(self) -> requests.Session:
        """Create a requests session with retry logic."""
        logger.debug("Creating HTTP session with retry logic...")
        session = requests.Session()
        retries = Retry(
            total=3,
            backoff_factor=0.1,
            status_forcelist=[500, 502, 503, 504],
            allowed_methods=["GET"]
        )
        adapter = HTTPAdapter(max_retries=retries)
        session.mount('http://', adapter)
        session.mount('https://', adapter)
        logger.debug("HTTP session created with retry configuration: total=3, backoff=0.1, status_codes=[500,502,503,504]")
        return session

    def _find_column_indices(self, header: list) -> Tuple[Optional[int], Optional[int], Optional[int]]:
        """Find the indices of required columns."""
        logger.debug(f"Searching for required columns in header with {len(header)} columns")
        logger.debug(f"Header columns: {header}")
        
        date_col = notice_col = desc_col = None
        
        for i, col in enumerate(header):
            col_lower = col.lower().strip()
            if col_lower == "posteddate":
                date_col = i
                logger.debug(f"Found 'posteddate' column at index {i}")
            elif col_lower == "noticeid":
                notice_col = i
                logger.debug(f"Found 'noticeid' column at index {i}")
            elif col_lower == "description":
                desc_col = i
                logger.debug(f"Found 'description' column at index {i}")
                
        result = (date_col, notice_col, desc_col)
        missing_columns = []
        if date_col is None:
            missing_columns.append("posteddate")
        if notice_col is None:
            missing_columns.append("noticeid")
        if desc_col is None:
            missing_columns.append("description")
            
        if missing_columns:
            logger.warning(f"Missing required columns: {missing_columns}")
        else:
            logger.info(f"All required columns found - posteddate: {date_col}, noticeid: {notice_col}, description: {desc_col}")
            
        return result

    def _parse_date(self, date_str: str, target_date: datetime.date) -> bool:
        """Try to parse date string using multiple formats."""
        date_formats = ['%Y-%m-%d', '%m/%d/%Y', '%Y/%m/%d', '%m-%d-%Y']
        
        for date_format in date_formats:
            try:
                parsed_date = datetime.strptime(date_str.split()[0], date_format).date()
                matches = parsed_date == target_date
                if matches:
                    logger.debug(f"Date '{date_str}' matches target date {target_date} using format {date_format}")
                return matches
            except ValueError:
                continue
                
        logger.debug(f"Could not parse date '{date_str}' with any known format for target {target_date}")
        return False

    def _process_csv_rows(self, 
                         csv_reader: csv.reader, 
                         column_indices: Tuple[int, int, int], 
                         target_date: datetime.date) -> Generator[Tuple[str, str], None, None]:
        """Process CSV rows and yield matching records."""
        date_col, notice_col, desc_col = column_indices
        logger.debug(f"Processing CSV rows with column indices - date: {date_col}, notice: {notice_col}, desc: {desc_col}")
        
        processed_rows = 0
        matched_rows = 0
        error_rows = 0
        
        for row in csv_reader:
            processed_rows += 1
            
            if processed_rows % 1000 == 0:
                logger.debug(f"Processed {processed_rows} rows, found {matched_rows} matches, {error_rows} errors")
                
            try:
                if len(row) <= max(date_col, notice_col, desc_col):
                    logger.debug(f"Row {processed_rows} has insufficient columns ({len(row)}), skipping")
                    continue
                    
                posted_date = row[date_col].strip()
                if self._parse_date(posted_date, target_date):
                    matched_rows += 1
                    notice_id = row[notice_col]
                    description = row[desc_col]
                    logger.debug(f"Row {processed_rows}: Found matching record - NoticeID: {notice_id}")
                    yield notice_id, description
                    
            except Exception as e:
                error_rows += 1
                logger.warning(f"Error processing row {processed_rows}: {e}")
                continue
                
        logger.info(f"CSV processing complete - Total rows: {processed_rows}, Matches: {matched_rows}, Errors: {error_rows}")

    def download_opportunities_file(self, target_date_str: str) -> Dict[str, str]:
        """
        Fetch and parse contract opportunities for a specific date.
        
        Args:
            target_date_str (str): Date in format 'MM/DD/YYYY'
            
        Returns:
            dict: Dictionary with noticeId as key and description as value
        """
        logger.info(f"Starting download of opportunities file for date: {target_date_str}")
        
        try:
            target_date = datetime.strptime(target_date_str, '%m/%d/%Y').date()
            logger.info(f"Target date parsed successfully: {target_date}")
        except ValueError:
            logger.error(f"Invalid date format. Please use MM/DD/YYYY format. Received: {target_date_str}")
            return {}

        matching_records = {}
        encodings_to_try = ['utf-8', 'latin-1', 'cp1252']
        logger.info(f"Will try encodings in order: {encodings_to_try}")

        try:
            # Download the content once
            logger.info(f"Downloading CSV file from: {SAM_OPPS_CSV}")
            download_start = time.time()
            
            response = self.session.get(
                SAM_OPPS_CSV,
                timeout=(3.05, 27)
            )
            
            download_time = time.time() - download_start
            response.raise_for_status()
            content = response.content
            
            logger.info(f"Download completed in {download_time:.2f} seconds")
            logger.info(f"Downloaded {len(content)} bytes (Content-Type: {response.headers.get('content-type', 'unknown')})")

            # Try different encodings on the content
            for encoding_idx, encoding in enumerate(encodings_to_try):
                logger.info(f"Attempting to decode with encoding {encoding} ({encoding_idx + 1}/{len(encodings_to_try)})")
                
                try:
                    decode_start = time.time()
                    decoded_content = content.decode(encoding)
                    decode_time = time.time() - decode_start
                    
                    logger.info(f"Successfully decoded {len(decoded_content)} characters in {decode_time:.2f} seconds using {encoding}")
                    
                    csv_file = StringIO(decoded_content)
                    csv_reader = csv.reader(csv_file)

                    # Process header
                    logger.debug("Reading CSV header...")
                    header = next(csv_reader, None)
                    if not header:
                        logger.warning(f"No header found in CSV file with encoding {encoding}")
                        continue

                    logger.info(f"CSV header contains {len(header)} columns")
                    column_indices = self._find_column_indices(header)
                    if None in column_indices:
                        logger.error(f"Could not find required columns with encoding {encoding}. Available columns: {header}")
                        continue

                    # Process rows
                    logger.info("Starting CSV row processing...")
                    processing_start = time.time()
                    
                    for notice_id, description in self._process_csv_rows(csv_reader, column_indices, target_date):
                        matching_records[notice_id] = description

                    processing_time = time.time() - processing_start
                    logger.info(f"CSV processing completed in {processing_time:.2f} seconds with encoding {encoding}")

                    # If we got here without errors, break the encoding loop
                    break

                except UnicodeDecodeError as e:
                    logger.warning(f"Failed to decode with {encoding}: {str(e)}")
                    continue
                except Exception as e:
                    logger.error(f"Error processing file with {encoding}: {e}")
                    continue

        except requests.RequestException as e:
            logger.error(f"Error downloading file: {e}")
            if hasattr(e, 'response') and e.response is not None:
                logger.error(f"Response status: {e.response.status_code}, headers: {dict(e.response.headers)}")
            return {}
        except Exception as e:
            logger.error(f"Unexpected error during download: {e}", exc_info=True)
            return {}
        finally:
            logger.debug("Closing HTTP session")
            self.session.close()

        logger.info(f"Download and processing complete: {len(matching_records)} matching records found for date {target_date_str}")
        if matching_records:
            sample_keys = list(matching_records.keys())[:5]
            logger.debug(f"Sample notice IDs found: {sample_keys}")
        
        return matching_records

class SAMOpportunitiesETL:

    def __init__(self):
        """
        Initialize the ETL process with SQS configuration.
        """
        logger.info("Initializing SAMOpportunitiesETL...")
        
        try:
            config = get_config()
            logger.info("Configuration loaded successfully")
            
            # Initialize AWS clients with config
            logger.info("Creating AWS session...")
            session = boto3.Session(
                aws_access_key_id=config['aws']['access_key'],
                aws_secret_access_key=config['aws']['secret_key'],
                region_name=config['aws']['region']
            )
            
            # Initialize SQS client
            logger.info("Initializing SQS client...")
            self.sqs = session.client('sqs')
            
            # Get queue URL from queue name
            logger.info(f"Getting queue URL for: {SQS_QUEUE_NAME}")
            try:
                response = self.sqs.get_queue_url(QueueName=SQS_QUEUE_NAME)
                self.queue_url = response['QueueUrl']
                logger.info(f"Successfully obtained SQS queue URL: {self.queue_url}")
            except ClientError as e:
                logger.error(f"Failed to get queue URL for {SQS_QUEUE_NAME}: {e}")
                raise
            
            self.base_url = SAM_API_BASE_URL
            self.api_key = config['sam_gov']['api_key']
            
            logger.info(f"Using SAM.gov API base URL: {self.base_url}")
            logger.info(f"API key configured: {'Yes' if self.api_key else 'No'}")
            logger.info("SAMOpportunitiesETL initialization complete")
            
        except Exception as e:
            logger.error(f"Failed to initialize SAMOpportunitiesETL: {str(e)}")
            raise

    def fetch_opportunities(self, posted_from: str, posted_to: str, limit: int = 1000) -> List[Dict]:
        """
        Fetch all opportunities using pagination.
        
        Args:
            posted_from: Start date in MM/DD/YYYY format
            posted_to: End date in MM/DD/YYYY format
            limit: Number of records per page
            
        Returns:
            List of opportunity records
        """
        logger.info(f"Starting fetch of opportunities from {posted_from} to {posted_to}")
        logger.info(f"Using pagination limit: {limit} records per page")
        
        all_opportunities = []
        offset = 0
        page_count = 0
        
        while True:
            page_count += 1
            logger.info(f"Fetching page {page_count} (offset: {offset})...")

            try:
                url = f'{self.base_url}?limit={limit}&api_key={self.api_key}&postedFrom={posted_from}&postedTo={posted_to}&offset={offset}'
                logger.debug(f"API request URL: {url.replace(self.api_key, 'REDACTED')}")
                
                request_start = time.time()
                response = requests.get(url)
                request_time = time.time() - request_start

                logger.info(f"API request completed in {request_time:.2f} seconds (Status: {response.status_code})")
                response.raise_for_status()
                
                data = response.json()
                
                opportunities = data.get('opportunitiesData', [])
                total_records = data.get('totalRecords', 0)
                
                logger.info(f"Page {page_count}: Received {len(opportunities)} records")
                logger.info(f"Total records available: {total_records}")
                
                if not opportunities:
                    logger.info("No more opportunities found, ending pagination")
                    break
                    
                all_opportunities.extend(opportunities)
                current_total = len(all_opportunities)
                logger.info(f"Progress: {current_total}/{total_records} records fetched ({(current_total/total_records*100):.1f}%)")
                
                if current_total >= total_records:
                    logger.info("All available records have been fetched")
                    break
                    
                offset += limit
                
                # Add a small delay to avoid hitting rate limits
                logger.debug("Adding 0.5s delay between requests to respect rate limits")
                time.sleep(0.5)
                
            except requests.RequestException as e:
                logger.error(f"Error fetching data on page {page_count}: {e}")
                if hasattr(e, 'response') and e.response is not None:
                    logger.error(f"Response status: {e.response.status_code}")
                    logger.error(f"Response content: {e.response.text[:500]}...")
                raise
            except Exception as e:
                logger.error(f"Unexpected error on page {page_count}: {e}")
                raise
                
        logger.info(f"Fetch complete: Retrieved {len(all_opportunities)} opportunities across {page_count} pages")
        return all_opportunities

    def save_to_queue(self, opportunities: List[Dict], posted_date: str):
        """
        Send opportunities to SQS queue for processing.
        
        Args:
            opportunities: List of opportunity records to save
            posted_date: Date string in MM/DD/YYYY format
        """
        logger.info(f"Starting to save {len(opportunities)} opportunities to SQS queue for date {posted_date}")
        
        if not self.queue_url:
            logger.error(f"Queue URL not available for {SQS_QUEUE_NAME}")
            raise ValueError(f"Failed to get queue URL for {SQS_QUEUE_NAME}")
            
        # Get descriptions for all opportunities for this date
        logger.info(f"Fetching detailed descriptions for {len(opportunities)} opportunities on {posted_date}")
        description_start = time.time()
        
        downloader = OpportunitiesDownloader()
        descriptions = downloader.download_opportunities_file(posted_date)
        
        description_time = time.time() - description_start
        logger.info(f"Description fetch completed in {description_time:.2f} seconds")
        logger.info(f"Retrieved descriptions for {len(descriptions)} opportunities")
        
        successful_sends = 0
        failed_sends = 0
        skipped_items = 0
        
        logger.info("Starting to send messages to SQS queue...")
        send_start = time.time()
        
        for idx, item in enumerate(opportunities, 1):
            try:
                notice_id = item.get('noticeId')
                if not notice_id:
                    logger.warning(f"Item {idx}/{len(opportunities)}: Skipping item without noticeId")
                    skipped_items += 1
                    continue

                # Add description from the descriptions dictionary
                description = descriptions.get(notice_id, '')
                item['OppDescription'] = description
                
                if description:
                    logger.debug(f"Item {idx}: Added description for notice {notice_id} ({len(description)} chars)")
                else:
                    logger.debug(f"Item {idx}: No description found for notice {notice_id}")
                
                clean_item = self._clean_item(item)
                
                # Send to SQS queue
                message_body = json.dumps(clean_item)
                message_size = len(message_body.encode('utf-8'))
                
                logger.debug(f"Item {idx}: Sending message for notice {notice_id} (size: {message_size} bytes)")
                
                response = self.sqs.send_message(
                    QueueUrl=self.queue_url,
                    MessageBody=message_body,
                    MessageAttributes={
                        'noticeId': {
                            'StringValue': notice_id,
                            'DataType': 'String'
                        },
                        'postedDate': {
                            'StringValue': posted_date,
                            'DataType': 'String'
                        }
                    }
                )
                
                logger.debug(f"Item {idx}: Successfully sent notice {notice_id} to queue. MessageId: {response['MessageId']}")
                successful_sends += 1
                
                if successful_sends % 50 == 0:
                    logger.info(f"Progress: {successful_sends}/{len(opportunities)} messages sent successfully")

            except ClientError as e:
                error_code = e.response['Error']['Code'] if e.response else 'Unknown'
                logger.error(f"Item {idx}: AWS error sending notice {item.get('noticeId')} to queue: {error_code} - {e}")
                failed_sends += 1
            except Exception as e:
                logger.error(f"Item {idx}: Unexpected error processing notice {item.get('noticeId')}: {e}")
                failed_sends += 1
        
        send_time = time.time() - send_start
        total_processed = successful_sends + failed_sends + skipped_items
        
        logger.info(f"Queue send operation completed in {send_time:.2f} seconds")
        logger.info(f"Summary: {successful_sends} successful, {failed_sends} failed, {skipped_items} skipped out of {total_processed} total items")
        
        if failed_sends > 0:
            logger.warning(f"Failed to send {failed_sends} messages to queue - check error logs above")
        
        success_rate = (successful_sends / len(opportunities) * 100) if opportunities else 0
        logger.info(f"Success rate: {success_rate:.1f}%")

    def _clean_item(self, item: Dict) -> Dict:
        """
        Clean item for JSON serialization.
        
        Args:
            item: Dictionary item to clean
            
        Returns:
            Cleaned dictionary
        """
        logger.debug(f"Cleaning item for JSON serialization: {item.get('noticeId', 'unknown')}")
        
        def clean_value(value):
            if isinstance(value, (int, float, str, bool)):
                return value
            elif isinstance(value, (datetime, date)):
                return value.isoformat()
            elif isinstance(value, dict):
                return {k: clean_value(v) for k, v in value.items() if v is not None}
            elif isinstance(value, list):
                return [clean_value(v) for v in value if v is not None]
            elif value is None:
                return None
            else:
                return str(value)

        cleaned = {k: clean_value(v) for k, v in item.items() if v is not None}
        original_size = len(item)
        cleaned_size = len(cleaned)
        
        if original_size != cleaned_size:
            logger.debug(f"Item cleaning removed {original_size - cleaned_size} null/empty fields")
            
        return cleaned

    def run_etl(self, posted_from: str, posted_to: str):
        """
        Run the complete ETL process.
        Args:
            posted_from: Start date in MM/DD/YYYY format
            posted_to: End date in MM/DD/YYYY format
        """
        etl_start = time.time()
        logger.info(f"=== STARTING ETL PROCESS ===")
        logger.info(f"Date range: {posted_from} to {posted_to}")
        
        try:
            logger.info("Phase 1: Fetching opportunities from SAM.gov API...")
            
            # Try to fetch opportunities, with fallback to cache
            try:
                fetch_start = time.time()
                opportunities = self.fetch_opportunities(posted_from, posted_to)
                fetch_time = time.time() - fetch_start
                
                logger.info(f"Phase 1 complete: Fetched {len(opportunities)} opportunities in {fetch_time:.2f} seconds")
                
                if opportunities:
                    # Log some statistics about the opportunities
                    notice_ids = [opp.get('noticeId') for opp in opportunities if opp.get('noticeId')]
                    unique_notice_ids = set(notice_ids)
                    logger.info(f"Opportunity statistics: {len(unique_notice_ids)} unique notice IDs out of {len(opportunities)} total records")
                    
                    if len(notice_ids) != len(unique_notice_ids):
                        logger.warning(f"Found {len(notice_ids) - len(unique_notice_ids)} duplicate notice IDs")
                else:
                    logger.warning("No opportunities were fetched from API")
                    
            except Exception as fetch_error:
                logger.error(f"Phase 1 failed: Could not fetch opportunities: {fetch_error}")
                raise
            
            logger.info("Phase 2: Processing opportunities by date and sending to queue...")
            
            # Since the get_opportunities function works with a single date,
            # and we might have a date range, we'll process each date separately
            current_date = datetime.strptime(posted_from, '%m/%d/%Y')
            end_date = datetime.strptime(posted_to, '%m/%d/%Y')
            
            date_range = (end_date - current_date).days + 1
            logger.info(f"Processing {date_range} date(s) from {posted_from} to {posted_to}")
            
            total_processed = 0
            dates_processed = 0
            
            while current_date <= end_date:
                date_str = current_date.strftime('%m/%d/%Y')
                logger.info(f"Processing date {date_str} ({dates_processed + 1}/{date_range})...")
                
                # Filter opportunities for current date
                current_opps = [opp for opp in opportunities
                            if datetime.strptime(opp['postedDate'].split('T')[0], '%Y-%m-%d').strftime('%m/%d/%Y') == date_str]
                
                logger.info(f"Found {len(current_opps)} opportunities for date {date_str}")
                
                if current_opps:
                    date_process_start = time.time()
                    self.save_to_queue(current_opps, date_str)
                    date_process_time = time.time() - date_process_start
                    
                    total_processed += len(current_opps)
                    logger.info(f"Date {date_str} processing completed in {date_process_time:.2f} seconds")
                else:
                    logger.info(f"No opportunities found for date {date_str}, skipping queue operations")
                
                dates_processed += 1
                current_date += timedelta(days=1)
            
            etl_time = time.time() - etl_start
            logger.info(f"=== ETL PROCESS COMPLETED SUCCESSFULLY ===")
            logger.info(f"Total execution time: {etl_time:.2f} seconds")
            logger.info(f"Dates processed: {dates_processed}")
            logger.info(f"Total opportunities processed: {total_processed}")
            logger.info(f"Average processing rate: {total_processed/etl_time:.1f} opportunities/second")
                
        except Exception as e:
            etl_time = time.time() - etl_start
            logger.error(f"=== ETL PROCESS FAILED after {etl_time:.2f} seconds ===")
            logger.error(f"ETL process failed: {e}", exc_info=True)
            raise
        