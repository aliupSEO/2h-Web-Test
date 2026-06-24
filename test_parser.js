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

function decodeHtmlEntities(str) {
  return str
    .replace(/&#8217;/g, "\u2019")
    .replace(/&#8216;/g, "\u2018")
    .replace(/&#8220;/g, "\u201C")
    .replace(/&#8221;/g, "\u201D")
    .replace(/&#8211;/g, "\u2013")
    .replace(/&#8212;/g, "\u2014")
    .replace(/&#038;/g,  "&")
    .replace(/&amp;/g,   "&")
    .replace(/&lt;/g,    "<")
    .replace(/&gt;/g,    ">")
    .replace(/&quot;/g,  '"')
    .replace(/&nbsp;/gi, " ");
}

function extractHeroSectionData(html) {
  const sectionHtml = html.split('<!-- ABOUT SECTION -->')[0] || html;
  const subtitleMatch = sectionHtml.match(/<h6[^>]*>([\s\S]*?)<\/h6>/i) || sectionHtml.match(/<div class="hero-subtitle">([\s\S]*?)<\/div>/i);
  const titleMatch = sectionHtml.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || sectionHtml.match(/<div class="hero-title">([\s\S]*?)<\/div>/i);
  const btnMatch = sectionHtml.match(/<a[^>]*href=["'](.*?)["'][^>]*>([\s\S]*?)<\/a>/i);

  if (!titleMatch && !subtitleMatch) return null;

  return {
    subtitle: decodeHtmlEntities(subtitleMatch?.[1] || ""),
    title: decodeHtmlEntities(titleMatch?.[1] || ""),
    btnLink: btnMatch?.[1] || "",
    btnText: decodeHtmlEntities(btnMatch?.[2]?.replace(/<[^>]*>?/gm, '').trim() || ""),
  };
}

function extractAboutSectionData(html) {
  let sectionHtml = html;
  if (html.includes('<!-- ABOUT SECTION -->')) {
    sectionHtml = html.split('<!-- ABOUT SECTION -->')[1].split('<!--')[0];
  } else if (html.includes('about-section')) {
    sectionHtml = html.split('<div class="about-section">')[1] || html;
  } else {
    return null;
  }

  const subtitleMatch = sectionHtml.match(/<h6[^>]*>([\s\S]*?)<\/h6>/i) || sectionHtml.match(/<div class="section-subtitle">(.*?)<\/div>/i);
  const titleMatch = sectionHtml.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i) || sectionHtml.match(/<div class="section-title">([\s\S]*?)<\/div>/i);
  
  const titleText = titleMatch?.[1] || "";
  let titleLine1 = titleText;
  let titleLine2 = "";
  if (titleText.toLowerCase().includes('<br')) {
      const parts = titleText.split(/<br\s*\/?>/i);
      titleLine1 = parts[0].replace(/<\/?span>/g, '').trim();
      titleLine2 = parts[1].trim();
  } else {
      const parts = titleText.split('<br');
      titleLine1 = parts[0].replace(/<\/?span>/g, '').trim();
  }

  let description = "";
  const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
  let pMatch;
  while ((pMatch = pRegex.exec(sectionHtml)) !== null) {
    if (!pMatch[1].includes('<a')) {
      description = pMatch[1];
      break;
    }
  }
  if (!description) {
      description = sectionHtml.match(/<p class="description">(.*?)<\/p>/i)?.[1] || "";
  }

  const mottoMatch = sectionHtml.match(/<h5[^>]*>([\s\S]*?)<\/h5>/i);
  
  const links = [...sectionHtml.matchAll(/<a[^>]*href=["'](.*?)["'][^>]*>([\s\S]*?)<\/a>/gi)];
  let btnLink = "", btnText = "", phoneLink = "", phoneText = "";
  for (const match of links) {
      if (match[1].startsWith('tel:')) {
          phoneLink = match[1];
          phoneText = match[2].replace(/<[^>]*>?/gm, '').trim();
      } else if (!btnLink) {
          btnLink = match[1];
          btnText = match[2].replace(/<[^>]*>?/gm, '').trim();
      }
  }

  const imgMatch = sectionHtml.match(/<img[^>]*src=["'](.*?)["']/i);

  return {
    subtitle: decodeHtmlEntities(subtitleMatch?.[1] || ""),
    titleLine1: decodeHtmlEntities(titleLine1),
    titleLine2: decodeHtmlEntities(titleLine2),
    description: decodeHtmlEntities(description),
    motto: decodeHtmlEntities(mottoMatch?.[1] || ""),
    btnText: decodeHtmlEntities(btnText),
    btnLink: btnLink,
    phoneText: decodeHtmlEntities(phoneText),
    phoneLink: phoneLink,
    imageUrl: imgMatch?.[1] || "",
  };
}

function extractServicesSectionData(html) {
  let sectionHtml = html;
  if (html.includes('<!-- SERVICES SECTION -->')) {
    sectionHtml = html.split('<!-- SERVICES SECTION -->')[1].split('<!--')[0];
  } else if (html.includes('services-section')) {
    sectionHtml = html.split('<div class="services-section">')[1] || html;
  } else {
    return null;
  }

  const subtitleMatch = sectionHtml.match(/<h6[^>]*>([\s\S]*?)<\/h6>/i) || sectionHtml.match(/<div class="section-subtitle">(.*?)<\/div>/i);
  const titleMatch = sectionHtml.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i) || sectionHtml.match(/<div class="section-title">(.*?)<\/div>/i);

  const services = [];
  const h3Matches = [...sectionHtml.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>/gi)];
  
  if (h3Matches.length > 0) {
      for (let i = 0; i < h3Matches.length; i++) {
          const startIndex = h3Matches[i].index + h3Matches[i][0].length;
          const endIndex = i + 1 < h3Matches.length ? h3Matches[i+1].index : sectionHtml.length;
          const block = sectionHtml.substring(startIndex, endIndex);
          
          let desc = "";
          const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
          let pMatch;
          while ((pMatch = pRegex.exec(block)) !== null) {
            if (!pMatch[1].includes('<a')) {
              desc = pMatch[1];
              break;
            }
          }
          
          const aMatch = block.match(/<a[^>]*href=["'](.*?)["'][^>]*>([\s\S]*?)<\/a>/i);
          
          services.push({
              title: decodeHtmlEntities(h3Matches[i][1]),
              description: decodeHtmlEntities(desc),
              link: aMatch ? aMatch[1] : ""
          });
      }
  } else {
      const itemRegex = /<div class="service-item">[\s\S]*?<h5 class="service-title">(.*?)<\/h5>[\s\S]*?<p class="service-desc">(.*?)<\/p>[\s\S]*?<a class="service-link" href="(.*?)">/g;
      let match;
      while ((match = itemRegex.exec(sectionHtml)) !== null) {
        services.push({
          title: decodeHtmlEntities(match[1]),
          description: decodeHtmlEntities(match[2]),
          link: match[3]
        });
      }
  }

  return {
    subtitle: decodeHtmlEntities(subtitleMatch?.[1] || ""),
    title: decodeHtmlEntities(titleMatch?.[1] || ""),
    services
  };
}

function extractProjectsSectionData(html) {
  let sectionHtml = html;
  if (html.includes('<!-- PROJECTS SECTION -->')) {
    sectionHtml = html.split('<!-- PROJECTS SECTION -->')[1].split('<!--')[0];
  } else if (html.includes('projects-section')) {
    sectionHtml = html.split('<div class="projects-section">')[1] || html;
  } else {
    return null;
  }

  const titleMatch = sectionHtml.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i) || sectionHtml.match(/<div class="section-title">(.*?)<\/div>/i);
  let beforeH2 = sectionHtml;
  if (titleMatch) {
      beforeH2 = sectionHtml.substring(0, titleMatch.index);
  }
  const subtitleMatch = beforeH2.match(/<h6[^>]*>([\s\S]*?)<\/h6>/i) || beforeH2.match(/<div class="section-subtitle">(.*?)<\/div>/i);

  const projects = [];
  const h3Matches = [...sectionHtml.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>/gi)];
  
  if (h3Matches.length > 0) {
      for (let i = 0; i < h3Matches.length; i++) {
          const title = h3Matches[i][1];
          const prevIndex = i > 0 ? (h3Matches[i-1].index + h3Matches[i-1][0].length) : (titleMatch ? titleMatch.index + titleMatch[0].length : 0);
          const blockBefore = sectionHtml.substring(prevIndex, h3Matches[i].index);
          const tagsMatches = [...blockBefore.matchAll(/<h6[^>]*>([\s\S]*?)<\/h6>/gi)];
          const tags = tagsMatches.length > 0 ? tagsMatches[tagsMatches.length - 1][1] : "";
          
          const startIndex = h3Matches[i].index + h3Matches[i][0].length;
          const endIndex = i + 1 < h3Matches.length ? h3Matches[i+1].index : sectionHtml.length;
          const blockAfter = sectionHtml.substring(startIndex, endIndex);
          
          const aMatch = blockAfter.match(/<a[^>]*href=["'](.*?)["']/i);
          const imgMatch = blockAfter.match(/<img[^>]*src=["'](.*?)["']/i);
          
          projects.push({
              title: decodeHtmlEntities(title),
              tags: decodeHtmlEntities(tags),
              link: aMatch ? aMatch[1] : "",
              imageUrl: imgMatch ? imgMatch[1] : ""
          });
      }
  } else {
      const itemRegex = /<div class="project-item">[\s\S]*?<h6 class="project-tags">(.*?)<\/h6>[\s\S]*?<h3 class="project-title">(.*?)<\/h3>[\s\S]*?<a class="project-link" href="(.*?)">[\s\S]*?<img[^>]*class="project-image"[^>]*src="(.*?)"/g;
      let match;
      while ((match = itemRegex.exec(sectionHtml)) !== null) {
        projects.push({
          tags: decodeHtmlEntities(match[1]),
          title: decodeHtmlEntities(match[2]),
          link: match[3],
          imageUrl: match[4]
        });
      }
  }

  return {
    subtitle: decodeHtmlEntities(subtitleMatch?.[1] || ""),
    title: decodeHtmlEntities(titleMatch?.[1] || ""),
    projects
  };
}

function extractTestimonialsSectionData(html) {
  let sectionHtml = html;
  if (html.includes('<!-- TESTIMONIALS SECTION -->')) {
    sectionHtml = html.split('<!-- TESTIMONIALS SECTION -->')[1].split('<!--')[0];
  } else if (html.includes('testimonials-section')) {
    sectionHtml = html.split('<div class="testimonials-section">')[1] || html;
  } else {
    return null;
  }

  const titleMatch = sectionHtml.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i) || sectionHtml.match(/<div class="section-title">(.*?)<\/div>/i);
  let beforeH2 = sectionHtml;
  if (titleMatch) {
      beforeH2 = sectionHtml.substring(0, titleMatch.index);
  }
  const subtitleMatch = beforeH2.match(/<h6[^>]*>([\s\S]*?)<\/h6>/i) || beforeH2.match(/<div class="section-subtitle">(.*?)<\/div>/i);

  const testimonials = [];
  const h6Matches = [...sectionHtml.matchAll(/<h6[^>]*>([\s\S]*?)<\/h6>/gi)]; 
  
  if (h6Matches.length > 0 && html.includes('<!-- TESTIMONIALS SECTION -->')) {
      for (let i = 0; i < h6Matches.length; i++) {
          const author = h6Matches[i][1];
          const prevIndex = i > 0 ? h6Matches[i-1].index + h6Matches[i-1][0].length : (titleMatch ? titleMatch.index + titleMatch[0].length : 0);
          const blockBefore = sectionHtml.substring(prevIndex, h6Matches[i].index);
          const pMatches = [...blockBefore.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)];
          let text = "";
          for (let j = pMatches.length - 1; j >= 0; j--) {
             if (!pMatches[j][1].includes('<img') && !pMatches[j][1].includes('<a')) {
                 text = pMatches[j][1];
                 break;
             }
          }
          
          const startIndex = h6Matches[i].index + h6Matches[i][0].length;
          const endIndex = i + 1 < h6Matches.length ? h6Matches[i+1].index : sectionHtml.length;
          const blockAfter = sectionHtml.substring(startIndex, endIndex);
          
          const roleMatch = blockAfter.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
          const imgMatch = blockAfter.match(/<img[^>]*src=["'](.*?)["']/i);
          
          testimonials.push({
              author: decodeHtmlEntities(author),
              text: decodeHtmlEntities(text),
              role: decodeHtmlEntities(roleMatch ? roleMatch[1] : ""),
              imageUrl: imgMatch ? imgMatch[1] : ""
          });
      }
  } else {
      const itemRegex = /<div class="testimonial-item">[\s\S]*?<p class="testimonial-text">(.*?)<\/p>[\s\S]*?<h6 class="testimonial-author">(.*?)<\/h6>[\s\S]*?<p class="testimonial-role">(.*?)<\/p>[\s\S]*?<img[^>]*class="testimonial-image"[^>]*src="(.*?)"/g;
      let match;
      while ((match = itemRegex.exec(sectionHtml)) !== null) {
        testimonials.push({
          text: decodeHtmlEntities(match[1]),
          author: decodeHtmlEntities(match[2]),
          role: decodeHtmlEntities(match[3]),
          imageUrl: match[4]
        });
      }
  }

  return {
    subtitle: decodeHtmlEntities(subtitleMatch?.[1] || ""),
    title: decodeHtmlEntities(titleMatch?.[1] || ""),
    testimonials
  };
}

function extractNextStepSectionData(html) {
  let sectionHtml = html;
  if (html.includes('<!-- NEXT STEP SECTION -->')) {
    sectionHtml = html.split('<!-- NEXT STEP SECTION -->')[1].split('<!--')[0];
  } else if (html.includes('next-step-section')) {
    sectionHtml = html.split('<div class="next-step-section">')[1] || html;
  } else {
    return null;
  }

  const titleMatch = sectionHtml.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
  let beforeH2 = sectionHtml;
  if (titleMatch) {
      beforeH2 = sectionHtml.substring(0, titleMatch.index);
  }
  const subtitleMatch = beforeH2.match(/<h6[^>]*>([\s\S]*?)<\/h6>/i) || beforeH2.match(/<div class="section-subtitle">(.*?)<\/div>/i);
  
  const afterH2 = titleMatch ? sectionHtml.substring(titleMatch.index + titleMatch[0].length) : sectionHtml;

  let description = "";
  const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
  let pMatch;
  while ((pMatch = pRegex.exec(afterH2)) !== null) {
    if (!pMatch[1].includes('<a')) {
      description = pMatch[1];
      break;
    }
  }
  if (!description) {
      description = afterH2.match(/<p class="description">([\s\S]*?)<\/p>/i)?.[1] || "";
  }

  const btnMatch = afterH2.match(/<a[^>]*href=["'](.*?)["'][^>]*>([\s\S]*?)<\/a>/i);
  const imgMatch = sectionHtml.match(/<img[^>]*src=["'](.*?)["']/i);

  const features = [];
  if (sectionHtml.includes('<li')) {
      const listRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
      let match;
      while ((match = listRegex.exec(afterH2)) !== null) {
        features.push(decodeHtmlEntities(match[1].replace(/<[^>]*>?/gm, '').trim()));
      }
  } else {
      const itemRegex = /<div class="feature-item">(.*?)<\/div>/g;
      let match;
      while ((match = itemRegex.exec(sectionHtml)) !== null) {
        const rawText = match[1].replace(/<[^>]*>?/gm, '').trim();
        const decoded = decodeHtmlEntities(rawText).trim();
        if (decoded && decoded !== '') {
          features.push(decoded);
        }
      }
  }

  return {
    subtitle: decodeHtmlEntities(subtitleMatch?.[1] || "Nächster Schritt"),
    title: decodeHtmlEntities(titleMatch?.[1] || ""),
    description: decodeHtmlEntities(description),
    btnLink: btnMatch?.[1] || "",
    btnText: decodeHtmlEntities(btnMatch?.[2]?.replace(/<[^>]*>?/gm, '') || ""),
    features,
    imageUrl: imgMatch?.[1] || "",
  };
}

console.log("Hero:", JSON.stringify(extractHeroSectionData(html), null, 2));
console.log("About:", JSON.stringify(extractAboutSectionData(html), null, 2));
console.log("Services:", JSON.stringify(extractServicesSectionData(html), null, 2));
console.log("Projects:", JSON.stringify(extractProjectsSectionData(html), null, 2));
console.log("Testimonials:", JSON.stringify(extractTestimonialsSectionData(html), null, 2));
console.log("Next Step:", JSON.stringify(extractNextStepSectionData(html), null, 2));
