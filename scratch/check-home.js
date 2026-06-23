const username = 'hartleb@2hws.at';
const password = '9dzk Jyhh RdZ2 DMLs UzFf AvF6';
const baseUrl = 'https://silvioh23.sg-host.com';

const authString = Buffer.from(`${username}:${password}`).toString("base64");

async function checkContent() {
  const pagesRes = await fetch(`${baseUrl}/wp-json/wp/v2/pages?slug=home`, {
    headers: { 'Authorization': `Basic ${authString}` }
  });
  const pages = await pagesRes.json();
  console.log(pages[0].content.raw || pages[0].content.rendered);
}
checkContent();
