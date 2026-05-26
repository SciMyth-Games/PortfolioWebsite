import urllib.request
import json
import ssl

ssl._create_default_https_context = ssl._create_unverified_context

project_id = '226691501'

endpoints = [
    f"https://www.behance.net/api/v2/projects/{project_id}",
    f"https://www.behance.net/api/v3/projects/{project_id}",
    f"https://api.behance.net/v2/projects/{project_id}",
    f"https://www.behance.net/v2/projects/{project_id}",
    f"https://www.behance.net/gallery/{project_id}/Portfolio",
    f"https://www.behance.net/embed/project/{project_id}"
]

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'application/json, text/plain, */*',
    'X-Requested-With': 'XMLHttpRequest'
}

for url in endpoints:
    print(f"\nTrying endpoint: {url}")
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=10) as response:
            code = response.getcode()
            content_type = response.headers.get('Content-Type', '')
            print(f"Status Code: {code}")
            print(f"Content-Type: {content_type}")
            body = response.read().decode('utf-8', errors='ignore')
            print(f"Body length: {len(body)}")
            
            # Print a preview
            if 'json' in content_type or body.strip().startswith('{') or body.strip().startswith('['):
                try:
                    data = json.loads(body)
                    print("Successfully parsed JSON!")
                    print("Keys:", list(data.keys()) if isinstance(data, dict) else "List")
                    
                    # Save json to file
                    with open(f"behance_api_{url.split('/')[-2]}.json", 'w', encoding='utf-8') as f:
                        json.dump(data, f, indent=2)
                    print("Saved JSON response.")
                except Exception as je:
                    print("Body looks like JSON but failed to parse:", str(je))
                    print(body[:300])
            else:
                print("Response is not JSON.")
                print(body[:200])
    except Exception as e:
        print(f"Failed: {str(e)}")
