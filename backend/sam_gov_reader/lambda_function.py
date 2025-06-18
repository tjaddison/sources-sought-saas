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

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

DAYS_POSTED_FROM = os.environ['DAYS_POSTED_FROM']
ACTIVE_REGION = os.environ['ACTIVE_REGION']
SAM_API_BASE_URL = os.environ['SAM_API_BASE_URL']
SAM_OPPS_CSV = os.environ['SAM_OPPS_CSV']
SQS_QUEUE_NAME = 'load_sam_opps_queue'

def lambda_handler(event, context):
    logger.info(f"Lambda function invoked with event: {json.dumps(event) if event else 'No event'}")
    
    # Configuration
    posted_from = (datetime.now() - timedelta(days=int(DAYS_POSTED_FROM)+1)).strftime('%m/%d/%Y')
    posted_to = datetime.now().strftime('%m/%d/%Y')
    
    logger.info(f"Processing opportunities from {posted_from} to {posted_to}")
    logger.info(f"Using queue: {SQS_QUEUE_NAME}")
    
    try:
        # Initialize and run ETL
        etl = SAMOpportunitiesETL()
        etl.run_etl(posted_from, posted_from)
        
        response = {
            'statusCode': 200,
            'body': json.dumps({
                'message': 'ETL process completed successfully',
                'processedDate': posted_from
            })
        }
        logger.info("Lambda execution completed successfully")
        return response
        
    except Exception as e:
        logger.error(f"Lambda execution failed: {str(e)}", exc_info=True)
        return {
            'statusCode': 500,
            'body': json.dumps({
                'error': str(e),
                'message': 'ETL process failed'
            })
        }

def get_secret(secret_name, region_name):
    session = boto3.session.Session()
    client = session.client(
        service_name='secretsmanager',
        region_name=region_name
    )
    
    try:
        response = client.get_secret_value(SecretId=secret_name)
        return json.loads(response['SecretString'])
    except Exception as e:
        raise e

def get_config():
    region = ACTIVE_REGION

    # Retrieve secrets from Secrets Manager
    secrets = get_secret('samgov/api-keys', region)
    
    return {
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


class OpportunitiesDownloader:
    def __init__(self):
        self.session = self._create_session()
        self.logger = logging.getLogger(__name__)
        
    def _create_session(self) -> requests.Session:
        """Create a requests session with retry logic."""
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
        return session

    def _find_column_indices(self, header: list) -> Tuple[Optional[int], Optional[int], Optional[int]]:
        """Find the indices of required columns."""
        date_col = notice_col = desc_col = None
        
        for i, col in enumerate(header):
            col_lower = col.lower().strip()
            if col_lower == "posteddate":
                date_col = i
            elif col_lower == "noticeid":
                notice_col = i
            elif col_lower == "description":
                desc_col = i
                
        return date_col, notice_col, desc_col

    def _parse_date(self, date_str: str, target_date: datetime.date) -> bool:
        """Try to parse date string using multiple formats."""
        date_formats = ['%Y-%m-%d', '%m/%d/%Y', '%Y/%m/%d', '%m-%d-%Y']
        
        for date_format in date_formats:
            try:
                parsed_date = datetime.strptime(date_str.split()[0], date_format).date()
                return parsed_date == target_date
            except ValueError:
                continue
        return False

    def _process_csv_rows(self, 
                         csv_reader: csv.reader, 
                         column_indices: Tuple[int, int, int], 
                         target_date: datetime.date) -> Generator[Tuple[str, str], None, None]:
        """Process CSV rows and yield matching records."""
        date_col, notice_col, desc_col = column_indices
        
        for row in csv_reader:
            try:
                if len(row) <= max(date_col, notice_col, desc_col):
                    continue
                    
                posted_date = row[date_col].strip()
                if self._parse_date(posted_date, target_date):
                    yield row[notice_col], row[desc_col]
            except Exception as e:
                self.logger.warning(f"Error processing row: {e}")
                continue

    def download_opportunities_file(self, target_date_str: str) -> Dict[str, str]:
        """
        Fetch and parse contract opportunities for a specific date.
        
        Args:
            target_date_str (str): Date in format 'MM/DD/YYYY'
            
        Returns:
            dict: Dictionary with noticeId as key and description as value
        """
        try:
            target_date = datetime.strptime(target_date_str, '%m/%d/%Y').date()
        except ValueError:
            self.logger.error(f"Invalid date format. Please use MM/DD/YYYY format. Received: {target_date_str}")
            return {}

        matching_records = {}
        encodings_to_try = ['utf-8', 'latin-1', 'cp1252']

        try:
            # Download the content once
            response = self.session.get(
                SAM_OPPS_CSV,
                timeout=(3.05, 27)
            )
            response.raise_for_status()
            content = response.content

            # Try different encodings on the content
            for encoding in encodings_to_try:
                try:
                    decoded_content = content.decode(encoding)
                    csv_file = StringIO(decoded_content)
                    csv_reader = csv.reader(csv_file)

                    # Process header
                    header = next(csv_reader, None)
                    if not header:
                        continue

                    column_indices = self._find_column_indices(header)
                    if None in column_indices:
                        self.logger.error(f"Could not find required columns. Available columns: {header}")
                        continue

                    # Process rows
                    for notice_id, description in self._process_csv_rows(csv_reader, column_indices, target_date):
                        matching_records[notice_id] = description

                    # If we got here without errors, break the encoding loop
                    break

                except UnicodeDecodeError:
                    self.logger.warning(f"Failed to decode with {encoding}")
                    continue
                except Exception as e:
                    self.logger.error(f"Error processing file with {encoding}: {e}")
                    continue

        except requests.RequestException as e:
            self.logger.error(f"Error downloading file: {e}")
            return {}
        except Exception as e:
            self.logger.error(f"Unexpected error: {e}")
            return {}
        finally:
            self.session.close()

        self.logger.info(f"{len(matching_records)} matching records found.")
        return matching_records

class SAMOpportunitiesETL:

    def __init__(self):
        """
        Initialize the ETL process with SQS configuration.
        """
        config = get_config()
        
        # Initialize AWS clients with config
        session = boto3.Session(
            aws_access_key_id=config['aws']['access_key'],
            aws_secret_access_key=config['aws']['secret_key'],
            region_name=config['aws']['region']
        )
        
        # Initialize SQS client
        self.sqs = session.client('sqs')
        
        # Get queue URL from queue name
        try:
            response = self.sqs.get_queue_url(QueueName=SQS_QUEUE_NAME)
            self.queue_url = response['QueueUrl']
            logger.info(f"Using SQS queue: {self.queue_url}")
        except ClientError as e:
            logger.error(f"Failed to get queue URL for {SQS_QUEUE_NAME}: {e}")
            raise
        
        self.base_url = SAM_API_BASE_URL
        self.api_key = config['sam_gov']['api_key']

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
        all_opportunities = []
        offset = 0
        
        while True:

            try:
                url = f'{self.base_url}?limit={limit}&api_key={self.api_key}&postedFrom={posted_from}&postedTo={posted_to}&offset={offset}'
                response = requests.get(url)

                response.raise_for_status()
                data = response.json()
                
                opportunities = data.get('opportunitiesData', [])
                total_records = data.get('totalRecords', 0)
                
                if not opportunities:
                    break
                    
                all_opportunities.extend(opportunities)
                logger.info(f"Fetched {len(opportunities)} records. Total processed: {len(all_opportunities)}/{total_records}")
                
                if len(all_opportunities) >= total_records:
                    break
                    
                offset += limit
                
                # Add a small delay to avoid hitting rate limits
                time.sleep(0.5)
                
            except requests.RequestException as e:
                logger.error(f"Error fetching data: {e}")
                raise
                
        logger.info(f"Fetched {len(all_opportunities)} opportunities.")
        return all_opportunities

    

    def save_to_queue(self, opportunities: List[Dict], posted_date: str):
        """
        Send opportunities to SQS queue for processing.
        
        Args:
            opportunities: List of opportunity records to save
            posted_date: Date string in MM/DD/YYYY format
        """
        if not self.queue_url:
            logger.error(f"Queue URL not available for {SQS_QUEUE_NAME}")
            raise ValueError(f"Failed to get queue URL for {SQS_QUEUE_NAME}")
            
        # Get descriptions for all opportunities for this date
        logger.info(f"Fetching descriptions for {len(opportunities)} opportunities on {posted_date}")
        downloader = OpportunitiesDownloader()
        descriptions = downloader.download_opportunities_file(posted_date)
        
        successful_sends = 0
        failed_sends = 0
        
        for item in opportunities:
            try:
                notice_id = item.get('noticeId')
                if not notice_id:
                    logger.warning("Skipping item without noticeId")
                    continue

                # Add description from the descriptions dictionary
                description = descriptions.get(notice_id, '')
                item['OppDescription'] = description
                
                clean_item = self._clean_item(item)
                
                # Send to SQS queue
                message_body = json.dumps(clean_item)
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
                
                logger.debug(f"Successfully sent notice {notice_id} to queue. MessageId: {response['MessageId']}")
                successful_sends += 1

            except ClientError as e:
                logger.error(f"Error sending item {item.get('noticeId')} to queue: {e}")
                failed_sends += 1
            except Exception as e:
                logger.error(f"Unexpected error processing item {item.get('noticeId')}: {e}")
                failed_sends += 1
        
        logger.info(f"Queue send summary: {successful_sends} successful, {failed_sends} failed out of {len(opportunities)} total")

    def _clean_item(self, item: Dict) -> Dict:
        """
        Clean item for JSON serialization.
        
        Args:
            item: Dictionary item to clean
            
        Returns:
            Cleaned dictionary
        """
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

        return {k: clean_value(v) for k, v in item.items() if v is not None}

    def run_etl(self, posted_from: str, posted_to: str):
        """
        Run the complete ETL process.
        Args:
            posted_from: Start date in MM/DD/YYYY format
            posted_to: End date in MM/DD/YYYY format
        """
        try:
            logger.info("Starting ETL process...")
            
            # Try to fetch opportunities, with fallback to cache
            try:
                opportunities = self.fetch_opportunities(posted_from, posted_to)
                logger.info(f"Processing {len(opportunities)} total records")
            except Exception as fetch_error:
                logger.error(f"Failed to fetch opportunities: {fetch_error}")
                raise
            
            
            # Since the get_opportunities function works with a single date,
            # and we might have a date range, we'll process each date separately
            current_date = datetime.strptime(posted_from, '%m/%d/%Y')
            end_date = datetime.strptime(posted_to, '%m/%d/%Y')
            
            while current_date <= end_date:
                date_str = current_date.strftime('%m/%d/%Y')
                # Filter opportunities for current date
                current_opps = [opp for opp in opportunities
                            if datetime.strptime(opp['postedDate'].split('T')[0], '%Y-%m-%d').strftime('%m/%d/%Y') == date_str]
                
                if current_opps:
                    logger.info(f"Processing {len(current_opps)} opportunities for date {date_str}")
                    self.save_to_queue(current_opps, date_str)
                
                current_date += timedelta(days=1)
            
            logger.info("ETL process completed successfully")
                
        except Exception as e:
            logger.error(f"ETL process failed: {e}", exc_info=True)
            raise
        