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
        print("Downloaded. Searching for 'bcp' cookie assignment...")
        
        # Search for .set("bcp" or similar
        patterns = [
            r'\.set\s*\(\s*["\']bcp["\']',
            r'["\']bcp["\']\s*:',
            r'cookie\s*=\s*["\']bcp\s*=\s*',
            r'bcp\s*='
        ]
        
        for p in patterns:
            regex = re.compile(p, re.IGNORECASE)
            for match in re.finditer(regex, body):
                start = max(0, match.start() - 150)
                end = min(len(body), match.end() + 150)
                print(f"Pattern {p} match:")
                print(f"... {body[start:end].replace('\n', ' ').replace('\r', ' ')} ...\n")
                
except Exception as e:
    print(f"Failed: {str(e)}")
