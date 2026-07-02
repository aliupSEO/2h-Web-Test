const content = `
<h2>First section</h2>
<p>Content 1</p>
<h6>Subtitle 2</h6>
<h2>Second section</h2>
<p>Content 2</p>
<div class="section-subtitle">Subtitle 3</div>
<h2>Third section</h2>
<p>Content 3</p>
`;

const sectionRegex = /(?:<h6[^>]*>[\s\S]*?<\/h6>\s*|<div class="section-subtitle">[\s\S]*?<\/div>\s*)?<h2[\s\S]*?(?=(?:<h6[^>]*>[\s\S]*?<\/h6>\s*|<div class="section-subtitle">[\s\S]*?<\/div>\s*)?<h2|$)/gi;
const blocks = content.match(sectionRegex) || [];
console.log(blocks);
