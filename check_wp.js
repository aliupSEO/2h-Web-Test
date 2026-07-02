const fs = require('fs');

async function run() {
  const envFile = fs.readFileSync('.env.local', 'utf8');
  let url = '';
  for (const line of envFile.split('\n')) {
    if (line.startsWith('NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL=')) {
      url = line.split('=')[1].trim().replace(/['"]/g, '');
    }
  }

  const query = `
    query {
      pageBy(uri: "wir") {
        content
      }
    }
  `;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  });

  const data = await res.json();
  fs.writeFileSync('wp_content.html', data.data.pageBy.content);
}

run();
