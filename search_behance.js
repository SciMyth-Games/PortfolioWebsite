const fs = require('fs');

const filePath = 'C:\\Users\\lenovo\\.gemini\\antigravity\\brain\\9fb696dd-c066-4070-97dd-c0c9b3f6da5d\\.system_generated\\steps\\496\\content.md';
const content = fs.readFileSync(filePath, 'utf8');

// Check for common Behance state keys
console.log('Searching for __INITIAL_STATE__...');
const hasInitialState = content.includes('__INITIAL_STATE__');
console.log('__INITIAL_STATE__ present:', hasInitialState);

// Check for script tags that might contain json
console.log('Searching for application/json script tags...');
const scriptJson = content.match(/<script[^>]*type="application\/json"[^>]*>([\s\S]*?)<\/script>/gi);
console.log('Found application/json scripts:', scriptJson ? scriptJson.length : 0);

// Let's print out what script blocks we found
if (scriptJson) {
  scriptJson.forEach((tag, idx) => {
    console.log(`- Tag ${idx + 1} length: ${tag.length}`);
    console.log(`  Preview: ${tag.substring(0, 300)}...`);
  });
}

// Let's search for any image or CDN links in the file (like mir-s3-cdn-cf.behance.net)
console.log('\nSearching for Behance CDN image links (mir-s3)...');
const cdnRegex = /https:\/\/mir-s3-cdn-cf\.behance\.net\/[^\s"',<>]+/gi;
const cdnLinks = content.match(cdnRegex);
console.log('Found mir-s3 links:', cdnLinks ? cdnLinks.length : 0);
if (cdnLinks) {
  const uniqueLinks = Array.from(new Set(cdnLinks));
  console.log(`Unique mir-s3 links (${uniqueLinks.length}):`);
  uniqueLinks.forEach((link, idx) => {
    console.log(`- [${idx + 1}] ${link}`);
  });
}
