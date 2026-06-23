

async function test() {
  const res = await fetch('https://silvioh23.sg-host.com/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: '{ page(id: "home", idType: URI) { content } }' })
  });
  const json = await res.json();
  console.log(json.data.page.content.substring(0, 500));
}

test();
