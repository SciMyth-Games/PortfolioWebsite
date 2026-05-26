const fs = require('fs');

const filePath = 'C:\\Users\\lenovo\\.gemini\\antigravity\\brain\\9fb696dd-c066-4070-97dd-c0c9b3f6da5d\\.system_generated\\steps\\496\\content.md';
const content = fs.readFileSync(filePath, 'utf8');

// Find all meta tags
console.log('Searching for <meta> tags...');
const metaRegex = /<meta[^>]*>/gi;
const metaTags = content.match(metaRegex);

if (metaTags) {
  console.log(`Found ${metaTags.length} meta tags:`);
  metaTags.forEach((tag) => {
    console.log(`- ${tag}`);
  });
} else {
  console.log('No meta tags found.');
}
