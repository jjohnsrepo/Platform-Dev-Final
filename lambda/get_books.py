import json
import boto3
import os
from boto3.dynamodb.conditions import Key

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(os.environ['TABLE_NAME'])

HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Allow-Methods': 'GET,OPTIONS',
    'Content-Type': 'application/json',
}


def lambda_handler(event, context):
    user_id = event['requestContext']['authorizer']['claims']['sub']

    resp = table.query(KeyConditionExpression=Key('userID').eq(user_id))

    books = []
    for item in resp.get('Items', []):
        item.pop('userID', None)
        books.append(item)

    return {
        'statusCode': 200,
        'headers': HEADERS,
        'body': json.dumps({'books': books}),
    }
