require('dotenv').config({path: '.env.local'});
fetch(process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL, {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({query: '{ pages(where: {name: "agency"}) { nodes { content } } }'})
}).then(r => r.json()).then(data => console.log(data.data.pages.nodes[0].content));
