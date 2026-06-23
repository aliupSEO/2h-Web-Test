const username = 'hartleb@2hws.at';
const password = '9dzk Jyhh RdZ2 DMLs UzFf AvF6';
const baseUrl = 'https://silvioh23.sg-host.com';

const authString = Buffer.from(`${username}:${password}`).toString("base64");

async function updateHomeNextStep() {
  // 1. Fetch home page ID
  const pagesRes = await fetch(`${baseUrl}/wp-json/wp/v2/pages?slug=home`, {
    headers: { 'Authorization': `Basic ${authString}` }
  });
  const pages = await pagesRes.json();
  if (!pages || pages.length === 0) {
    console.log("Could not find 'home' page");
    return;
  }
  
  const homePage = pages[0];
  let content = homePage.content.raw || homePage.content.rendered;
  
  // The new HTML for Next Step section
  // Note: we use a placeholder image if the user hasn't provided one yet
  const newHtml = `
<div class="next-step-section">
  <img class="next-step-image" src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80" alt="City Street" />
  <h2 class="section-title">NEUES PROJEKT GEPLANT?</h2>
  <p class="description">In einem kurzen Gespräch analysiert 2H Websolutions die aktuelle Situation und zeigt konkret, wie mehr Anfragen über die Website entstehen können.</p>
  <a class="button-link" href="/contact">KOSTENLOSES ERSTGESPRÄCH BUCHEN</a>
  <div class="feature-item">UNVERBINDLICH</div>
  <div class="feature-item">KLARE EINSCHÄTZUNG</div>
  <div class="feature-item">TRANSPARENT</div>
</div>
`;

  // 2. Replace or Append
  if (content.includes('class="next-step-section"')) {
    // Replace existing section
    content = content.replace(/<div class="next-step-section">[\s\S]*?<\/div>\s*?(<!--.*-->)?/i, newHtml);
  } else {
    // Append
    content += "\n" + newHtml;
  }
  
  // 3. Update the page
  const updateRes = await fetch(`${baseUrl}/wp-json/wp/v2/pages/${homePage.id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${authString}`
    },
    body: JSON.stringify({ content })
  });
  
  if (!updateRes.ok) {
    console.log("Failed to update home page:", await updateRes.text());
  } else {
    console.log("Successfully updated home page with new next-step-section HTML!");
  }
}

updateHomeNextStep();
