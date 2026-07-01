async function run() {
  const res = await fetch('https://silvioh23.sg-host.com/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: '{ pages(where: { name: "kontakt" }) { nodes { content } } }' })
  });
  const data = await res.json();
  console.log(data.data.pages.nodes[0].content);
}

run();
