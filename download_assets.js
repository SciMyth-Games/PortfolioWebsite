const fs = require('fs');
const path = require('path');
const https = require('https');

const pagesData = require('./canva_pages_resolved.json');
const destDir = path.join(__dirname, 'Projects', 'Marketing');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const baseUrl = 'https://txnb-portfolio.my.canva.site/';

// Collect all unique media URLs
const uniqueUrls = new Set();
pagesData.forEach(page => {
  page.images.forEach(img => {
    if (img.url) {
      uniqueUrls.add(img.url);
    }
  });
});

const urls = Array.from(uniqueUrls);
console.log(`Found ${urls.length} unique media URLs to download.`);

let completed = 0;

const download = (urlPath) => {
  const fullUrl = baseUrl + urlPath;
  const filename = path.basename(urlPath);
  const targetPath = path.join(destDir, filename);

  const file = fs.createWriteStream(targetPath);
  https.get(fullUrl, (response) => {
    if (response.statusCode !== 200) {
      console.error(`Failed to download ${urlPath}: Status Code ${response.statusCode}`);
      file.close();
      fs.unlinkSync(targetPath);
      checkComplete();
      return;
    }

    response.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log(`Downloaded: ${filename}`);
      checkComplete();
    });
  }).on('error', (err) => {
    console.error(`Error downloading ${urlPath}:`, err.message);
    fs.unlinkSync(targetPath);
    checkComplete();
  });
};

function checkComplete() {
  completed++;
  if (completed === urls.length) {
    console.log('\nAll downloads completed!');
  }
}

urls.forEach(url => {
  download(url);
});
