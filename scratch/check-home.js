async function check() {
  const query = `
    query getHomePage {
      page(id: "home", idType: URI) {
        title
        content
        featuredImage {
          node { sourceUrl }
        }
      }
    }
  `;
  
  const res = await fetch("https://silvioh23.sg-host.com/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query })
  });
  const data = await res.json();
  console.log(data.data.page.content);
}

check();
