import re
import os

files = [
    'C:\\Users\\lenovo\\.gemini\\antigravity\\brain\\9fb696dd-c066-4070-97dd-c0c9b3f6da5d\\.system_generated\\steps\\496\\content.md',
    'C:\\Users\\lenovo\\.gemini\\antigravity\\brain\\9fb696dd-c066-4070-97dd-c0c9b3f6da5d\\.system_generated\\steps\\520\\content.md'
]

image_pattern = re.compile(r'https?://[^\s"\',<>]+?\.(?:png|jpg|jpeg|webp|gif|svg)', re.IGNORECASE)
behance_pattern = re.compile(r'https?://[^\s"\',<>]+?behance\.net[^\s"\',<>]*', re.IGNORECASE)

for filepath in files:
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        continue
        
    print(f"\nScanning: {filepath}")
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
        
    images = image_pattern.findall(content)
    unique_images = sorted(list(set(images)))
    print(f"Found {len(unique_images)} unique image URLs:")
    for img in unique_images:
        print(f"- {img}")
        
    links = behance_pattern.findall(content)
    unique_links = sorted(list(set(links)))
    print(f"Found {len(unique_links)} unique Behance URLs:")
    for link in unique_links:
        print(f"- {link}")
