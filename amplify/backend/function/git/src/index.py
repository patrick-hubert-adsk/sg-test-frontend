import json
from pprint import pprint as pp
import git_infos
import boto3

git_token = None

def handler(event, context):
    print('received event:')
    print(event)

    if event['path'] == '/branch':

        if not git_token:
            fetch_secret_credentials()

        branches = git_infos.getBranches(git_token, "shotgun")
        pp(branches)
        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json",
            },
            "body": json.dumps({"branches": branches}, indent=4),
        }
    else:
        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json",
            },
            "body": json.dumps({"Patrick": "Hubert"}, indent=4),
        }


def fetch_secret_credentials():
    """
    Stores secrets into class variables.
    """
    global git_token
    ssm = boto3.client('ssm')
    ssm_params = [
        '/test-ui/GIT_TOKEN',
    ]
    resp = ssm.get_parameters(Names=ssm_params, WithDecryption=True)
    for param in resp['Parameters']:
        name = param['Name'].split('/')[-1]
        if name == "GIT_TOKEN":
            git_token = param['Value']


if __name__ == "__main__":
    print("main")
    payload = handler({"path": "/branch"}, {})
    pp(payload)
