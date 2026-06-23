

const username = 'hartleb@2hws.at';
const password = '9dzk Jyhh RdZ2 DMLs UzFf AvF6';
const baseUrl = 'https://silvioh23.sg-host.com';

const authString = Buffer.from(`${username}:${password}`).toString("base64");

async function restoreHome() {
  const pagesRes = await fetch(`${baseUrl}/wp-json/wp/v2/pages?slug=home`, {
    headers: { 'Authorization': `Basic ${authString}` }
  });
  const pages = await pagesRes.json();
  if (!pages || pages.length === 0) return;
  const homePage = pages[0];

  const fullHtml = `
<!-- ABOUT SECTION -->
<div class="about-section">
<div class="section-subtitle">Die Realität</div>
<div class="section-title"><span>Sieht gut aus</span><br />reicht nicht</div>
<p class="description">Viele Websites sehen gut aus – bringen aber keine Anfragen. Was danach kommt, entscheidet: Wird Ihre Website gefunden? Verstehen Besucher sofort, worum es geht? Melden sie sich?</p>
<h5 class="motto">2H Websolutions kümmert sich genau darum &#8211; Alles aus einer Hand</h5>
<a class="button-link" href="/wir">Mehr über mich</a><br />
<a class="phone-link" href="tel:+436764508579">+43 676 4508579</a><br />
<img decoding="async" class="about-image" src="https://silvioh23.sg-host.com/wp-content/uploads/2026/06/WhatsApp-Image-2026-01-07-at-21_converted.webp" alt="About Image" />
</div>

<!-- SERVICES SECTION -->
<div class="services-section">
<div class="section-subtitle">Damit aus Besuchern Anfragen werden</div>
<div class="section-title">Websites weitergedacht</div>
<div class="service-items">
  <div class="service-item">
    <h5 class="service-title">Webdesign &#038; Ecommerce</h5>
    <p class="service-desc">Eine Website ist mehr als Design. Sie ist der zentrale Punkt, an dem sich entscheidet, ob Besucher bleiben, Vertrauen aufbauen und anfragen.</p>
    <a class="service-link" href="/service/webdesign">Mehr erfahren</a>
  </div>
  <div class="service-item">
    <h5 class="service-title">SEO</h5>
    <p class="service-desc">Sichtbarkeit entsteht nicht zufällig. Sie entsteht dort, wo potenzielle Kunden aktiv nach Lösungen suchen.</p>
    <a class="service-link" href="/service/seo">Mehr erfahren</a>
  </div>
  <div class="service-item">
    <h5 class="service-title">SEA</h5>
    <p class="service-desc">Schnelle Ergebnisse brauchen klare Steuerung. Nicht mehr Budget, sondern bessere Kampagnen entscheiden über Erfolg.</p>
    <a class="service-link" href="/service/sea">Mehr erfahren</a>
  </div>
</div>
</div>

<!-- PROJECTS SECTION -->
<div class="projects-section">
<div class="section-subtitle">Echte Ergebnisse aus der Praxis</div>
<div class="section-title">Ausgewählte Projekte</div>
<div class="project-items">
  <div class="project-item">
    <h6 class="project-tags">B2B / Industrie</h6>
    <h3 class="project-title">Maschinenbau Müller</h3>
    <a class="project-link" href="/projects/maschinenbau-mueller">Case Study ansehen</a>
    <img class="project-image" src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80" alt="Project 1" />
  </div>
  <div class="project-item">
    <h6 class="project-tags">E-Commerce / Retail</h6>
    <h3 class="project-title">Bio Shop Austria</h3>
    <a class="project-link" href="/projects/bio-shop">Case Study ansehen</a>
    <img class="project-image" src="https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=800&q=80" alt="Project 2" />
  </div>
  <div class="project-item">
    <h6 class="project-tags">Dienstleistung / Local</h6>
    <h3 class="project-title">Zahnarzt Dr. Schmidt</h3>
    <a class="project-link" href="/projects/zahnarzt-schmidt">Case Study ansehen</a>
    <img class="project-image" src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=800&q=80" alt="Project 3" />
  </div>
</div>
</div>

<!-- TESTIMONIALS SECTION -->
<div class="testimonials-section">
<div class="section-subtitle">Kundenstimmen</div>
<div class="section-title">Ergebnisse, die im Alltag spürbar werden</div>
<div class="testimonial-items">
  <div class="testimonial-item">
    <p class="testimonial-text">Seit dem Relaunch haben sich unsere qualifizierten Anfragen verdreifacht. Die Zusammenarbeit war hochprofessionell und zielgerichtet.</p>
    <h6 class="testimonial-author">Michael Bauer</h6>
    <p class="testimonial-role">Geschäftsführer, Bauer GmbH</p>
    <img class="testimonial-image" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80" alt="Michael Bauer" />
  </div>
  <div class="testimonial-item">
    <p class="testimonial-text">Endlich eine Agentur, die nicht nur schönes Design liefert, sondern auch versteht, wie man online Kunden gewinnt.</p>
    <h6 class="testimonial-author">Sarah Weber</h6>
    <p class="testimonial-role">Marketing Leitung, TechSolutions</p>
    <img class="testimonial-image" src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80" alt="Sarah Weber" />
  </div>
  <div class="testimonial-item">
    <p class="testimonial-text">Der neue Webshop konvertiert deutlich besser als unser alter. Das Investment hat sich bereits nach 3 Monaten gerechnet.</p>
    <h6 class="testimonial-author">Thomas Lindner</h6>
    <p class="testimonial-role">Inhaber, Lindner Retail</p>
    <img class="testimonial-image" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80" alt="Thomas Lindner" />
  </div>
</div>
</div>

<!-- NEXT STEP SECTION -->
<div class="next-step-section">
  <img class="next-step-image" src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" alt="City Street" />
  <h2 class="section-title">NEUES PROJEKT GEPLANT?</h2>
  <p class="description">In einem kurzen Gespräch analysiert 2H Websolutions die aktuelle Situation und zeigt konkret, wie mehr Anfragen über die Website entstehen können.</p>
  <a class="button-link" href="/contact">KOSTENLOSES ERSTGESPRÄCH BUCHEN</a>
  <div class="feature-item">UNVERBINDLICH</div>
  <div class="feature-item">KLARE EINSCHÄTZUNG</div>
  <div class="feature-item">TRANSPARENT</div>
</div>
  `;

  const updateRes = await fetch(`${baseUrl}/wp-json/wp/v2/pages/${homePage.id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${authString}`
    },
    body: JSON.stringify({ content: fullHtml })
  });

  if (!updateRes.ok) {
    console.log("Failed to restore home page:", await updateRes.text());
  } else {
    console.log("Successfully restored all sections to the home page!");
  }
}

restoreHome();
