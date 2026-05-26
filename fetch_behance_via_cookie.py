import urllib.request
import urllib.parse
import json
import ssl
import re

ssl._create_default_https_context = ssl._create_unverified_context

project_id = '226691501'
gallery_url = f"https://www.behance.net/gallery/{project_id}/Portfolio"
graphql_url = "https://www.behance.net/v3/graphql"

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
}

print("Step 1: Sending GET request to gallery page to obtain cookies...")
req = urllib.request.Request(gallery_url, headers=headers)
bcp_cookie = None
all_cookies = []

try:
    with urllib.request.urlopen(req, timeout=15) as response:
        headers_response = response.info()
        set_cookies = headers_response.get_all('Set-Cookie', [])
        print(f"Received {len(set_cookies)} Set-Cookie headers.")
        
        for cookie in set_cookies:
            all_cookies.append(cookie.split(';')[0])
            if 'bcp=' in cookie:
                match = re.search(r'bcp=([^;]+)', cookie)
                if match:
                    bcp_cookie = match.group(1)
                    
        print(f"Extracted bcp cookie value: {bcp_cookie}")
except Exception as e:
    print(f"GET request failed: {str(e)}")
    exit(1)

if not bcp_cookie:
    print("Could not find bcp cookie in response headers. Trying default fallback...")
    # Sometimes it is called something else or we can try with what cookies we got
    bcp_cookie = "default_token_fallback"

# Step 2: Query the GraphQL API using the bcp token
query = """
query GetProject($projectId: ProjectId!) {
  project(id: $projectId) {
    id
    name
    description
    publishedOn
    modifiedOn
    url
    modules {
      id
      type
      alignment
      caption
      components {
        id
        type
        ... on ProjectModuleImageComponent {
          width
          height
          originalUrl
          sizes {
            url
            width
          }
        }
        ... on ProjectModuleTextComponent {
          text
        }
      }
    }
  }
}
"""

variables = {
    "projectId": project_id
}

payload = {
    "query": query,
    "variables": variables
}

graphql_headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'X-BCP': bcp_cookie,
    'Cookie': '; '.join(all_cookies)
}

print("\nStep 2: Sending POST request to GraphQL endpoint...")
req_gql = urllib.request.Request(graphql_url, data=json.dumps(payload).encode('utf-8'), headers=graphql_headers)
try:
    with urllib.request.urlopen(req_gql, timeout=15) as response:
        code = response.getcode()
        print(f"GraphQL Response Status Code: {code}")
        body = response.read().decode('utf-8', errors='ignore')
        
        data = json.loads(body)
        print("GraphQL response parsed successfully!")
        
        with open("behance_gql_success.json", "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
        print("Saved successful response to behance_gql_success.json")
        
        if "errors" in data:
            print("GraphQL errors:")
            for err in data["errors"]:
                print("-", err.get("message"))
        else:
            project = data.get("data", {}).get("project", {})
            if project:
                print(f"Project Name: {project.get('name')}")
                print(f"Description: {project.get('description')}")
                print(f"Modules Count: {len(project.get('modules', []))}")
            else:
                print("No project data in response.")
except Exception as e:
    print(f"POST request to GraphQL failed: {str(e)}")
