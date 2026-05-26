const fs = require('fs');

const filePath = 'C:\\Users\\lenovo\\.gemini\\antigravity\\brain\\9fb696dd-c066-4070-97dd-c0c9b3f6da5d\\.system_generated\\steps\\496\\content.md';
const content = fs.readFileSync(filePath, 'utf8');

console.log('Searching for API key terms in HTML...');

const terms = ['apiKey', 'clientId', 'api_key', 'client_id', 'app_id', 'appid', 'clientKey', 'client_key'];
terms.forEach(term => {
  const regex = new RegExp(`[^\\s"',<>]*${term}[^\\s"',<>]*`, 'gi');
  const matches = content.match(regex);
  if (matches) {
    console.log(`\nMatches for "${term}":`);
    const unique = Array.from(new Set(matches)).slice(0, 15);
    unique.forEach(m => console.log(`- ${m}`));
  }
});
