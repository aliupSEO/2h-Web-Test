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
    
    console.log("=== ALL H1 TAGS ===");
    const h1s = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)];
    h1s.forEach((m, i) => console.log(`${i}: ${m[1].replace(/<[^>]*>?/gm, '').trim()}`));

    console.log("\n=== ALL H2 TAGS ===");
    const h2s = [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)];
    h2s.forEach((m, i) => console.log(`${i}: ${m[1].replace(/<[^>]*>?/gm, '').trim()}`));
    
    console.log("\n=== ALL H3 TAGS ===");
    const h3s = [...html.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>/gi)];
    h3s.forEach((m, i) => console.log(`${i}: ${m[1].replace(/<[^>]*>?/gm, '').trim()}`));

    console.log("\n=== ALL H4 TAGS ===");
    const h4s = [...html.matchAll(/<h4[^>]*>([\s\S]*?)<\/h4>/gi)];
    h4s.forEach((m, i) => console.log(`${i}: ${m[1].replace(/<[^>]*>?/gm, '').trim()}`));

  } catch (err) {
    console.error(err);
  }
}

debug();
