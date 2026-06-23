const url = 'https://silvioh23.sg-host.com/graphql';
const query = `
query {
  pageBy(uri: "home") {
    content
  }
}
`;

fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query })
})
.then(res => res.json())
.then(data => {
  const html = data.data.pageBy.content;
  console.log("HTML:", html.substring(0, 500));
  
  const hasHero = html.includes('hero-section');
  console.log("Has hero-section?", hasHero);
  
  const subtitleMatch = html.match(/<div class="hero-subtitle">([\s\S]*?)<\/div>/);
  console.log("Subtitle Match:", subtitleMatch ? subtitleMatch[1] : "NULL");
})
.catch(err => console.error(err));
