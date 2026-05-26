const fs = require('fs');
const path = require('path');

const filePath = 'C:\\Users\\lenovo\\.gemini\\antigravity\\brain\\9fb696dd-c066-4070-97dd-c0c9b3f6da5d\\.system_generated\\steps\\496\\content.md';
const content = fs.readFileSync(filePath, 'utf8');

console.log('Searching for "bcp" in HTML...');

const regex = /bcp/gi;
const matches = [];
let match;
while ((match = regex.exec(content)) !== null) {
  matches.push(match.index);
}

console.log(`Found ${matches.length} matches for "bcp".`);

matches.forEach((idx) => {
  const start = Math.max(0, idx - 100);
  const end = Math.min(content.length, idx + 100);
  console.log(`\nMatch at index ${idx}:`);
  console.log(`... ${content.substring(start, end).replace(/\s+/g, ' ')} ...`);
});
