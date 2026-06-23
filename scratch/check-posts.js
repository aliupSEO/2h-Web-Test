const username = 'hartleb@2hws.at';
const password = '9dzk Jyhh RdZ2 DMLs UzFf AvF6';
const baseUrl = 'https://silvioh23.sg-host.com';

const authString = Buffer.from(`${username}:${password}`).toString("base64");

async function checkPosts() {
  const query = `
    query {
      projectsAlt: posts(where: { categoryName: "projects" }) {
        nodes { title }
      }
      testimonialsAlt: posts(where: { categoryName: "testimonials" }) {
        nodes { title }
      }
    }
  `;

  const res = await fetch(`${baseUrl}/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${authString}`
    },
    body: JSON.stringify({ query })
  });

  const json = await res.json();
  console.log("Projects:", json.data.projectsAlt.nodes.map(n => n.title));
  console.log("Testimonials:", json.data.testimonialsAlt.nodes.map(n => n.title));
}

checkPosts();
