fetch('http://silvioh23.sg-host.com/graphql', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: `query { pages(where: { name: "seo" }) { nodes { content } } }`
  })
}).then(r => r.json()).then(data => console.log(data.data.pages.nodes[0].content));
