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
    
    const h2Parts = html.split(/(?=<h2[^>]*>)/i);
    const projectsIndex = h2Parts.findIndex(part => /<h4[^>]*>/i.test(part));
    
    const servicesTitleIndex = h2Parts.findIndex((part, index) => {
        return index < projectsIndex && 
               /<h2[^>]*>(?:(?!<\/h2>)[\s\S])*?(Unsere Leistungen|Leistungen|Services|Angebot|Expertise|Kompetenzen|Schwerpunkte|Was wir machen|Was wir bieten|What we do|Dienstleistungen|Skills|Lösungen|Solutions)(?:(?!<\/h2>)[\s\S])*?<\/h2>/i.test(part) &&
               !/<img[^>]*>/i.test(part);
    });
    
    console.log("Services Title Index:", servicesTitleIndex);
    
    if (servicesTitleIndex !== -1) {
       const block = h2Parts[servicesTitleIndex];
       const match = block.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
       console.log("Title:", match ? match[1].replace(/<[^>]*>?/gm, '').trim() : "None");
       
       const serviceBlocks = h2Parts.slice(servicesTitleIndex + 1, projectsIndex);
       console.log("Individual Services:", serviceBlocks.length);
       serviceBlocks.forEach(s => {
          const m = s.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
          console.log(" - ", m ? m[1].replace(/<[^>]*>?/gm, '').trim() : "None");
       });
    }
    
  } catch (err) {
    console.error(err);
  }
}

debug();
