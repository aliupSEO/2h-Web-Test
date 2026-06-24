const fs = require('fs');
const html = fs.readFileSync('original_content.html', 'utf-8');

let newHtml = `
<!-- HERO SECTION -->
<h6>VON WEBSITE ÜBER SEO BIS ZUR SICHTBARKEIT IN NEUEN KI SUCHSYSTEMEN</h6>
<h2>EIN DIgITALES SYSTEM FÜR MEHR ANFRAGEN</h2>
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
<h3>Webdesign & Ecommerce</h3>
<p>Eine Website ist mehr als Design. Sie ist der zentrale Punkt, an dem sich entscheidet, ob Besucher bleiben, Vertrauen aufbauen und anfragen. 2H Websolutions entwickelt Websites und Webshops, die klar strukturiert sind, logisch führen und gezielt auf Conversion ausgerichtet sind. Design, Inhalte und Technik greifen dabei ineinander – für messbare Ergebnisse.</p>
<p><a href="/service/webdesign">Mehr erfahren</a></p>

<h3>SEO</h3>
<p>Sichtbarkeit entsteht nicht zufällig. Sie entsteht dort, wo potenzielle Kunden aktiv nach Lösungen suchen. 2H Websolutions sorgt dafür, dass Ihre Website genau dort erscheint – mit klarer Struktur, relevanten Inhalten und einer Strategie, die langfristig Anfragen bringt.</p>
<p><a href="/service/seo-beratung-wien">Mehr erfahren</a></p>

<h3>SEA</h3>
<p>Schnelle Ergebnisse brauchen klare Steuerung. Nicht mehr Budget, sondern bessere Kampagnen entscheiden über Erfolg. 2H Websolutions entwickelt und optimiert Google Ads Kampagnen so, dass gezielt die richtigen Anfragen entstehen – messbar, nachvollziehbar und ohne Streuverluste.</p>
<p><a href="/service/google-ads-agentur-wien">Mehr erfahren</a></p>

<!-- PROJECTS SECTION -->
<h6>Echte Ergebnisse aus der Praxis</h6>
<h2>Ausgewählte Projekte</h2>

<h6>Automation, SEA, Webdesign & UX</h6>
<h3>Mozarthaus Wien</h3>
<p><a href="/portfolio/mozarthaus-wien">View</a></p>
<figure><img src="https://2hwebsolutions.at/wp-content/uploads/2026/01/Screenshot-2026-01-03-222549.png" alt="Mozarthaus Wien"></figure>

<h6>SEA, SEO</h6>
<h3>Jumpin Prater</h3>
<p><a href="/portfolio/jumpin-prater">View</a></p>
<figure><img src="https://2hwebsolutions.at/wp-content/uploads/2026/01/Screenshot-2026-01-03-225038.png" alt="Jumpin Prater"></figure>

<h6>Hosting, SEO</h6>
<h3>Panamatura.de</h3>
<p><a href="/portfolio/panamatura-de">View</a></p>
<figure><img src="https://2hwebsolutions.at/wp-content/uploads/2026/01/image-2.png" alt="Panamatura.de"></figure>

<!-- TESTIMONIALS SECTION -->
<h6>KUNDENSTIMMEN</h6>
<h2>Ergebnisse, die im Alltag spürbar werden</h2>

<p>Am Anfang war ich unsicher, ob sich der Aufwand lohnt. Ist ja doch eine Investition. Im Nachhinein muss ich sagen: hätten wir früher machen sollen. Allein die Klarheit auf der Website macht schon einen Unterschied.</p>
<h6>Dr. med. Daniel Ahmed-Balestra</h6>
<p>Facharzt für Augenheilkunde und Optometrie</p>
<figure><img src="https://2hwebsolutions.at/wp-content/uploads/2026/01/Startfoto-copy-2-e1700757126353.webp" alt="Dr. med. Daniel Ahmed-Balestra"></figure>

<p>Was mir gefallen hat, war die ruhige Art der Umsetzung. Kein Druck, kein unnötiges Gerede. Einfach Schritt für Schritt aufgebaut und erklärt, warum was gemacht wird. Das gibt ein gutes Gefühl.</p>
<h6>Cornelia Lurger</h6>
<p>Director of Marketing & Business Development Playworld Group</p>
<figure><img src="https://2hwebsolutions.at/wp-content/uploads/2026/01/connie-lurger.1024x1024.jpg" alt="Cornelia Lurger"></figure>

<p>Seit der Überarbeitung unserer Website kommen deutlich mehr Termine für Sehtests rein. Vorher hatten wir zwar eine Website, aber sie hat kaum aktiv etwas beigetragen. Jetzt werden wir besser gefunden und die Terminanfragen laufen konstant rein. Für uns hat sich das auf jeden Fall gelohnt.</p>
<h6>Mag. Juliette Azem</h6>
<p>Geschäftsführung Azem Optik Kids</p>
<figure><img src="https://2hwebsolutions.at/wp-content/uploads/2026/01/1_Juliette-Azem_Azemoptik_Portraits_Finished-1-1024x1024-1-e1722599592718.jpg" alt="Mag. Juliette Azem"></figure>

<p>Seit wir an der Sichtbarkeit gearbeitet haben, werden wir deutlich öfter gefunden. Vorher kamen die meisten Buchungen über Empfehlungen, online war wenig los. Jetzt finden uns auch Leute, die gezielt nach so etwas suchen. Man merkt vor allem an den Anfragen und Buchungen, dass sich etwas getan hat. Für uns ein wichtiger Schritt, gerade in der Saison.</p>
<h6>Ralf Schmidt</h6>
<p>Betriebsleitung Jumpin warrior</p>
<figure><img src="https://2hwebsolutions.at/wp-content/uploads/2026/01/1587492065592.jpg" alt="Ralf Schmidt"></figure>

<p>Seit die Google Ads aktiv sind, kommen regelmäßig neue Buchungen über die Website rein. Vorher war das deutlich ungleichmäßiger. Jetzt erreichen wir genau die Leute, die gerade nach optischen Produkten und Dienstleistungen suchen. Die Anfragen sind konkreter und besser planbar.</p>
<h6>Mag. Daniel S. Azem MSc</h6>
<p>Geschäftsführer Azem Optik, Unternehmer</p>
<figure><img src="https://2hwebsolutions.at/wp-content/uploads/2026/01/Daniel-Azem-683x1024-1-e1722687288157.webp" alt="Mag. Daniel S. Azem MSc"></figure>

<p>Der automatisierte Google-Review-Replyer ist eine enorme Erleichterung im Alltag. Google Bewertungen werden zuverlässig und professionell beantwortet, ohne manuellen Aufwand. Wir sparen täglich Zeit und verpassen keine Rezension mehr. Das System läuft stabil im Hintergrund.</p>
<h6>Lukas Feicht</h6>
<p>Betriebsleitung Laserdance Prater</p>
<figure><img src="https://shthemes.net/demosd/dagency/wp-content/uploads/2025/05/f.jpg" alt="Lukas Feicht"></figure>

<!-- NEXT STEP SECTION -->
<h2>Neues Projekt geplant?</h2>
<p>In einem kurzen Gespräch analysiert 2H Websolutions die aktuelle Situation und zeigt konkret, wie mehr Anfragen über die Website entstehen können.</p>
<p><a href="https://2hws-termin-buchen.vercel.app/" target="_blank" rel="noopener">Kostenloses Erstgespräch buchen</a></p>
<ul>
<li>Unverbindlich</li>
<li>Klare Einschätzung</li>
<li>Transparent</li>
</ul>
<figure><img src="http://silvioh23.sg-host.com/wp-content/uploads/2026/06/photo-1449824913935-59a10b8d2000-300x200.webp" alt=""></figure>
`;

fs.writeFileSync('new_simple_content.html', newHtml);
