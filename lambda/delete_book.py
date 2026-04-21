import json
import boto3
import os

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(os.environ['TABLE_NAME'])

HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Allow-Methods': 'DELETE,OPTIONS',
    'Content-Type': 'application/json',
}


def lambda_handler(event, context):
    user_id = event['requestContext']['authorizer']['claims']['sub']
    isbn = event['pathParameters']['isbn']

    table.delete_item(Key={'userID': user_id, 'isbn': isbn})

    return {
        'statusCode': 200,
        'headers': HEADERS,
        'body': json.dumps({'success': True}),
    }
