const fs = require('fs');
const html = fs.readFileSync('raw-seo.html', 'utf8');

let content = html;
if (html.includes('class="next-step-section"')) {
  const parts = html.split(/<div[^>]*class="next-step-section"[^>]*>/);
  content = parts[0];
}

const sectionRegex = /(?:<h6[^>]*>[\s\S]*?<\/h6>\s*|<div class="section-subtitle">[\s\S]*?<\/div>\s*)?<h2[\s\S]*?(?=(?:<h6[^>]*>[\s\S]*?<\/h6>\s*|<div class="section-subtitle">[\s\S]*?<\/div>\s*)?<h2|$)/gi;
const blocksSplit = content.match(sectionRegex) || [];

console.log('Total blocks:', blocksSplit.length);
blocksSplit.forEach((b, i) => {
  console.log('--- BLOCK', i, '---');
  console.log(b);
});
