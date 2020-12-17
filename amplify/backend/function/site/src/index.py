"""Fetches all test sites """

import json
import logging
import urllib3
import boto3
from pprint import pprint as pp

import aws_utility

LOGGER = logging.getLogger()
LOGGER.setLevel(logging.INFO)

def handler(event, context):
    """
    Fetch all test sites
    """
    try:
        if event["httpMethod"] == "GET":
            body = get_test_sites()
        elif event["httpMethod"] == "POST":
            body = create_test_site(event)
        else:
            status_code = 404
            body = {}

        status_code = 200
    except Exception as err:
        logging.error("Unexpected error: %s", err)
        body = {
            "message": "Unexpected error"
        }
        status_code = 500
    return {
        "statusCode": status_code,
        "headers": {
            "content-type": "application/json"
        },
        "body": json.dumps(body)
    }

def get_test_sites():
    """
    Gets all test sites

    Returns:
        test_sites (List): List of active test sites
    """
    all_test_sites = []
    client = boto3.client('cloudformation')
    response = client.describe_stacks()
    while len(response['Stacks']) > 0:
        for stack in response['Stacks']:
            if stack['StackName'].startswith('precit-app'):
                # Converting datetime object to string
                stack['CreationTime'] = str(stack['CreationTime'])
                all_test_sites.append(stack)
        if not response.get('NextToken'):
            break
        response = client.describe_stacks(
            NextToken=response['NextToken']
        )
    return all_test_sites

def create_test_site(event):
    body = json.loads(event['body'])
    execute_create_test_site(body['app_tag'], body.get('s3_backup_db_path'), body['site_name'], "399999")
    return {}


def execute_create_test_site(app_tag, s3_backup_db_path, site_name, site_id):
    """
    Executes main logic
    Parameters:
        app_tag (string): Tag for the container image for a specific branch.
                            Only contains dashes and underscores.
        s3_backup_db_path (string): The path for the backup file to restore. If not present,
                                    will use unified template.
        site_name (string): name of the site.
        site_id (number): id of the site, as recorded in internal.dev.shotguncloud.com
    Side Effect:
        Prints out the URL of the newly created site
    """
    try:
        if s3_backup_db_path:
            # Validate extension
            if not s3_backup_db_path.endswith(tuple(VALID_BACKUP_EXTENSIONS)):
                logging.error(
                    "Invalid S3 backup DB extension. Valid extensions are: %s",
                    VALID_BACKUP_EXTENSIONS
                )
                sys.exit(1)

            # Check for file existence
            if not aws_utility.check_s3_object_exists(s3_backup_db_path):
                logging.error("S3 backup %s does not exist", s3_backup_db_path)
                sys.exit(1)

        # Convert underscores and only take first 60 characters
        if site_name:
            site_name = aws_utility.sanitize_site_name(site_name)
        else:
            site_name = aws_utility.get_site_name_from_app_tag(app_tag)
        stack_name = aws_utility.get_stack_name_from_site_name(site_name)
        aws_utility.create_stack(
            app_tag=app_tag,
            site_name=site_name,
            site_id=site_id,
            stack_name=stack_name,
            s3_backup_db_path=s3_backup_db_path
        )
        # stack_status = aws_utility.wait_for_stack_completion(
        #     stack_name=stack_name,
        #     status_in_progress=aws_utility.STATUS_CREATE_IN_PROGRESS,
        #     in_progress_message="Site is currently building. Waiting..."
        # )
        # if stack_status != aws_utility.STATUS_CREATE_COMPLETE:
        #     logging.warning("Failed to create precit site %s: %s", app_tag, stack_status)
        #     sys.exit(1)
        # stack_info = aws_utility.describe_stack(stack_name=stack_name)
        # site_url = aws_utility.get_output_from_stack(stack_info, "SiteURL")
        # logging.info("Successfully created precit site: %s", "https://{}".format(site_url))
    except aws_utility.JobNotCompleteException as err:
        logging.warning("Error creating stack: %s", err)
        sys.exit(1)
    except aws_utility.StackOutputException as err:
        logging.warning("Unable to find site URL: %s", err)
        sys.exit(1)

if __name__ == "__main__":
    print("main")
    body = {
        "app_tag": "master",
        "site_name": "test3"
    }

    payload = handler({"httpMethod": "POST", "body": json.dumps(body)}, {})
    pp(payload)
