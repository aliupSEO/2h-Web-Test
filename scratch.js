// scratch.js
const https = require("https");
const fs = require("fs");

async function run() {
  // Let's just fetch the raw graphql response
  const query = `
    query getPage {
      pageBy(uri: "wir") {
        content
      }
    }
  `;
  
  // We need the NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL from .env.local
  const envFile = fs.readFileSync(".env.local", "utf-8");
  const urlMatch = envFile.match(/NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL=(.*)/);
  if (!urlMatch) return console.log("No URL found");
  
  let url = urlMatch[1].trim().replace(/['"]/g, '');
  
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  };
  
  const req = https.request(url, options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log(data.substring(0, 500) + '...');
      fs.writeFileSync('scratch-out.json', data);
    });
  });
  
  req.write(JSON.stringify({ query }));
  req.end();
}

run();
