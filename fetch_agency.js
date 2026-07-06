const fs = require('fs');

async function fetchAgencyPage() {
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
    const content = result.data?.pages?.nodes?.[0]?.content || "";
    
    fs.writeFileSync("agency_content.html", content);
    console.log("Saved content length:", content.length);
  } catch (err) {
    console.error(err);
  }
}

fetchAgencyPage();
