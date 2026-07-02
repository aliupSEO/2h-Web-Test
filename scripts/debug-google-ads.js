const endpoint = "https://silvioh23.sg-host.com/graphql";
const username = "hartleb@2hws.at";
const password = "9dzk Jyhh RdZ2 DMLs UzFf AvF6";

// SIMULATE THE PARSER LOGIC
function extractSeoPageData(html) {
  let content = html;
  
  const h2Split = content.split(/(?=<h2)/i);
  if (h2Split.length > 0) {
    let heroHtml = h2Split[0];
    
    heroHtml = heroHtml.replace(/<div[^>]*elementor-heading-title[^>]*>([\s\S]*?)<\/div>/gi, (match, p1) => {
      if (p1.includes('<h1')) return match;
      return `<p>${p1}</p>`;
    });

    const bulletPoints = [];
    const iconListRegex = /<span[^>]*elementor-icon-list-text[^>]*>([\s\S]*?)<\/span>/gi;
    let iconMatch;
    while ((iconMatch = iconListRegex.exec(heroHtml)) !== null) {
      const text = iconMatch[1].replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ').trim();
      if (text && text.toLowerCase() !== 'faq') {
        bulletPoints.push(text);
      }
    }

    const titleMatch = heroHtml.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    const pMatch = heroHtml.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
    
    return {
      title: titleMatch ? titleMatch[1].replace(/<[^>]*>?/gm, '').trim() : "",
      description: pMatch ? pMatch[1].replace(/<[^>]*>?/gm, '').trim() : "",
      bulletPoints
    };
  }
  return null;
}

async function run() {
  const authString = Buffer.from(`${username}:${password}`).toString("base64");
  const query = `query GetPage { pages(where: { name: "google-ads" }) { nodes { title content } } }`;

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Basic ${authString}` },
      body: JSON.stringify({ query })
    });

    const json = await res.json();
    const page = json.data.pages.nodes[0];
    
    const heroData = extractSeoPageData(page.content);
    console.log("--- PARSED HERO DATA ---");
    console.log(JSON.stringify(heroData, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }
}

run();
