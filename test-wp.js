const endpoint = 'http://silvioh23.sg-host.com/graphql';
fetch(endpoint, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query: 'query { pages(where: { name: "portfolios" }) { nodes { content } } }' })
}).then(r => r.json()).then(data => {
  const content = data.data.pages.nodes[0].content;
  const parts = content.split(/<div class="(?:portfolio-item|item)">/);
  parts.shift(); // remove everything before the first wrapper
  parts.forEach((p, i) => {
    const imgMatch = p.match(/<img[^>]*?src=["'](.*?)["']/i);
    const h4Match = p.match(/<h4[^>]*>(.*?)<\/h4>/i);
    console.log(`Item ${i+1}:`);
    console.log(`  Img: ${imgMatch ? imgMatch[1] : 'MISSING'}`);
    console.log(`  H4 : ${h4Match ? h4Match[1] : 'MISSING'}`);
    if(!h4Match) {
       console.log(p);
    }
  });
}).catch(console.error);
