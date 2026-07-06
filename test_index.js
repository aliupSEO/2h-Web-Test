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
    
    const parts = html.split(/(?=<h2[^>]*>)/i).filter(p => p.trim().length > 0);
    
    console.log("=== PARTS ===");
    parts.forEach((p, i) => {
        const h2Match = p.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
        const title = h2Match ? h2Match[1].replace(/<[^>]*>?/gm, '').trim() : "NO H2";
        console.log(`[${i}] ${title}`);
    });
    
  } catch (err) {
    console.error(err);
  }
}

debug();
