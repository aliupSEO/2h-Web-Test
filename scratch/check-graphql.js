const username = 'hartleb@2hws.at';
const password = '9dzk Jyhh RdZ2 DMLs UzFf AvF6';
const baseUrl = 'https://silvioh23.sg-host.com';

const authString = Buffer.from(`${username}:${password}`).toString("base64");

async function checkGraphQL() {
  const query = `
    query {
      pages(where: { name: "home" }) {
        nodes {
          id
          title
          slug
          content
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
  const content = json.data.pages.nodes[0].content;
  console.log("GraphQL Content Length:", content.length);
  
  // Test projects regex
  const projItemRegex = /<div class="project-item">[\s\S]*?<h6 class="project-tags">(.*?)<\/h6>[\s\S]*?<h3 class="project-title">(.*?)<\/h3>[\s\S]*?<a class="project-link" href="(.*?)">[\s\S]*?<img[^>]*class="project-image"[^>]*src="(.*?)"/g;
  const projects = [];
  let match;
  while ((match = projItemRegex.exec(content)) !== null) {
    projects.push(match[2]);
  }
  console.log("Projects found via GraphQL:", projects);

  // Test testimonials regex
  const testItemRegex = /<div class="testimonial-item">[\s\S]*?<p class="testimonial-text">(.*?)<\/p>[\s\S]*?<h6 class="testimonial-author">(.*?)<\/h6>[\s\S]*?<p class="testimonial-role">(.*?)<\/p>[\s\S]*?<img[^>]*class="testimonial-image"[^>]*src="(.*?)"/g;
  const testimonials = [];
  while ((match = testItemRegex.exec(content)) !== null) {
    testimonials.push(match[2]);
  }
  console.log("Testimonials found via GraphQL:", testimonials);

  // Output projects section html snippet
  const projMatch = content.match(/<div class="projects-section">[\s\S]*?<div class="testimonials-section">/);
  if (projMatch) {
    console.log("Snippet:", projMatch[0]);
  } else {
    console.log("Snippet: NOT FOUND");
  }
}

checkGraphQL();
