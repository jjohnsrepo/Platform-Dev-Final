import json
import boto3
import os

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(os.environ['TABLE_NAME'])

HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Allow-Methods': 'PATCH,OPTIONS',
    'Content-Type': 'application/json',
}

# Only these fields can be updated by the client
ALLOWED_FIELDS = {
    'isRead': bool,
    'notes': str,
}


def lambda_handler(event, context):
    user_id = event['requestContext']['authorizer']['claims']['sub']
    isbn = event['pathParameters']['isbn']
    body = json.loads(event.get('body') or '{}')

    updates = {}
    for key, expected_type in ALLOWED_FIELDS.items():
        if key in body:
            value = body[key]
            if not isinstance(value, expected_type):
                return {
                    'statusCode': 400,
                    'headers': HEADERS,
                    'body': json.dumps({'error': f'{key} must be {expected_type.__name__}'}),
                }
            updates[key] = value

    if not updates:
        return {
            'statusCode': 400,
            'headers': HEADERS,
            'body': json.dumps({'error': 'no updatable fields provided'}),
        }

    # Build DynamoDB UpdateExpression dynamically
    # e.g. "SET #isRead = :isRead, #notes = :notes"
    set_parts = []
    expr_names = {}
    expr_values = {}
    for key, value in updates.items():
        placeholder_name = f'#{key}'
        placeholder_value = f':{key}'
        set_parts.append(f'{placeholder_name} = {placeholder_value}')
        expr_names[placeholder_name] = key
        expr_values[placeholder_value] = value

    response = table.update_item(
        Key={'userID': user_id, 'isbn': isbn},
        UpdateExpression='SET ' + ', '.join(set_parts),
        ExpressionAttributeNames=expr_names,
        ExpressionAttributeValues=expr_values,
        ConditionExpression='attribute_exists(isbn)',
        ReturnValues='ALL_NEW',
    )

    book = response.get('Attributes', {})
    book.pop('userID', None)

    return {
        'statusCode': 200,
        'headers': HEADERS,
        'body': json.dumps({'book': book}),
    }
