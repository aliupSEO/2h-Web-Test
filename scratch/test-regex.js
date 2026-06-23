const username = 'hartleb@2hws.at';
const password = '9dzk Jyhh RdZ2 DMLs UzFf AvF6';
const baseUrl = 'https://silvioh23.sg-host.com';

const authString = Buffer.from(`${username}:${password}`).toString("base64");

async function testRegex() {
  const pagesRes = await fetch(`${baseUrl}/wp-json/wp/v2/pages?slug=home`, {
    headers: { 'Authorization': `Basic ${authString}` }
  });
  const pages = await pagesRes.json();
  const html = pages[0].content.rendered;
  
  const itemRegex = /<div class="project-item">[\s\S]*?<h6 class="project-tags">(.*?)<\/h6>[\s\S]*?<h3 class="project-title">(.*?)<\/h3>[\s\S]*?<a class="project-link" href="(.*?)">[\s\S]*?<img[^>]*class="project-image"[^>]*src="(.*?)"/g;
  
  let match;
  const projects = [];
  while ((match = itemRegex.exec(html)) !== null) {
    projects.push(match[2]);
  }
  
  console.log("Projects found:", projects);
  console.log("Projects section HTML snippet:");
  const projMatch = html.match(/<div class="projects-section">[\s\S]*?<\/div>\s*?<\/div>/);
  if (projMatch) {
    console.log(projMatch[0].substring(0, 500));
  } else {
    console.log(html.substring(0, 500));
  }
}

testRegex();
