"""
AWS Utility module containing all calls for the precit workflow
"""
import json
import logging
import re
import subprocess
import boto3

# from retrying import retry

BACKUP_REPOSITORY_BUCKET = "sg-backup-repository"
BACKUP_SCRIPT = './script/create_backup.sh'
TEMPLATE_URL_S3_PATH = "https://sg-test-templates.s3-us-west-2.amazonaws.com/precit/sg-precit-app.yml"
PRECIT_ECS_CLUSTER = "arn:aws:ecs:us-west-2:627791357434:cluster/precit"
PRECIT_PROFILE = 'default'
END_TASK_STATUS = 'STOPPED'
TASK_SECURITY_GROUPS = [
    "sg-0db003b7b4a7a8253"
]
TASK_SUBNETS = [
    "subnet-00bdf25386c87fcc7",
    "subnet-0d090146fd3981063"
]


# Cloudformation Stack Statuses
# https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-describing-stacks.html
STATUS_CREATE_COMPLETE = "CREATE_COMPLETE"
STATUS_CREATE_IN_PROGRESS = "CREATE_IN_PROGRESS"
STATUS_DELETE_COMPLETE = "DELETE_COMPLETE"
STATUS_DELETE_IN_PROGRESS = "DELETE_IN_PROGRESS"


class StackOutputException(Exception):
    """Raised when output does not exist"""


class JobNotCompleteException(Exception):
    """Wait job processing not completed"""


class EntityCouldNotBeFoundException(Exception):
    """Unable to find stack"""


def check_s3_object_exists(s3_path):
    """
    Checks that the object in the s3_path exists

    Parameters:
        s3_path (string): S3 path such as s3://bucket-name/prefix/file_name

    Returns:
        exist_flag (boolean)
    """
    command = [
        "aws", "s3", "ls",
        s3_path
    ]
    try:
        subprocess.check_output(command)
    except subprocess.CalledProcessError as err:
        logging.error(err)
        return False
    return True


def create_stack(app_tag, site_name, site_id, stack_name, s3_backup_db_path, s3_prefix=None):
    """
    Creates CloudFormation stack for a specified site

    Parameters:
        app_tag (string): Container image tag for the specified Shotgun branch
        site_name (string): Name of the site. Only alphanumeric characters and dashes allowed
        site_id (number): Id of the site, as recorded in internal.dev.shotguncloud.com
        stack_name (string): Stack name in CloudFormation.
        s3_prefix (string): Prefix for site. Default value is same as "site_name"
        s3_backup_db_path (string): s3 path to the .dump or .sql.gz backup file

    Returns:
        stack_arn (string): CloudFormation Stack ARN
    """
    if not s3_prefix:
        s3_prefix = site_name

    client = boto3.client('cloudformation')

    response = client.create_stack(
        StackName=stack_name,
        TemplateURL=TEMPLATE_URL_S3_PATH,
        Parameters=[
            {
                'ParameterKey': 'AppTag',
                'ParameterValue': app_tag
            },
            {
                'ParameterKey': 'SiteId',
                'ParameterValue': site_id
            },
            {
                'ParameterKey': 'SiteName',
                'ParameterValue': site_name
            },
            {
                'ParameterKey': 'S3Prefix',
                'ParameterValue': s3_prefix
            },
            {
                'ParameterKey': 'DatabaseName',
                'ParameterValue': site_name
            },
        ],
        Tags=[
        {
            'Key': 'adsk:moniker',
            'Value': 'SHOTGUN-C-UW2'
        },
    ],
    )

    return response['StackId']

    # command = [
    #     "aws", "cloudformation", "create-stack",
    #     "--stack-name", stack_name,
    #     "--template-url", TEMPLATE_URL_S3_PATH,
    #     "--tags", "Key=adsk:moniker,Value=SHOTGUN-C-UW2",
    #     "--parameters",
    #     "ParameterKey=AppTag,ParameterValue={}".format(app_tag),
    #     "ParameterKey=SiteId,ParameterValue={}".format(site_id),
    #     "ParameterKey=SiteName,ParameterValue={}".format(site_name),
    #     "ParameterKey=S3Prefix,ParameterValue={}".format(s3_prefix),
    #     "ParameterKey=DatabaseName,ParameterValue={}".format(site_name),
    # ]
    # if s3_backup_db_path:
    #     command.append("ParameterKey=S3BackupDBPath,ParameterValue={}".format(s3_backup_db_path))

    # output = subprocess.check_output(command)
    # stack_arn = json.loads(output)['StackId']
    # return stack_arn


def delete_stack(stack_name):
    """
    Deletes a CloudFormation Stack

    Parameters:
        stack_name (string): Stack name in CloudFormation. StackID also works

    """
    command = [
        "aws", "cloudformation", "delete-stack",
        "--stack-name", stack_name,
    ]
    subprocess.check_call(command)


def describe_service(service_name):
    """
    Gets the details for a ECS SErvice

    Parameters:
        service_name (string): Name of the service

    Returns:
        service_info (dictionary): Information about the specified service.
    """
    command = [
        "aws", "ecs", "describe-services",
        "--cluster", PRECIT_ECS_CLUSTER,
        "--service", service_name,
        "--query", "services[0]"
    ]
    try:
        output = subprocess.check_output(command)
    except subprocess.CalledProcessError as err:
        logging.error(err)
        if err.returncode == 255:
            raise EntityCouldNotBeFoundException("Service could not be found")

    return json.loads(output)


def describe_stack(stack_name):
    """
    Gets the details for a CloudFormation Stack

    Parameters:
        stack_name (string): Stack name in CloudFormation.

    Returns:
        stack_info (dictionary): Information about the specified stack. Example:
            {
                'CreationTime': '2020-04-24T03:30:03.364Z',
                'Description': 'Create a Pre-CIT stack for a single Shotgun site',
                'DisableRollback': False,
                'NotificationARNs': [],
                'Outputs': [{'Description': 'Test Site URL',
                             'OutputKey': 'SiteURL',
                             'OutputValue': 'ticket-SG-10000-test-stack.test.shotguncloud.com'}],
                'Parameters': [{'ParameterKey': 'AppTag',
                               'ParameterValue': 'ticket-SG-17078_importer_timelog_tickets'},
                              {'ParameterKey': 'AppDomain',
                               'ParameterValue': 'test.shotguncloud.com'},
                              {'ParameterKey': 'SiteName',
                               'ParameterValue': 'ticket-SG-10000-test-stack'},
                              {'ParameterKey': 'S3Prefix',
                               'ParameterValue': 'ticket-SG-10000-test-stack'},
                'StackId': 'arn:aws:cloudformation:us-west-2:627791357434:stack/ticket-SG-10000...',
                'StackName': 'ticket-SG-10000-test-stack',
                'StackStatus': 'CREATE_COMPLETE',
                'Tags': [{'Key': 'adsk:moniker',
                        'Value': 'SHOTGUN-C-UW2'}]
            }
    """
    command = [
        "aws", "cloudformation", "describe-stacks",
        "--stack-name", stack_name,
    ]
    try:
        output = subprocess.check_output(command)
    except subprocess.CalledProcessError as err:
        logging.error(err)
        if err.returncode == 255:
            raise EntityCouldNotBeFoundException("Stack could not be found")

    return json.loads(output)['Stacks'][0]


def get_output_from_stack(stack_info, output_key):
    """
    Gets the value specified by the output_key from a Cloudformation stack

    Parameters:
        stack_info (dictionary): Details from a Cloudformation stack
        output_key (string): Parameter Key for the output of interest

    Returns:
        output_value (string): Value of the specified output_key

    Raises:
        StackOutputException: If output does not exist in stack_info
    """
    outputs = stack_info.get('Outputs')
    if not outputs:
        raise StackOutputException("No outputs exist for the stack")

    for output in outputs:
        if output['OutputKey'] == output_key:
            return output['OutputValue']

    raise StackOutputException(
        "Key {} does not exist in outputs".format(output_key))


def get_site_name_from_app_tag(app_tag):
    """
    Gets the site name / stack name used from the app tag.

    Parameters:
        app_tag (string): Tag for the container image for a specific branch.
                          Only contains dashes and underscores.

    Returns:
        site_name (string): Name of site used in domain name.
    """
    site_name = sanitize_site_name(app_tag)
    return site_name


def sanitize_site_name(site_name):
    """
    Sanitize the site name.. Stack name limitation
    is that only dashes are allowed, and also a max of 63 characters.

    Parameters:
        site_name (string): Raw site name.

    Returns:
        site_name (string): Name of site used in domain name.
    """
    return re.sub('[_.]', '-', site_name)[:60].lower().strip('-')


def get_stack_name_from_app_tag(app_tag):
    """
    Gets the site name / stack name used from the app tag. Stack name limitation
    is that only dashes are allowed, and also a max of 63 characters.

    Parameters:
        app_tag (string): Tag for the container image for a specific branch.
                          Only contains dashes and underscores.

    Returns:
        stack_name (string): Name of cloudformation stack
    """
    site_name = get_site_name_from_app_tag(app_tag)
    stack_name = get_stack_name_from_site_name(site_name)
    return stack_name


def get_stack_name_from_site_name(site_name):
    """
    Gets the site name / stack name used from the app tag. Stack name limitation
    is that only dashes are allowed, and also a max of 63 characters.

    Parameters:
        site_name (string): Site name

    Returns:
        stack_name (string): Name of cloudformation stack
    """
    stack_name = "precit-app-{}".format(site_name)
    return stack_name


def get_task_container(task_arn, container_name):
    """
    Gets back the details of a container from a task execution

    Paramters:
        task_arn (string): task ARN
        container_name (string): Name of the container in the task. Same as site_name
                                 most of the time

    Returns:
        result (dict): Retrieves the container information
    """
    command = [
        "aws", "ecs", "describe-tasks",
        "--cluster", PRECIT_ECS_CLUSTER,
        "--tasks", task_arn,
        "--output", "json",
        "--query", "tasks[0].containers[?name==`{}`]".format(container_name)
    ]
    return json.loads(subprocess.check_output(command))[0]


def get_task_arn(site_name):
    """
    Gets the task ARN running in an ECS service from the site name

    Parameters:
        site_name (string): Name of the site. Only alphanumeric characters and dashes allowed

    Returns:
        task_arn (string): ARN of the ECS task.
    """
    command = [
        "aws", "ecs", "list-tasks",
        "--cluster", PRECIT_ECS_CLUSTER,
        "--service", site_name,
        "--output", "text",
        "--query", "taskArns[0]"
    ]
    return subprocess.check_output(command).rstrip('\n')


def reset_site(site_name):
    """
    Resets a site using the latest image

    Parameters:
        site_name (string): Name of the site. Only alphanumeric characters and dashes allowed
    """
    # Stopping the Task
    task_arn = get_task_arn(site_name)
    stop_task(task_arn)


def start_backup_task(site_name, backup_name, timestamp):
    """
    Starts an indepedent ECS task to backup a test site

    Parameters:
        site_name (string): Name of the site. Only alphanumeric characters and dashes allowed
        backup_name (string): Name of the backup directory
        timestamp (string): Timestamp of the backup

    Returns:
        taskARN (string): ARN of the task
    """
    container_overrides = {
        "containerOverrides": [{
            "name": site_name,
            "command": [BACKUP_SCRIPT],
            "environment": [{
                "name": "BACKUP_S3_BUCKET",
                "value": BACKUP_REPOSITORY_BUCKET
            }, {
                "name": "BACKUP_SITE_NAME",
                "value": backup_name
            }, {
                "name": "BACKUP_TIMESTAMP",
                "value": timestamp
            }]
        }]
    }

    network_configuration = {
        "awsvpcConfiguration": {
            "subnets": TASK_SUBNETS,
            "securityGroups": TASK_SECURITY_GROUPS,
            "assignPublicIp": "ENABLED"
        }
    }
    command = [
        "aws", "ecs", "run-task",
        "--cluster", PRECIT_ECS_CLUSTER,
        "--overrides", json.dumps(container_overrides),
        "--network-configuration", json.dumps(network_configuration),
        "--launch-type", "FARGATE",
        "--task-definition", site_name,
        "--output", "text",
        "--query", "tasks[0].taskArn"
    ]
    return subprocess.check_output(command).rstrip('\n')


def stop_task(task_arn):
    """
    Stops an ECS task

    Parameters:
        task_arn (string): ARN of the ECS task.
    """
    command = [
        "aws", "ecs", "stop-task",
        "--cluster", PRECIT_ECS_CLUSTER,
        "--task", task_arn
    ]
    subprocess.check_output(command)


# @retry(stop_max_attempt_number=2160, wait_fixed=20000)
# def wait_for_task_completion(task_arn, container_name, in_progress_message):
#     """
#     Waits for the ECS task to be completed.

#     Parameters:
#         task_arn (string): ARN of the task being executed
#         container_name (string): Name of the container in task definition
#         in_progress_message (string): Message output for every check on the status

#     Returns:
#         success_flag (boolean): Success status of the task execution

#     Raises:
#         JobNotCompleteException - Task could not be complted in time
#     """
#     task_info = get_task_container(task_arn, container_name)
#     if task_info['lastStatus'] != END_TASK_STATUS:
#         logging.info(in_progress_message)
#         raise JobNotCompleteException("Max wait time exceeded")
#     else:
#         if task_info['exitCode'] == 0:
#             return True
#         return False


# @retry(stop_max_attempt_number=60, wait_fixed=20000)
# def wait_for_service_completion(site_name, in_progress_message):
#     """
#     Waits for the ECS task and service to be created and reach running state

#     Parameters:
#         site_name (string): Name of the site. Interchangable with ECS service name
#                             Only alphanumeric characters and dashes allowed
#         in_progress_message (String): Message output for every check on the status

#     Returns:
#         status (String): End status of the task.

#     Raises:
#         JobNotCompleteException - Task could not be created in time
#     """
#     task_info = describe_service(site_name)
#     if task_info['desiredCount'] != task_info['runningCount']:
#         logging.info(in_progress_message)
#         raise JobNotCompleteException("Max wait time exceeded")
#     else:
#         return "Success"


# @retry(stop_max_attempt_number=60, wait_fixed=20000)
# def wait_for_stack_completion(stack_name, status_in_progress, in_progress_message):
#     """
#     Waits for an Cloudformation stack operation to complete. Continues
#     to wait until the status is no longer in progress.

#     Parameters:
#         stack_name (string): Stack name in CloudFormation.
#         status_in_progress (String): status representing operation still in progress
#         in_progress_message (String): Message output for every check on the status

#     Returns:
#         status (String): End status of the stack.
#     """
#     stack_info = describe_stack(stack_name)
#     if stack_info['StackStatus'] == status_in_progress:
#         logging.info(in_progress_message)
#         raise JobNotCompleteException("Max wait time exceeded")
#     else:
#         return stack_info['StackStatus']
