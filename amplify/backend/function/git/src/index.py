def handler(event, context):
  print('received event:')
  print(event)

  return {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json",
        },
        "body": json.dump({"Patrick":"Hubert"})
    }
