const fs = require('fs');

async function debug() {
  const query = `
    query {
      pages(where: { name: "agency" }) {
        nodes {
          content
        }
      }
      projects: posts(first: 100, where: { categoryName: "projects" }) {
        nodes { title slug }
      }
      projekte: posts(first: 100, where: { categoryName: "projekte" }) {
        nodes { title slug }
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
    const content = result.data?.pages?.nodes?.[0]?.content || "";
    
    console.log("Projects length:", result.data?.projects?.nodes?.length);
    console.log("Projekte length:", result.data?.projekte?.nodes?.length);
    
    // Test parser
    let pageProjects = [];
    let projectsTitle = "Unsere Projekte";
    const projectSectionRegex = /<h2[^>]*>.*?(Unsere Projekte|Unsere Referenzen|Projekte|Referenzen).*?<\/h2>/i;
    
    console.log("Has match?", projectSectionRegex.test(content));
    if (content && projectSectionRegex.test(content)) {
      const match = content.match(projectSectionRegex);
      if (match && match[1]) {
        projectsTitle = match[1];
      }
      
      const parts = content.split(projectSectionRegex);
      const projectsSection = parts[parts.length - 1]; 
      
      const imgRegex = /<img[^>]*src=["'](.*?)["']/gi;
      const h4Regex = /<h4[^>]*>([\s\S]*?)<\/h4>/gi;
      
      const images = [...projectsSection.matchAll(imgRegex)].map(m => m[1]);
      const titles = [...projectsSection.matchAll(h4Regex)].map(m => m[1].replace(/<[^>]*>?/gm, '').trim());
      console.log("Parsed images length:", images.length);
      console.log("Parsed titles length:", titles.length);
      
      for (let i = 0; i < images.length; i++) {
        let title = titles[i] || `Project ${i + 1}`;
        let imageUrl = images[i].replace(/-\d+x\d+(?=\.[a-z]+$)/i, '');
        pageProjects.push({ title, imageUrl });
      }
    }
    
    console.log("Final pageProjects length:", pageProjects.length);
  } catch (err) {
    console.error(err);
  }
}

debug();
