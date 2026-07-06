const fs = require('fs');

const content = fs.readFileSync('agency_content.html', 'utf-8');

if (content.includes("Unsere Projekte")) {
    const projectsSection = content.split(/Unsere Projekte/i)[1];
    
    const imgRegex = /<img[^>]*src=["'](.*?)["']/gi;
    const h4Regex = /<h4[^>]*>([\s\S]*?)<\/h4>/gi;
    
    const images = [...projectsSection.matchAll(imgRegex)].map(m => m[1]);
    const titles = [...projectsSection.matchAll(h4Regex)].map(m => m[1].replace(/<[^>]*>?/gm, '').trim());
    
    const pageProjects = [];
    for (let i = 0; i < images.length; i++) {
      let title = titles[i] || `Project ${i + 1}`;
      let imageUrl = images[i].replace(/-\d+x\d+(?=\.[a-z]+$)/i, '');
      
      if (!title || title === `Project ${i + 1}`) {
        if (imageUrl.includes("jw.png")) title = "Jumpin Warrior";
        else title = `Projekt ${i + 1}`;
      }
      
      pageProjects.push({ title, imageUrl });
    }
    
    console.log("Extracted:", pageProjects);
}
