const username = 'hartleb@2hws.at';
const password = '9dzk Jyhh RdZ2 DMLs UzFf AvF6';
const baseUrl = 'https://silvioh23.sg-host.com';

const authString = Buffer.from(`${username}:${password}`).toString("base64");

async function checkPostFields() {
  const query = `
    query {
      projectsAlt: posts(where: { categoryName: "projects" }) {
        nodes { 
          title 
          slug 
          content 
          excerpt
          tags { nodes { name } }
          featuredImage { node { sourceUrl } }
        }
      }
      testimonialsAlt: posts(where: { categoryName: "testimonials" }) {
        nodes { 
          title 
          content 
          excerpt 
          tags { nodes { name } }
          featuredImage { node { sourceUrl } }
        }
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
  console.log("Project 1:", JSON.stringify(json.data.projectsAlt.nodes[1], null, 2));
  console.log("Testimonial 1:", JSON.stringify(json.data.testimonialsAlt.nodes[5], null, 2));
}

checkPostFields();
