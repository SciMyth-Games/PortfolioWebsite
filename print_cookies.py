import urllib.request
import ssl

ssl._create_default_https_context = ssl._create_unverified_context

url = "https://www.behance.net/gallery/226691501/Portfolio"
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

req = urllib.request.Request(url, headers=headers)
try:
    with urllib.request.urlopen(req) as response:
        info = response.info()
        print("Set-Cookie headers:")
        for c in info.get_all('Set-Cookie', []):
            print("-", c)
except Exception as e:
    print("Failed:", str(e))
