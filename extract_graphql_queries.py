import urllib.request
import re
import ssl

ssl._create_default_https_context = ssl._create_unverified_context

js_url = 'https://a5.behance.net/b7e76a48ae8c1a71d32775cd7ced0af96fa87c6c/js/main.035c431c1764f823ff95.js'

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

print(f"Downloading JS bundle: {js_url}")
req = urllib.request.Request(js_url, headers=headers)
try:
    with urllib.request.urlopen(req, timeout=30) as response:
        body = response.read().decode('utf-8', errors='ignore')
        print("Downloaded. Searching for GraphQL queries...")
        
        # Look for occurrences of "query [a-zA-Z0-9_]+..." in template strings
        # GraphQL queries in JS are often defined as: query <Name>(...) { ... }
        # Let's search for "query " followed by a name, and then opening brace.
        query_regex = re.compile(r'query\s+[a-zA-Z0-9_]+\s*(?:\([^)]*\))?\s*\{', re.IGNORECASE)
        matches = list(re.finditer(query_regex, body))
        print(f"Found {len(matches)} query matches.")
        
        for m in matches[:20]:
            start = max(0, m.start() - 50)
            end = min(len(body), m.end() + 600)
            snippet = body[start:end].replace('\n', ' ').replace('\r', ' ')
            print(f"\nMatch at {m.start()}:")
            print(snippet)
            
except Exception as e:
    print(f"Failed: {str(e)}")
