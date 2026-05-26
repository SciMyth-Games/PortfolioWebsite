import urllib.request
import re
import ssl
import os

ssl._create_default_https_context = ssl._create_unverified_context

js_url = 'https://a5.behance.net/b7e76a48ae8c1a71d32775cd7ced0af96fa87c6c/js/main.035c431c1764f823ff95.js'
dest_file = 'behance_main.js'

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

print(f"Downloading main JS bundle: {js_url}")
req = urllib.request.Request(js_url, headers=headers)
try:
    with urllib.request.urlopen(req, timeout=30) as response:
        body = response.read().decode('utf-8', errors='ignore')
        print(f"Downloaded. Size: {len(body) / 1024 / 1024:.2f} MB")
        
        # Search for client_id or api_key
        # Common formats in minified code: client_id:"..." or apiKey:"..." or similar
        print("Searching for patterns...")
        patterns = [
            r'client_id["\']?\s*:\s*["\']([a-zA-Z0-9]+)["\']',
            r'clientId["\']?\s*:\s*["\']([a-zA-Z0-9]+)["\']',
            r'api_key["\']?\s*:\s*["\']([a-zA-Z0-9]+)["\']',
            r'apiKey["\']?\s*:\s*["\']([a-zA-Z0-9]+)["\']',
            r'client_id=([a-zA-Z0-9]+)',
            r'api_key=([a-zA-Z0-9]+)'
        ]
        
        found = False
        for p in patterns:
            matches = re.findall(p, body)
            if matches:
                unique_matches = list(set(matches))
                print(f"Found matches for pattern {p}: {unique_matches}")
                found = True
                
        if not found:
            print("No simple patterns matched. Searching for general client_id references...")
            # Let's print snippets around 'client_id' or 'apiKey'
            for match in re.finditer(r'client_id', body, re.IGNORECASE):
                start = max(0, match.start() - 100)
                end = min(len(body), match.end() + 100)
                print(f"Snippet: ... {body[start:end]} ...\n")
                
except Exception as e:
    print(f"Failed: {str(e)}")
