import urllib.request
import json
import ssl

ssl._create_default_https_context = ssl._create_unverified_context

project_id = '226691501'

# We'll test a wide variety of possible API endpoints that Behance's React client might hit
paths = [
    f"https://www.behance.net/api/v2/projects/{project_id}",
    f"https://www.behance.net/api/v3/projects/{project_id}",
    f"https://www.behance.net/api/projects/{project_id}",
    f"https://www.behance.net/api/v2/galleries/{project_id}",
    f"https://www.behance.net/api/v3/galleries/{project_id}",
    f"https://www.behance.net/api/galleries/{project_id}",
    f"https://www.behance.net/api/v3/projects/{project_id}/modules",
    f"https://www.behance.net/api/v2/projects/{project_id}/modules",
    f"https://www.behance.net/api/projects/{project_id}/modules",
    f"https://www.behance.net/v2/projects/{project_id}/modules",
    f"https://www.behance.net/v3/projects/{project_id}/modules",
]

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'application/json, text/plain, */*',
    'X-Requested-With': 'XMLHttpRequest'
}

for url in paths:
    print(f"\nTrying endpoint: {url}")
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=10) as response:
            code = response.getcode()
            print(f"Status Code: {code}")
            print(f"Content-Type: {response.headers.get('Content-Type', '')}")
            body = response.read().decode('utf-8', errors='ignore')
            print(f"Body length: {len(body)}")
            print(body[:200])
    except Exception as e:
        print(f"Failed: {str(e)}")
