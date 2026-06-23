const query = `
query {
  pages(where: { name: "footer" }) {
    nodes {
      content
    }
  }
}`;
fetch('https://silvioh23.sg-host.com/graphql', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query })
}).then(r => r.json()).then(console.log);
