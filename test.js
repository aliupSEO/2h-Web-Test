fetch('https://silvioh23.sg-host.com/graphql', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query: 'query { pages(where: { name: "portfolios" }) { nodes { content } } }' })
}).then(res => res.json()).then(data => console.log(data.data.pages.nodes[0].content.substring(0, 1000)));
