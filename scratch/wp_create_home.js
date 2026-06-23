const username = 'hartleb@2hws.at';
const password = '9dzk Jyhh RdZ2 DMLs UzFf AvF6';
const url = 'https://silvioh23.sg-host.com/wp-json/wp/v2/pages';

const htmlContent = `
<!-- ABOUT SECTION -->
<div class="about-section">
    <div class="section-subtitle">Die Realität</div>
    <div class="section-title"><span>Sieht gut aus</span><br>reicht nicht</div>
    <p class="description">Viele Websites sehen gut aus – bringen aber keine Anfragen. Was danach kommt, entscheidet: Wird Ihre Website gefunden? Verstehen Besucher sofort, worum es geht? Melden sie sich?</p>
    <h5 class="motto">2H Websolutions kümmert sich genau darum - Alles aus einer Hand</h5>
    <a class="button-link" href="/wir">Mehr über mich</a>
    <a class="phone-link" href="tel:+436764508579">+43 676 4508579</a>
    <img class="about-image" src="https://silvioh23.sg-host.com/wp-content/uploads/2026/06/WhatsApp-Image-2026-01-07-at-21_converted.webp" alt="About Image" />
</div>

<!-- SERVICES SECTION -->
<div class="services-section">
    <div class="section-subtitle">Damit aus Besuchern Anfragen werden</div>
    <div class="section-title">Websites weitergedacht</div>
    
    <div class="service-items">
        <div class="service-item">
            <h5 class="service-title">Webdesign & Ecommerce</h5>
            <p class="service-desc">Eine Website ist mehr als Design. Sie ist der zentrale Punkt, an dem sich entscheidet, ob Besucher bleiben, Vertrauen aufbauen und anfragen. 2H Websolutions entwickelt Websites und Webshops, die klar strukturiert sind, logisch führen und gezielt auf Conversion ausgerichtet sind. Design, Inhalte und Technik greifen dabei ineinander – für messbare Ergebnisse.</p>
            <a class="service-link" href="/service/webdesign">Mehr erfahren</a>
        </div>
        <div class="service-item">
            <h5 class="service-title">SEO</h5>
            <p class="service-desc">Sichtbarkeit entsteht nicht zufällig. Sie entsteht dort, wo potenzielle Kunden aktiv nach Lösungen suchen. 2H Websolutions sorgt dafür, dass Ihre Website genau dort erscheint – mit klarer Struktur, relevanten Inhalten und einer Strategie, die langfristig Anfragen bringt.</p>
            <a class="service-link" href="/service/seo-beratung-wien">Mehr erfahren</a>
        </div>
        <div class="service-item">
            <h5 class="service-title">SEA</h5>
            <p class="service-desc">Schnelle Ergebnisse brauchen klare Steuerung. Nicht mehr Budget, sondern bessere Kampagnen entscheiden über Erfolg. 2H Websolutions entwickelt und optimiert Google Ads Kampagnen so, dass gezielt die richtigen Anfragen entstehen – messbar, nachvollziehbar und ohne Streuverluste.</p>
            <a class="service-link" href="/service/google-ads-agentur-wien">Mehr erfahren</a>
        </div>
    </div>
</div>
`;

fetch(url, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(username + ':' + password).toString('base64')
    },
    body: JSON.stringify({
        title: 'Ein digitales System für mehr Anfragen',
        content: htmlContent,
        status: 'publish',
        slug: 'home',
        featured_media: 195 // homepage-banner from previous output
    })
})
.then(res => res.json())
.then(data => {
    console.log("Created Page:", data.id, data.slug);
})
.catch(err => console.error(err));
