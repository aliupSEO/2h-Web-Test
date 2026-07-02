const fs = require('fs');
let html = fs.readFileSync('raw-seo.html', 'utf8');

html = html.replace(/<div[^>]*elementor-widget-icon-list[^>]*>[\s\S]*?<span[^>]*elementor-icon-list-text[^>]*>([\s\S]*?)<\/span>[\s\S]*?<\/div>/gi, '<div class="section-subtitle">$1</div>');

const sectionRegex = /(?:<h6[^>]*>[\s\S]*?<\/h6>\s*|<div class="section-subtitle">[\s\S]*?<\/div>\s*)?<h2[\s\S]*?(?=(?:<h6[^>]*>[\s\S]*?<\/h6>\s*|<div class="section-subtitle">[\s\S]*?<\/div>\s*)?<h2|$)/gi;

const blocksSplit = html.match(sectionRegex) || [];

blocksSplit.forEach((b, i) => {
  if (b.includes('Was SEO bringt')) {
    console.log('--- FOUND IN BLOCK', i, '---');
    console.log(b.substring(0, 150));
  }
});
