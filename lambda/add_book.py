import json
import boto3
import os
import urllib.request
from datetime import datetime, timezone

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(os.environ['TABLE_NAME'])
s3 = boto3.client('s3')

HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Allow-Methods': 'POST,OPTIONS',
    'Content-Type': 'application/json',
}

UA = {'User-Agent': 'BookScannerApp/1.0'}


def fetch_json(url):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=10) as r:
        return json.loads(r.read())


def lambda_handler(event, context):
    user_id = event['requestContext']['authorizer']['claims']['sub']
    body = json.loads(event.get('body') or '{}')
    isbn = body.get('isbn', '').strip()

    if not isbn:
        return {'statusCode': 400, 'headers': HEADERS, 'body': json.dumps({'error': 'isbn required'})}

    # Fetch book metadata from Open Library
    try:
        data = fetch_json(f'https://openlibrary.org/isbn/{isbn}.json')
    except Exception:
        return {'statusCode': 404, 'headers': HEADERS, 'body': json.dumps({'error': f'Book not found for ISBN: {isbn}'})}

    title = data.get('title', 'Unknown Title')
    publisher = (data.get('publishers') or ['Unknown Publisher'])[0]
    publish_date = data.get('publish_date', 'Unknown')

    # Edition may carry a description, but it's usually on the work
    description = data.get('description', '')
    if isinstance(description, dict):
        description = description.get('value', '')
    print(f'[desc] edition description: {repr(description)[:200]}')

    # Fetch the work to get description + (fallback) author when edition lacks them
    work_data = {}
    works = data.get('works') or []
    print(f'[desc] edition works array: {works}')
    if works:
        try:
            work_url = f'https://openlibrary.org{works[0]["key"]}.json'
            print(f'[desc] fetching work: {work_url}')
            work_data = fetch_json(work_url)
            print(f'[desc] work keys: {list(work_data.keys())}')
        except Exception as e:
            print(f'[desc] work fetch failed: {e}')

    if not description:
        work_description = work_data.get('description', '')
        if isinstance(work_description, dict):
            work_description = work_description.get('value', '')
        description = work_description or ''
        print(f'[desc] work description: {repr(description)[:200]}')

    # Fallback to Google Books — Open Library is sparse on descriptions
    if not description:
        try:
            gb = fetch_json(f'https://www.googleapis.com/books/v1/volumes?q=isbn:{isbn}')
            items = gb.get('items') or []
            if items:
                description = items[0].get('volumeInfo', {}).get('description', '') or ''
            print(f'[desc] google books description: {repr(description)[:200]}')
        except Exception as e:
            print(f'[desc] google books fetch failed: {e}')

    print(f'[desc] FINAL description length: {len(description)}')

    # Resolve author name — try edition authors first, then fall back to work authors
    author = 'Unknown Author'
    authors = data.get('authors') or work_data.get('authors') or []
    if authors:
        # Edition authors: [{"key": "/authors/OL..."}]
        # Work authors:    [{"author": {"key": "/authors/OL..."}, "type": {...}}]
        author_ref = authors[0]
        author_key = author_ref.get('key') or author_ref.get('author', {}).get('key')
        if author_key:
            try:
                author_data = fetch_json(f'https://openlibrary.org{author_key}.json')
                author = author_data.get('name', 'Unknown Author')
            except Exception:
                pass

    # Download cover from Open Library and store in S3
    bucket_name = os.environ['BUCKET_NAME']
    bucket_region = os.environ['BUCKET_REGION']
    cover_key = f'covers/{isbn}.jpg'
    cover_url = f'https://{bucket_name}.s3.{bucket_region}.amazonaws.com/{cover_key}'

    try:
        req = urllib.request.Request(
            f'https://covers.openlibrary.org/b/isbn/{isbn}-M.jpg', headers=UA
        )
        with urllib.request.urlopen(req, timeout=10) as r:
            cover_bytes = r.read()
        # Open Library returns a 1x1 gif when no cover exists — skip those
        if len(cover_bytes) > 2000:
            s3.put_object(
                Bucket=bucket_name,
                Key=cover_key,
                Body=cover_bytes,
                ContentType='image/jpeg',
            )
        else:
            cover_url = ''
    except Exception:
        cover_url = ''

    book = {
        'userID': user_id,
        'isbn': isbn,
        'title': title,
        'author': author,
        'publisher': publisher,
        'publishDate': publish_date,
        'coverUrl': cover_url,
        'description': description,
        'isRead': False,
        'notes': '',
        'addedAt': datetime.now(timezone.utc).isoformat(),
    }

    table.put_item(Item=book)

    response_book = {k: v for k, v in book.items() if k != 'userID'}

    return {
        'statusCode': 200,
        'headers': HEADERS,
        'body': json.dumps({'book': response_book}),
    }
