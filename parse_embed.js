const fs = require('fs');
const path = require('path');

const filePath = 'C:\\Users\\lenovo\\.gemini\\antigravity\\brain\\9fb696dd-c066-4070-97dd-c0c9b3f6da5d\\.system_generated\\steps\\520\\content.md';
if (!fs.existsSync(filePath)) {
  console.log('File does not exist:', filePath);
  process.exit(1);
}

const content = fs.readFileSync(filePath, 'utf8');

// Find all img tags in the embed HTML
console.log('Searching for <img> tags in the embed page...');
const imgRegex = /<img[^>]*src="([^"]*)"[^>]*>/gi;
let match;
const imgUrls = [];
while ((match = imgRegex.exec(content)) !== null) {
  imgUrls.push(match[1]);
}
console.log(`Found ${imgUrls.length} <img> urls:`);
imgUrls.forEach((url, i) => console.log(`- [${i+1}] ${url}`));

// Find all anchor tags
console.log('\nSearching for <a> links...');
const aRegex = /<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi;
const links = [];
while ((match = aRegex.exec(content)) !== null) {
  links.push({ href: match[1], text: match[2].trim().replace(/\s+/g, ' ') });
}
console.log(`Found ${links.length} links:`);
links.forEach((l, i) => console.log(`- [${i+1}] [${l.text}] -> ${l.href}`));

// Find any JS variables or data blocks containing project metadata
console.log('\nSearching for project data inside script tags...');
const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
let scriptIdx = 0;
while ((match = scriptRegex.exec(content)) !== null) {
  const code = match[1];
  scriptIdx++;
  if (code.includes('project') || code.includes('modules') || code.includes('mir-s3') || code.includes('owner')) {
    console.log(`- Script tag ${scriptIdx} (Length: ${code.length}) contains relevant terms:`);
    console.log(`  Preview: ${code.substring(0, 500)}...`);
  }
}
