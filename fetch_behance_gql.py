import urllib.request
import json
import ssl

ssl._create_default_https_context = ssl._create_unverified_context

url = "https://www.behance.net/v3/graphql"

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
}

# Let's try to request basic project details and modules
query = """
query GetProject($projectId: ProjectId!) {
  project(id: $projectId) {
    id
    name
    description
    publishedOn
    modifiedOn
    url
    fields {
      name
    }
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
    "projectId": "226691501"
}

payload = {
    "query": query,
    "variables": variables
}

print("Sending GraphQL query to Behance...")
req = urllib.request.Request(url, data=json.dumps(payload).encode('utf-8'), headers=headers)
try:
    with urllib.request.urlopen(req, timeout=15) as response:
        code = response.getcode()
        print(f"Status Code: {code}")
        body = response.read().decode('utf-8', errors='ignore')
        print(f"Response length: {len(body)}")
        
        data = json.loads(body)
        print("Parsed JSON response:")
        
        # Save to file
        with open("behance_gql_response.json", "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
        print("Wrote response to behance_gql_response.json")
        
        # Check errors
        if "errors" in data:
            print("GraphQL errors found:")
            for err in data["errors"]:
                print("-", err.get("message"))
        else:
            print("No GraphQL errors. Project keys:", data.get("data", {}).get("project", {}).keys())
except Exception as e:
    print(f"Failed: {str(e)}")
