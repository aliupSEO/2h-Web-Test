const fs = require('fs');
let html = fs.readFileSync('raw-seo.html', 'utf8');

const regex = /<div[^>]*elementor-widget-icon-list[^>]*>[\s\S]*?<span[^>]*elementor-icon-list-text[^>]*>([\s\S]*?)<\/span>[\s\S]*?(?=<h2)/gi;

const newHtml = html.replace(regex, '<div class="section-subtitle">$1</div>\n');

const index = newHtml.indexOf('section-subtitle');
console.log("Replaced HTML around subtitle:");
console.log(newHtml.substring(index - 50, index + 200));

const sectionRegex = /(?:<h6[^>]*>[\s\S]*?<\/h6>\s*|<div class="section-subtitle">[\s\S]*?<\/div>\s*)?<h2[\s\S]*?(?=(?:<h6[^>]*>[\s\S]*?<\/h6>\s*|<div class="section-subtitle">[\s\S]*?<\/div>\s*)?<h2|$)/gi;
const blocksSplit = newHtml.match(sectionRegex) || [];

console.log("\nBlocks extracted:");
blocksSplit.forEach((block, idx) => {
  const h2Match = block.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
  const title = h2Match ? h2Match[1].replace(/<[^>]*>?/gm, '').trim() : "No Title";
  console.log(`Block ${idx}: ${title.substring(0, 50)}`);
});
