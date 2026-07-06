const fs = require('fs');

async function debug() {
  const query = `
    query {
      pages(where: { name: "agency" }) {
        nodes {
          content
        }
      }
    }
  `;
  try {
    const response = await fetch("https://silvioh23.sg-host.com/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });
    const result = await response.json();
    const html = result.data?.pages?.nodes?.[0]?.content || "";
    const parts = html.split(/(?=<h2[^>]*>)/i).filter(p => p.replace(/<[^>]*>?/gm, '').trim().length > 0);
    console.log("PART 2:", parts[2]);
  } catch (err) {
    console.error(err);
  }
}
debug();
