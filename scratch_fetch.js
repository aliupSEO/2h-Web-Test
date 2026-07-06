const fs = require('fs');

async function main() {
  try {
    // We can read NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL from .env.local
    const envFile = fs.readFileSync('.env.local', 'utf8');
    const endpointMatch = envFile.match(/NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL=(.*)/);
    const endpoint = endpointMatch ? endpointMatch[1].trim() : 'http://localhost/graphql';
    
    console.log("Fetching from:", endpoint);
    
    const query = `
      query {
        pages(where: { name: "agency" }) {
          nodes {
            content
          }
        }
      }
    `;
    
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
  } catch(e) {
    console.error(e);
  }
}
main();
