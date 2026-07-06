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
    
    // Split by H2
    // We want to split but keep the H2!
    const h2Parts = html.split(/(?=<h2[^>]*>)/i);
    
    // 1. Projects Section is the one with H4 tags
    const projectsPartIndex = h2Parts.findIndex(part => /<h4[^>]*>/i.test(part));
    
    if (projectsPartIndex !== -1) {
        const projectsPart = h2Parts[projectsPartIndex];
        const match = projectsPart.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
        const projectsTitle = match ? match[1].replace(/<[^>]*>?/gm, '').trim() : "";
        console.log("PROJECTS TITLE:", projectsTitle);
    }
    
    // 2. Services Section
    // We know Services is the one that contains OTHER H2s? No, h2Parts splits on EVERY H2!
    // So "Unsere Leistungen" is a part. "Webentwicklung" is a part.
    // The Services Title is the part that has NO <p> tags maybe?
    // Actually, About is the part with 2+ images.
    const aboutPartIndex = h2Parts.findIndex(part => {
        const imgs = [...part.matchAll(/<img[^>]*>/gi)];
        return imgs.length >= 2 && !/<h4[^>]*>/i.test(part); // exclude projects
    });
    
    if (aboutPartIndex !== -1) {
        const aboutPart = h2Parts[aboutPartIndex];
        const match = aboutPart.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
        const aboutTitle = match ? match[1].replace(/<[^>]*>?/gm, '').trim() : "";
        console.log("ABOUT TITLE:", aboutTitle);
        
        // 3. Services Title is the part IMMEDIATELY AFTER About!
        const servicesPartIndex = aboutPartIndex + 1;
        if (servicesPartIndex < projectsPartIndex) {
            const servicesPart = h2Parts[servicesPartIndex];
            const smatch = servicesPart.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
            const servicesTitle = smatch ? smatch[1].replace(/<[^>]*>?/gm, '').trim() : "";
            console.log("SERVICES TITLE:", servicesTitle);
            
            // The individual services are all parts between servicesPartIndex+1 and projectsPartIndex!
            const individualServices = h2Parts.slice(servicesPartIndex + 1, projectsPartIndex);
            console.log("INDIVIDUAL SERVICES COUNT:", individualServices.length);
            individualServices.forEach(p => {
                const im = p.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
                console.log(" -", im ? im[1].replace(/<[^>]*>?/gm, '').trim() : "Unknown");
            });
        }
    }
    
  } catch (err) {
    console.error(err);
  }
}

debug();
