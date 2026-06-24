const html = `
<!-- HERO SECTION -->
<h6>VON WEBSITE ÜBER SEO BIS ZUR SICHTBARKEIT IN NEUEN KI SUCHSYSTEMEN</h6>
<h1>EIN DIgITALES SYSTEM FÜR MEHR ANFRAGEN</h1>
<p><a href="#services">DIGITALE LÖSUNGEN</a></p>

<!-- ABOUT SECTION -->
<h6>Die Realität</h6>
<h2>Sieht gut Aus<br>reicht nicht</h2>
<p>Viele Websites sehen gut aus - bringen aber keine Anfragen. Was danach kommt, entscheidet: Wird Ihre Website gefunden? Verstehen Besucher sofort, worum es geht? Melden sie sich?</p>
<h5>2H Websolutions kümmert sich genau darum - Alles aus einer Hand</h5>
<p><a href="/wir">Mehr über mich</a></p>
<p><a href="tel:+436764508579">+43 676 4508579</a></p>
<figure><img src="https://silvioh23.sg-host.com/wp-content/uploads/2026/06/WhatsApp-Image-2026-01-07-at-21_converted.webp" alt="About Image"></figure>

<!-- SERVICES SECTION -->
<h6>Damit aus Besuchern Anfragen werden</h6>
<h2>Websites weitergedacht</h2>
<h3>Webdesign &amp; UX</h3>
<p>Die Website ist oft der erste Eindruck. Sie muss nicht nur gut aussehen, sondern Besucher führen und Vertrauen aufbauen. Ein klares Design, das auf allen Geräten funktioniert und gezielt zur Kontaktaufnahme animiert.</p>
<p><a href="/service/webdesign">Mehr erfahren</a></p>
<h3>SEO</h3>
<p>Sichtbarkeit ist kein Zufall. Mit gezielter Suchmaschinenoptimierung wird die Website genau dann gefunden, wenn jemand nach Ihren Leistungen sucht.</p>
<p><a href="/service/seo-beratung-wien">Mehr erfahren</a></p>
<h3>SEA</h3>
<p>Schnelle Ergebnisse brauchen klare Steuerung.</p>
<p><a href="/service/google-ads-agentur-wien">Mehr erfahren</a></p>

<!-- PROJECTS SECTION -->
<h6>Echte Ergebnisse aus der Praxis</h6>
<h2>Ausgewählte Projekte</h2>
<h6>Automation, SEA, Webdesign &amp; UX</h6>
<h3>Mozarthaus Wien</h3>
<p><a href="/portfolio/mozarthaus-wien">View</a></p>
<figure><img src="https://2hwebsolutions.at/wp-content/uploads/2026/01/Screenshot-2026-01-03-222549.png" alt="Mozarthaus Wien"></figure>
<h6>SEA, SEO</h6>
<h3>Jumpin Prater</h3>
<p><a href="/portfolio/jumpin-prater">View</a></p>
<figure><img src="https://2hwebsolutions.at/wp-content/uploads/2026/01/Screenshot-2026-01-03-225038.png" alt="Jumpin Prater"></figure>

<!-- TESTIMONIALS SECTION -->
<h6>KUNDENSTIMMEN</h6>
<h2>Ergebnisse, die im Alltag spürbar werden</h2>
<p>Am Anfang war ich unsicher, ob sich der Aufwand lohnt. Ist ja doch eine Investition. Im Nachhinein muss ich sagen: hätten wir früher machen sollen. Allein die Klarheit auf der Website macht schon einen Unterschied.</p>
<h6>Dr. med. Daniel Ahmed-Balestra</h6>
<p>Facharzt für Augenheilkunde und Optometrie</p>
<figure><img src="https://2hwebsolutions.at/wp-content/uploads/2026/01/Startfoto-copy-2-e1700757126353.webp" alt="Dr. med. Daniel Ahmed-Balestra"></figure>
<p>Was mir gefallen hat, war die ruhige Art der Umsetzung.</p>
<h6>Cornelia Lurger</h6>
<p>Director of Marketing</p>
<figure><img src="https://2hwebsolutions.at/wp-content/uploads/2026/01/connie-lurger.1024x1024.jpg" alt="Cornelia Lurger"></figure>

<!-- NEXT STEP SECTION -->
<h2>Neues Projekt geplant?</h2>
<p>In einem kurzen Gespräch analysiert 2H Websolutions die aktuelle Situation.</p>
<p><a href="https://2hws-termin-buchen.vercel.app/">Kostenloses Erstgespräch buchen</a></p>
<ul>
<li>Unverbindlich</li>
<li>Klare Einschätzung</li>
<li>Transparent</li>
</ul>
<figure><img src="http://silvioh23.sg-host.com/wp-content/uploads/2026/06/photo-1449824913935-59a10b8d2000-300x200.webp" alt=""></figure>
`;

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
      console.log("Page updated successfully.");
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
