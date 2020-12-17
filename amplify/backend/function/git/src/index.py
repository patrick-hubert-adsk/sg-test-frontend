import json
import requests


def handler(event, context):
    print('received event:')
    print(event)

    if event['path'] == '/branch':
        r = requests.get("https://github.com")
        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json",
            },
            "body": json.dumps(r.text, indent=4),
        }
    else:
        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json",
            },
            "body": json.dumps({"Patrick": "Hubert"}, indent=4),
        }
