const username = 'hartleb@2hws.at';
const password = '9dzk Jyhh RdZ2 DMLs UzFf AvF6';
const baseUrl = 'https://silvioh23.sg-host.com';

const authString = Buffer.from(`${username}:${password}`).toString("base64");

async function updateDesignSystem() {
  // 1. Fetch current settings
  const getRes = await fetch(`${baseUrl}/wp-json/design-system/v1/settings`);
  if (!getRes.ok) {
    console.log("Failed to fetch settings:", getRes.status);
    return;
  }
  const settings = await getRes.json();
  
  // 2. Modify the background color
  settings.colors.backgrounds.dark = '#3a3a3a';
  
  // 3. Post back
  const postRes = await fetch(`${baseUrl}/wp-json/design-system/v1/settings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${authString}`
    },
    body: JSON.stringify(settings)
  });
  
  if (!postRes.ok) {
    console.log("Failed to update settings:", postRes.status, await postRes.text());
  } else {
    console.log("Successfully updated Design System Settings! Dark background is now #3a3a3a");
  }
}

updateDesignSystem();
