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
    
    // Simulate extractAgencyServicesData
    const services = [];
    const startRegex = /<h2[^>]*>(?:(?!<\/h2>)[\s\S])*?(Unsere Leistungen|Leistungen|Services|Angebot|Expertise|Kompetenzen|Schwerpunkte|Was wir machen|Was wir bieten|What we do|Dienstleistungen|Skills)(?:(?!<\/h2>)[\s\S])*?<\/h2>/i;
    const startMatch = html.match(startRegex);
    
    console.log("Start match:", !!startMatch);
    if (!startMatch || startMatch.index === undefined) return console.log("Failed at startMatch");
    
    const sectionTitle = startMatch[0].replace(/<[^>]*>?/gm, '').trim();
    console.log("Section Title:", sectionTitle);
    
    let sectionHtml = html.substring(startMatch.index + startMatch[0].length);
    
    const endRegex = /<h2[^>]*>(?:(?!<\/h2>)[\s\S])*?(Warum wir\?|Unsere Projekte|Unsere Referenzen|Projekte|Referenzen|Portfolio|Cases|Arbeiten|Galerie|Work|Erfolge|Kunden|Case Studies)(?:(?!<\/h2>)[\s\S])*?<\/h2>/i;
    const endMatch = sectionHtml.match(endRegex);
    console.log("End match:", !!endMatch);
    
    if (endMatch && endMatch.index !== undefined) {
      sectionHtml = sectionHtml.substring(0, endMatch.index);
    }
    
    const h2Regex = /<h2[^>]*>([\s\S]*?)<\/h2>/gi;
    const matches = [...sectionHtml.matchAll(h2Regex)];
    console.log("Service matches count:", matches.length);
    
    for (let i = 0; i < matches.length; i++) {
        const title = matches[i][1].replace(/<[^>]*>?/gm, '').trim();
        console.log("Found service:", title);
    }
    
    // Test Project regex
    const projectSectionRegex = /<h2[^>]*>(?:(?!<\/h2>)[\s\S])*?(Unsere Projekte|Unsere Referenzen|Projekte|Referenzen|Portfolio|Cases|Arbeiten|Galerie|Work|Erfolge|Kunden|Case Studies|Use Cases)(?:(?!<\/h2>)[\s\S])*?<\/h2>/i;
    console.log("Project match:", projectSectionRegex.test(html));
  } catch (err) {
    console.error(err);
  }
}

debug();
