const fs = require('fs');

const filePath = 'C:\\Users\\lenovo\\.gemini\\antigravity\\brain\\9fb696dd-c066-4070-97dd-c0c9b3f6da5d\\.system_generated\\steps\\496\\content.md';
const content = fs.readFileSync(filePath, 'utf8');

const id = '226691501';

console.log(`Searching for occurrences of ${id} in HTML...`);

const regex = new RegExp(`[^\\s"',<>]*${id}[^\\s"',<>]*`, 'gi');
const matches = content.match(regex);

if (matches) {
  const uniqueMatches = Array.from(new Set(matches));
  console.log(`Found ${uniqueMatches.length} unique occurrences of project ID ${id}:`);
  uniqueMatches.forEach((m, idx) => {
    console.log(`- [${idx + 1}] ${m}`);
  });
} else {
  console.log(`No occurrences of project ID ${id} found.`);
}
