const username = 'hartleb@2hws.at';
const password = '9dzk Jyhh RdZ2 DMLs UzFf AvF6';
const baseUrl = 'https://silvioh23.sg-host.com';

const authString = Buffer.from(`${username}:${password}`).toString("base64");

async function checkRevisions() {
  // 1. Get home page ID
  const pagesRes = await fetch(`${baseUrl}/wp-json/wp/v2/pages?slug=home`, {
    headers: { 'Authorization': `Basic ${authString}` }
  });
  const pages = await pagesRes.json();
  const pageId = pages[0].id;
  
  // 2. Get revisions
  const revRes = await fetch(`${baseUrl}/wp-json/wp/v2/pages/${pageId}/revisions`, {
    headers: { 'Authorization': `Basic ${authString}` }
  });
  const revisions = await revRes.json();
  
  console.log(`Found ${revisions.length} revisions.`);
  
  for (let rev of revisions) {
    const content = rev.content.raw || rev.content.rendered;
    console.log(`\n--- Revision ID: ${rev.id} | Date: ${rev.date} ---`);
    if (content.includes('JUMPIN PRATER') || content.includes('DANIEL')) {
      console.log(">> THIS REVISION CONTAINS THE ORIGINAL PROJECTS/TESTIMONIALS!");
      
      // Let's just print the exact HTML of the projects and testimonials
      const projMatch = content.match(/<div class="projects-section">[\s\S]*?<div class="testimonials-section">/);
      if (projMatch) console.log("Projects found in this revision.");
    } else {
      console.log("Does not contain Jumpin Prater.");
    }
  }
}

checkRevisions();
