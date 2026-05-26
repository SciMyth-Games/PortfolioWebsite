const fs = require('fs');

const contentPath = 'C:\\Users\\lenovo\\.gemini\\antigravity\\brain\\9fb696dd-c066-4070-97dd-c0c9b3f6da5d\\.system_generated\\steps\\416\\content.md';
const content = fs.readFileSync(contentPath, 'utf8');

const startStr = "window['bootstrap'] = JSON.parse('";
const startIdx = content.indexOf(startStr);
if (startIdx === -1) {
  console.log("Could not find bootstrap start");
  process.exit(1);
}

const endIdx = content.indexOf("');", startIdx);
if (endIdx === -1) {
  console.log("Could not find bootstrap end");
  process.exit(1);
}

const statement = content.substring(startIdx, endIdx + 3);

const getBootstrap = new Function('const window = {}; ' + statement + '; return window.bootstrap;');
const parsed = getBootstrap();

const pages = parsed.page.A.A;
console.log(`Found ${pages.length} pages.`);

// Let's write out a text summary of each page to canva_summary.txt
let output = '';

pages.forEach((page, pageIdx) => {
  output += `\n================ PAGE ${pageIdx + 1} (ID: ${page.a}) ================\n`;
  const elements = page.E || [];
  elements.forEach((el) => {
    // Text elements (K)
    if (el['A?'] === 'K') {
      const textRuns = el.a && el.a.A;
      if (textRuns) {
        const text = textRuns.map(run => run.A).join('');
        output += `[Text] ${text.trim().replace(/\n/g, ' ')}\n`;
      }
    }
    
    // Grouped text/button elements (J)
    if (el['A?'] === 'J') {
      const list = el.f || [];
      list.forEach(item => {
        if (item.A && item.A.A) {
          const text = item.A.A.map(run => run.A).join('');
          output += `[GroupText] ${text.trim().replace(/\n/g, ' ')}\n`;
        }
      });
    }

    // Image elements (I)
    if (el['A?'] === 'I') {
      const imgRef = el.a && el.a.B && el.a.B.A && el.a.B.A.A;
      const cropRef = el.a && el.a.I && el.a.I.A;
      output += `[Image] Ref: ${imgRef || 'none'}, CropRef: ${cropRef || 'none'}\n`;
    }

    // Grid elements (L)
    if (el['A?'] === 'L') {
      output += `[Grid]\n`;
      if (el.a) {
        Object.keys(el.a).forEach(k => {
          const item = el.a[k];
          if (item && item.A && item.A.I) {
            output += `  - GridItem Image: ${item.A.I.A}\n`;
          }
        });
      }
    }
  });
});

fs.writeFileSync('canva_summary.txt', output);
console.log('Wrote summary to canva_summary.txt');
