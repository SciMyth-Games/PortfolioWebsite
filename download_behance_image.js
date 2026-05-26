const fs = require('fs');
const https = require('https');
const path = require('path');

const url = 'https://mir-s3-cdn-cf.behance.net/project_modules/1400/411ae7226691501.68332d7289114.png';
const dest = path.join(__dirname, 'behance_portfolio.png');

console.log('Downloading Behance image...');
const file = fs.createWriteStream(dest);

https.get(url, (response) => {
  if (response.statusCode !== 200) {
    console.error(`Failed: Status Code ${response.statusCode}`);
    file.close();
    fs.unlinkSync(dest);
    process.exit(1);
  }

  response.pipe(file);
  file.on('finish', () => {
    file.close();
    console.log('Download complete: behance_portfolio.png');
    
    // Check file stats
    const stats = fs.statSync(dest);
    console.log(`File Size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
  });
}).on('error', (err) => {
  console.error('Error:', err.message);
  fs.unlinkSync(dest);
  process.exit(1);
});
