const fs = require('fs');
const html = fs.readFileSync('raw-seo.html', 'utf8');
const regex = /<div[^>]*elementor-widget-icon-list[^>]*>[\s\S]*?<span[^>]*elementor-icon-list-text[^>]*>([\s\S]*?)<\/span>[\s\S]*?<\/div>/gi;
const newHtml = html.replace(regex, '<div class="section-subtitle">$1</div>');
const index = newHtml.indexOf('section-subtitle');
console.log(newHtml.substring(index - 100, index + 300));
