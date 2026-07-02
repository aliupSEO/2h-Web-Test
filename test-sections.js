const fs = require('fs');
const html = fs.readFileSync('raw-seo.html', 'utf8');

const sectionRegex = /(?:<h6[^>]*>[\s\S]*?<\/h6>\s*|<div class="section-subtitle">[\s\S]*?<\/div>\s*)?<h2[\s\S]*?(?=(?:<h6[^>]*>[\s\S]*?<\/h6>\s*|<div class="section-subtitle">[\s\S]*?<\/div>\s*)?<h2|$)/gi;
const blocksSplit = html.match(sectionRegex) || [];

blocksSplit.forEach((block, idx) => {
  const h2Match = block.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
  const title = h2Match ? h2Match[1].replace(/<[^>]*>?/gm, '').trim() : "No Title";
  console.log(`Block ${idx}: ${title.substring(0, 50)}`);
});
