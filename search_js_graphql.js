const https = require('https');

const jsUrl = 'https://a5.behance.net/b7e76a48ae8c1a71d32775cd7ced0af96fa87c6c/js/main.035c431c1764f823ff95.js';

console.log('Downloading JS bundle in-memory...');
https.get(jsUrl, (response) => {
  if (response.statusCode !== 200) {
    console.error(`Failed to download: Status Code ${response.statusCode}`);
    process.exit(1);
  }

  let data = '';
  response.on('data', (chunk) => {
    data += chunk;
  });

  response.on('end', () => {
    console.log(`Download complete! Size: ${(data.length / 1024 / 1024).toFixed(2)} MB`);
    
    console.log('Searching for "graphql" references...');
    const regex = /graphql/gi;
    const matches = [];
    let match;
    while ((match = regex.exec(data)) !== null) {
      matches.push(match.index);
    }

    console.log(`Found ${matches.length} matches for "graphql".`);

    matches.slice(0, 15).forEach((idx) => {
      const start = Math.max(0, idx - 150);
      const end = Math.min(data.length, idx + 150);
      console.log(`\nMatch at index ${idx}:`);
      console.log(`... ${data.substring(start, end).replace(/\s+/g, ' ')} ...`);
    });

    console.log('\nSearching for paths matching "/graphql" or similar...');
    const pathRegex = /\/[^\s"'`,]*graphql[^\s"'`,]*/gi;
    const pathMatches = data.match(pathRegex);
    if (pathMatches) {
      console.log(`Found ${pathMatches.length} path matches:`);
      console.log(Array.from(new Set(pathMatches)));
    } else {
      console.log('No path matches found.');
    }
  });
}).on('error', (err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
