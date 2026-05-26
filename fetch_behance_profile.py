import urllib.request
import json
import ssl

ssl._create_default_https_context = ssl._create_unverified_context

url = "https://www.behance.net/harshkumar629"

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'application/json, text/plain, */*',
    'X-Requested-With': 'XMLHttpRequest'
}

print(f"Fetching Behance profile: {url}")
req = urllib.request.Request(url, headers=headers)
try:
    with urllib.request.urlopen(req, timeout=10) as response:
        code = response.getcode()
        content_type = response.headers.get('Content-Type', '')
        print(f"Status Code: {code}")
        print(f"Content-Type: {content_type}")
        body = response.read().decode('utf-8', errors='ignore')
        print(f"Body length: {len(body)}")
        
        # Save response
        with open("behance_profile.json", "w", encoding="utf-8") as f:
            f.write(body)
            
        if 'json' in content_type or body.strip().startswith('{') or body.strip().startswith('['):
            try:
                data = json.loads(body)
                print("Successfully parsed JSON!")
                print("Keys:", list(data.keys()) if isinstance(data, dict) else "List")
                
                # Check for profile projects list
                if isinstance(data, dict):
                    # We can print keys of interest
                    print("Has view?", "view" in data)
                    if "view" in data and isinstance(data["view"], dict):
                        print("View keys:", list(data["view"].keys()))
            except Exception as je:
                print("Parse error:", str(je))
        else:
            print("Response is not JSON. Preview:")
            print(body[:300])
except Exception as e:
    print(f"Failed: {str(e)}")
