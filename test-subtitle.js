const fs = require('fs');
const html = fs.readFileSync('raw-seo.html', 'utf8');
const regex = /<div[^>]*class=["']section-subtitle["'][^>]*>([\s\S]*?)<\/div>/gi;
let match;
while ((match = regex.exec(html)) !== null) {
  console.log('Subtitle match:', match[0]);
}
