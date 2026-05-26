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
        print("Downloaded. Searching for custom headers (starting with X-)...")
        
        # Match 'X-' followed by letters or dashes in quotes, e.g. "X-Requested-With"
        header_regex = re.compile(r'["\'](X-[a-zA-Z0-9_-]+)["\']', re.IGNORECASE)
        matches = list(re.finditer(header_regex, body))
        print(f"Found {len(matches)} header matches.")
        
        unique_headers = sorted(list(set(m.group(1) for m in matches)))
        print("Unique headers found:")
        for h in unique_headers:
            print("-", h)
            
except Exception as e:
    print(f"Failed: {str(e)}")
