"""Fetches all test sites """

import json
import logging
import urllib3
import boto3

LOGGER = logging.getLogger()
LOGGER.setLevel(logging.INFO)

def handler(event, context):
    """
    Fetch all test sites
    """
    try:
        body = get_test_sites()
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
