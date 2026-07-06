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
    
    // Clean split, filtering out empty chunks
    const parts = html.split(/(?=<h2[^>]*>)/i).filter(p => p.replace(/<[^>]*>?/gm, '').trim().length > 0);
    
    const projectsIndex = parts.findIndex(part => /<h4[^>]*>/i.test(part));
    
    console.log("Projects Index:", projectsIndex);
    
    // We expect parts[1] to be About, parts[2] to be Services Title
    console.log("--- PART 1 (Expected About) ---");
    const m1 = parts[1].match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
    console.log(m1 ? m1[1].replace(/<[^>]*>?/gm, '').trim() : "NO H2");
    
    console.log("--- PART 2 (Expected Services Title) ---");
    const m2 = parts[2].match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
    console.log(m2 ? m2[1].replace(/<[^>]*>?/gm, '').trim() : "NO H2");
    
    console.log("--- PARTS 3 to projectsIndex-1 (Expected Services) ---");
    for (let i = 3; i < projectsIndex; i++) {
        const m = parts[i].match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
        console.log(" -", m ? m[1].replace(/<[^>]*>?/gm, '').trim() : "NO H2");
    }
    
  } catch (err) {
    console.error(err);
  }
}

debug();
