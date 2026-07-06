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
    
    // 1. Find About Section (has 2+ images, no h4)
    const aboutIndex = h2Parts.findIndex(part => {
      const imgs = [...part.matchAll(/<img[^>]*>/gi)];
      return imgs.length >= 2 && !/<h4[^>]*>/i.test(part);
    });
    
    // 2. Find Projects Section (has h4 tags)
    const projectsIndex = h2Parts.findIndex(part => /<h4[^>]*>/i.test(part));
    
    console.log("About Index:", aboutIndex);
    console.log("Projects Index:", projectsIndex);
    
    if (aboutIndex === -1 || projectsIndex === -1) return console.log("Missing anchors");
    
    // 3. Find the first actual Service block (has img + p, between About and Projects)
    const firstServiceIndex = h2Parts.findIndex((part, index) => {
      return index > aboutIndex && index < projectsIndex && /<img[^>]*>/i.test(part) && /<p[^>]*>/i.test(part);
    });
    
    console.log("First Service Index:", firstServiceIndex);
    
    if (firstServiceIndex === -1 || firstServiceIndex <= aboutIndex + 1) {
       console.log("Services Title is just aboutIndex + 1");
    }
    
    const servicesTitleIndex = firstServiceIndex - 1;
    
    const servicesTitleBlock = h2Parts[servicesTitleIndex];
    const match = servicesTitleBlock.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
    console.log("SERVICES TITLE:", match ? match[1].replace(/<[^>]*>?/gm, '').trim() : "NO MATCH");
    
    const services = h2Parts.slice(firstServiceIndex, projectsIndex);
    console.log("SERVICES COUNT:", services.length);
    services.forEach(s => {
       const m = s.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
       console.log(" - ", m ? m[1].replace(/<[^>]*>?/gm, '').trim() : "");
    });
    
  } catch (err) {
    console.error(err);
  }
}

debug();
