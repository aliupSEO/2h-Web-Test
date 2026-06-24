const fs = require('fs');
const html = fs.readFileSync('new_simple_content.html', 'utf-8');

const username = "hartleb@2hws.at";
const password = "9dzk Jyhh RdZ2 DMLs UzFf AvF6";
const encodedCredentials = Buffer.from(`${username}:${password}`).toString("base64");

async function updatePage() {
  try {
    const res = await fetch("https://silvioh23.sg-host.com/wp-json/wp/v2/pages/212", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${encodedCredentials}`
      },
      body: JSON.stringify({
        content: html
      })
    });

    if (res.ok) {
      console.log("Page updated successfully with new content.");
    } else {
      const errorText = await res.text();
      console.error("Failed to update page:", res.status, res.statusText);
      console.error(errorText);
    }
  } catch (err) {
    console.error("Error updating page:", err);
  }
}

updatePage();
