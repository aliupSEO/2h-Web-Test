const username = 'hartleb@2hws.at';
const password = '9dzk Jyhh RdZ2 DMLs UzFf AvF6';
const baseUrl = 'https://silvioh23.sg-host.com';

const authString = Buffer.from(`${username}:${password}`).toString("base64");

const htmlContent = `
<div class="footer-section">
  <a class="footer-btn" href="/kontakt">KOSTENLOSES ERSTGESPRÄCH BUCHEN</a>

  <div class="footer-col-2">
    <h4 class="footer-heading">DIGITALE LÖSUNGEN</h4>
    <a class="footer-link" href="/webdesign">Webdesign</a>
    <a class="footer-link" href="/webshops">Webshops</a>
    <a class="footer-link" href="/seo">SEO</a>
    <a class="footer-link" href="/google-ads">Google Ads</a>
  </div>

  <div class="footer-col-3">
    <h4 class="footer-heading">2H WEBSOLUTIONS</h4>
    <a class="footer-link" href="/uber-mich">Über mich</a>
    <a class="footer-link" href="/referenzen">Referenzen</a>
    <a class="footer-link" href="/kontakt">Kontakt</a>
  </div>

  <div class="footer-col-4">
    <h4 class="footer-heading">Lass uns ein Spiel spielen</h4>
  </div>
</div>
`;

async function createFooterPage() {
  const res = await fetch(`${baseUrl}/wp-json/wp/v2/pages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${authString}`
    },
    body: JSON.stringify({
      title: 'Footer',
      slug: 'footer',
      content: htmlContent,
      status: 'publish'
    })
  });

  const data = await res.json();
  console.log(data.id ? 'Success created page ' + data.id : data);
}

createFooterPage();
