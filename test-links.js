const endpoint = 'http://silvioh23.sg-host.com/graphql';
fetch(endpoint, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query: 'query { pages(where: { name: "portfolios" }) { nodes { content } } }' })
}).then(r => r.json()).then(data => {
  const content = data.data.pages.nodes[0].content;
  const parts = content.split(/<div class="(?:portfolio-item|item)">/i);
  parts.shift();
  parts.forEach((p, i) => {
    const aMatch = p.match(/<a[^>]*href=["'](.*?)["']/i);
    console.log(`Item ${i+1} link: ${aMatch ? aMatch[1] : 'NONE'}`);
  });
}).catch(console.error);
