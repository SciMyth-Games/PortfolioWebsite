const fs = require('fs');

const contentPath = 'C:\\Users\\lenovo\\.gemini\\antigravity\\brain\\9fb696dd-c066-4070-97dd-c0c9b3f6da5d\\.system_generated\\steps\\416\\content.md';
const content = fs.readFileSync(contentPath, 'utf8');

const startStr = "window['bootstrap'] = JSON.parse('";
const startIdx = content.indexOf(startStr);
const endIdx = content.indexOf("');", startIdx);
const statement = content.substring(startIdx, endIdx + 3);

const getBootstrap = new Function('const window = {}; ' + statement + '; return window.bootstrap;');
const parsed = getBootstrap();

const pages = parsed.page.A.A;

// Build a dictionary of media IDs to their files
const mediaMap = {};

// Helper to add media item to map
const addMediaItem = (item) => {
  if (!item || !item.id) return;
  const files = item.files || [];
  if (files.length > 0 && files[0].url) {
    mediaMap[item.id] = files[0].url;
  }
};

if (parsed.page.E) {
  parsed.page.E.forEach(addMediaItem);
}
if (parsed.page.F) {
  parsed.page.F.forEach(addMediaItem);
}

console.log(`Built media mapping with ${Object.keys(mediaMap).length} items.`);

// Let's resolve the images for each page
const pagesData = pages.map((page, pageIdx) => {
  const pageImages = [];
  const pageTexts = [];
  
  const collectImages = (val) => {
    if (!val) return;
    if (typeof val === 'string') {
      if (mediaMap[val]) {
        pageImages.push({ id: val, url: mediaMap[val] });
      }
    } else if (typeof val === 'object') {
      // Look for specific image reference keys
      if (val['A?'] === 'I') {
        const ref = val.a && val.a.B && val.a.B.A && val.a.B.A.A;
        const cropRef = val.a && val.a.I && val.a.I.A;
        if (ref && mediaMap[ref]) pageImages.push({ type: 'ImageRef', id: ref, url: mediaMap[ref] });
        if (cropRef && mediaMap[cropRef]) pageImages.push({ type: 'CropRef', id: cropRef, url: mediaMap[cropRef] });
      }
      if (val['A?'] === 'L' && val.a) {
        Object.keys(val.a).forEach(k => {
          const item = val.a[k];
          if (item && item.A && item.A.I && item.A.I.A) {
            const gridRef = item.A.I.A;
            if (mediaMap[gridRef]) pageImages.push({ type: 'GridRef', id: gridRef, url: mediaMap[gridRef] });
          }
        });
      }
      if (val['A?'] === 'K') {
        const textRuns = val.a && val.a.A;
        if (textRuns) {
          const text = textRuns.map(run => run.A).join('');
          pageTexts.push({ type: 'Text', text: text.trim() });
        }
      }
      if (val['A?'] === 'J') {
        const list = val.f || [];
        list.forEach(item => {
          if (item.A && item.A.A) {
            const text = item.A.A.map(run => run.A).join('');
            pageTexts.push({ type: 'GroupText', text: text.trim() });
          }
        });
      }
      Object.keys(val).forEach(k => {
        collectImages(val[k]);
      });
    }
  };
  
  collectImages(page);
  
  // Deduplicate images on page
  const uniqueImages = [];
  const seenUrls = new Set();
  pageImages.forEach(img => {
    if (!seenUrls.has(img.url)) {
      seenUrls.add(img.url);
      uniqueImages.push(img);
    }
  });

  return {
    index: pageIdx + 1,
    id: page.a,
    texts: pageTexts,
    images: uniqueImages
  };
});

fs.writeFileSync('canva_pages_resolved.json', JSON.stringify(pagesData, null, 2));
console.log('Wrote resolved pages data to canva_pages_resolved.json');
