const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'behance_portfolio.png');

if (!fs.existsSync(filePath)) {
  console.log('File does not exist');
  process.exit(1);
}

const buffer = fs.readFileSync(filePath);

// Check PNG signature
if (buffer.readUInt32BE(0) !== 0x89504E47 || buffer.readUInt32BE(4) !== 0x0D0A1A0A) {
  console.log('Not a valid PNG file');
  process.exit(1);
}

// IHDR chunk starts at byte 12. Width is at 16, Height is at 20 (4 bytes each, Big Endian)
const width = buffer.readUInt32BE(16);
const height = buffer.readUInt32BE(20);

console.log(`PNG Dimensions: ${width} x ${height}`);
console.log(`Aspect Ratio: ${(width / height).toFixed(2)}`);
