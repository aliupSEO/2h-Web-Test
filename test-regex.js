const endpoint = 'http://silvioh23.sg-host.com/graphql';
fetch(endpoint, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query: 'query { pages(where: { name: "portfolios" }) { nodes { content } } }' })
}).then(r => r.json()).then(data => {
  const html = data.data.pages.nodes[0].content;
  
  const items = [];
  const itemRegex = /<div class="(?:portfolio-item|item)">[\s\S]*?<img[^>]*?src=["'](.*?)["'][^>]*>[\s\S]*?<h4[^>]*>(.*?)<\/h4>([\s\S]*?)<\/div>/gi;
  let match;
  while ((match = itemRegex.exec(html)) !== null) {
    const blockAfterTitle = match[3];
    const linkMatch = blockAfterTitle.match(/<a[^>]*href=["'](.*?)["']/i);
    
    items.push({
      imageUrl: match[1],
      title: match[2].replace(/<[^>]*>?/gm, '').trim(),
      link: linkMatch ? linkMatch[1] : undefined
    });
  }
  
  console.log('Parsed items:', items.length);
  console.log(items);
}).catch(console.error);
