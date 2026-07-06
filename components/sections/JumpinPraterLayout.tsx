import Image from "next/image";
import Link from "next/link";

// Helper to strip HTML tags if any (except br)
function stripHtmlKeepBr(html: string) {
  return html.replace(/<(?!\/?br\s*\/?)[^>]+>/gi, '');
}

function decodeHTMLEntities(text: string) {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&auml;/g, 'ä')
    .replace(/&Auml;/g, 'Ä')
    .replace(/&ouml;/g, 'ö')
    .replace(/&Ouml;/g, 'Ö')
    .replace(/&uuml;/g, 'ü')
    .replace(/&Uuml;/g, 'Ü')
    .replace(/&szlig;/g, 'ß')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

export default function JumpinPraterLayout({ page }: { page: any }) {
  if (!page) {
    return null;
  }

  // Parse the raw content we scraped
  const rawContent = page.content || "";

  // Extract images directly from raw HTML (handles Elementor or standard WP images)
  const imageLines = Array.from(rawContent.matchAll(/<img[^>]+src=["']([^"']+)["']/g)).map((m: any) => m[1]);
  console.log('EXTRACTED IMAGES:', imageLines);

  // Convert block-level tags to newlines to preserve separation, then strip HTML
  let textContent = rawContent
    .replace(/<\/?(?:div|p|br|li|h[1-6]|ul)[^>]*>/gi, '\n')
    .replace(/<[^>]+>/g, '');

  // Clean up excessive newlines
  textContent = textContent.replace(/\n{3,}/g, '\n\n').trim();

  // If there's the old 'IMAGES FOUND:' text, just split and ignore it
  const parts = textContent.split("IMAGES FOUND:");
  let mainText = parts[0].trim();
  mainText = decodeHTMLEntities(mainText);

  // Use the featured image explicitly set in WordPress as the hero image
  const heroImage = page.featuredImage?.node?.sourceUrl || "";

  // Filter out the hero image from the remaining images
  // WordPress often adds -1024x768 or -scaled to image URLs in the content, so we need to strip those for a fair comparison
  const remainingImages = imageLines.filter(img => {
    if (!heroImage) return true;
    const getBaseName = (url: string) => {
      let name = url.split('/').pop() || '';
      name = name.replace(/-\d+x\d+(?=\.[a-zA-Z]+$)/, '');
      name = name.replace(/-scaled(?=\.[a-zA-Z]+$)/, '');
      return name;
    };
    return getBaseName(img) !== getBaseName(heroImage);
  });

  // Split main text into clean lines
  const allLines = mainText.split('\n').map((l: any) => l.trim()).filter((l: any) => l !== '');
  console.log("ALL LINES:", allLines);

  // Title logic: Use page.title, split into white and green parts
  const titleParts = (page.title || "").split(" ");
  const heroTitleLine1 = titleParts[0] || "";
  const heroTitleLine2 = titleParts.slice(1).join(" ");

  // The first line in the editor is usually the summary/description
  let heroDescription = allLines[0] || "";
  // If the description is just the title, try the next line
  if (heroDescription.toLowerCase() === page.title?.toLowerCase() && allLines.length > 1) {
    heroDescription = allLines[1];
  }

  let heroBtn1 = "";
  let heroBtn2 = "";

  // --- DYNAMIC METADATA PARSING ---
  const getCleanLines = (html: string) => html
    .replace(/<\/?(?:div|p|br|li|h[1-6]|ul|span)[^>]*>/gi, '\n')
    .replace(/<strong[^>]*>/gi, '{{STRONG}}')
    .replace(/<\/strong>/gi, '{{/STRONG}}')
    .replace(/<b[^>]*>/gi, '{{STRONG}}')
    .replace(/<\/b>/gi, '{{/STRONG}}')
    .replace(/<[^>]+>/g, '')
    .replace(/\{\{STRONG\}\}/g, '<strong>')
    .replace(/\{\{\/STRONG\}\}/g, '</strong>')
    .replace(/\n{3,}/g, '\n\n')
    .trim().split('\n')
    .map((l: any) => l.replace(/\u00A0/g, ' ').trim().replace(/&amp;/g, '&').replace(/&#038;/g, '&').replace(/&#8211;/g, '-').replace(/&#8220;/g, '„').replace(/&#8221;/g, '“'))
    .filter((l: any) => l !== '');

  const htmlParts = rawContent.split(/<h2[^>]*>/i);
  const cleanedAllLines = getCleanLines(rawContent);
  const metaLines = htmlParts.length > 0 ? getCleanLines(htmlParts[0]) : cleanedAllLines;

  const infoItems: { label: string, value: string, subValue: string }[] = [];
  for (let i = 0; i < metaLines.length; i++) {
    const l = metaLines[i];
    const subParts = l.split(':');
    if (subParts.length > 1) {
      const val = subParts.slice(1).join(':').trim();
      if (!val && metaLines[i + 1] && !metaLines[i + 1].includes(':')) {
        infoItems.push({
          label: subParts[0].trim() + ':',
          value: metaLines[i + 1].trim(),
          subValue: (metaLines[i + 2] && !metaLines[i + 2].includes(':')) ? metaLines[i + 2].trim() : ""
        });
        i += infoItems[infoItems.length - 1].subValue ? 2 : 1;
      } else {
        infoItems.push({ label: subParts[0].trim() + ':', value: val || "", subValue: "" });
      }
    }
  }

  
  let bodyLines: string[] = [];
  if (htmlParts.length > 1) {
    const altMatch = htmlParts[1].match(/^(.*?)<\/h2>([\s\S]*)$/i);
    if (altMatch) {
       bodyLines = [altMatch[2].replace(/<[^>]+>/g, '')];
    }
  } else {
    bodyLines = cleanedAllLines.slice(metaLines.length);
  }
  const paragraphs = bodyLines.length > 0 ? [bodyLines.join('\n')] : [];
  
  // The mockup image will use heroImage (the featured image)
  // If there's no featured image, we fallback to the first content image
  const mockupImage = heroImage || remainingImages[0] || "";

  // The background uses the same image but blurred and darkened
  const bgImage = mockupImage;

  return (
    <main className="min-h-screen selection:bg-[var(--color-brand-primary,#b6ef00)] selection:text-[var(--color-brand-secondary,#000000)]" style={{ background: "var(--color-bg-light, #111111)", color: "var(--color-brand-secondary)" }}>
      {/* 1. Split 2-Column Hero Section */}
      <section className="relative w-full min-h-[90vh] flex flex-col pt-32 overflow-hidden bg-[var(--color-brand-secondary,#111111)]">
        {/* Background Overlay Effect */}
        {bgImage && (
          <div className="absolute inset-0 z-0">
            <Image
              src={bgImage}
              alt="Background"
              fill
              className="object-cover opacity-10 grayscale scale-110 blur-sm"
              priority
              sizes="100vw"
            />
            {/* Dramatic angular/radial gradients to simulate the dark jagged background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-transparent via-[#111111]/80 to-[var(--color-brand-secondary,#111111)] z-10"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-brand-secondary,#111111)] via-transparent to-[var(--color-brand-secondary,#111111)] z-10"></div>

            {/* Subtle jagged polygon shape to emulate the top dark vector */}
            <div className="absolute top-0 left-0 w-full h-[40%] bg-[var(--color-brand-secondary,#0a0a0a)] z-10" style={{ clipPath: "polygon(0 0, 100% 0, 100% 30%, 85% 60%, 75% 30%, 55% 90%, 45% 40%, 30% 70%, 15% 20%, 0 50%)", opacity: 0.8 }}></div>
          </div>
        )}

        {/* Hero Content (2 Columns) */}
        <div className="relative z-20 w-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 flex flex-col lg:flex-row items-center justify-between flex-grow pb-24 gap-12 lg:gap-8">

          {/* Left Column - Text & Buttons */}
          <div className="w-full lg:w-1/2 flex flex-col items-start text-left animate-fade-slide-up z-30">
            <h1 className="text-[40px] md:text-[56px] lg:text-[64px] xl:text-[80px] font-sans uppercase font-bold leading-[1.05] tracking-wide mb-6">
              <span className="text-[var(--color-text-light,#ffffff)] drop-shadow-lg inline-block mr-4">{heroTitleLine1}</span>
              {heroTitleLine2 && (
                <span className="text-[var(--color-brand-primary,#b6ef00)] drop-shadow-lg inline-block">{heroTitleLine2}</span>
              )}
            </h1>

            {heroDescription && (
              <p className="text-gray-300 text-lg md:text-xl lg:text-[22px] max-w-2xl leading-[1.6] mb-10 font-sans font-medium drop-shadow-md">
                {heroDescription}
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full border-2 border-[var(--color-brand-primary,#b6ef00)] bg-transparent hover:bg-[var(--color-brand-primary,#b6ef00)] hover:text-[var(--color-brand-secondary,#000000)] transition-colors duration-300 text-[var(--color-brand-primary,#b6ef00)] font-bold tracking-wider uppercase text-xs md:text-sm text-center"
              >
                {heroBtn1}
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full border-2 border-white bg-transparent hover:bg-[var(--color-bg-light,#ffffff)] hover:text-[var(--color-brand-secondary,#000000)] transition-colors duration-300 text-[var(--color-text-light,#ffffff)] font-bold tracking-wider uppercase text-xs md:text-sm text-center"
              >
                {heroBtn2}
              </Link>
            </div>
          </div>

          {/* Right Column - 3D Cascading Mockups */}
          <div className="w-full lg:w-1/2 relative h-[400px] md:h-[500px] lg:h-[600px] flex items-center justify-center animate-fade-in z-20" style={{ perspective: "2000px" }}>
            {mockupImage && (
              <div
                className="relative w-full h-full max-w-[600px]"
                style={{ transformStyle: "preserve-3d", transform: "rotateY(-10deg) rotateX(5deg)" }}
              >
                {/* Back Left Image */}
                <div className="absolute left-[0%] top-[25%] w-[65%] h-[60%] rounded-2xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.6)] opacity-50 transition-all duration-700 hover:-translate-y-4 hover:-translate-x-4">
                  <Image src={mockupImage} fill className="object-cover object-top" alt="Mockup Left" sizes="(max-width: 768px) 100vw, 33vw" />
                </div>

                {/* Back Right Image */}
                <div className="absolute right-[0%] top-[10%] w-[65%] h-[60%] rounded-2xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.6)] opacity-70 transition-all duration-700 hover:-translate-y-4 hover:translate-x-4 z-10">
                  <Image src={mockupImage} fill className="object-cover object-top" alt="Mockup Right" sizes="(max-width: 768px) 100vw, 33vw" />
                </div>

                {/* Center Front Image */}
                <div className="absolute left-[15%] top-[15%] w-[70%] h-[70%] rounded-2xl overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.8)] border border-white/10 transition-all duration-700 hover:scale-105 z-20">
                  <Image src={mockupImage} fill className="object-cover object-top" alt={page.title} priority sizes="(max-width: 768px) 100vw, 50vw" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Horizontal Metadata Banner */}
        <div className="relative z-20 w-full bg-[#000000]/40 backdrop-blur-sm border-t border-white/10 py-8 mt-auto">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 grid grid-cols-2 md:grid-cols-4 gap-8">

            {infoItems.map((item, idx) => (
              <div key={idx} className="flex flex-col items-start gap-1">
                <h4 className="text-[var(--color-text-light,#ffffff)] text-xs md:text-sm mb-1 font-sans tracking-wide">{item.label}</h4>
                <p className="text-[var(--color-brand-primary,#b6ef00)] text-lg md:text-xl font-bold font-sans">{item.value}</p>
                {item.subValue && (
                  <p className="text-gray-300 text-xs md:text-sm mt-1 font-sans">{item.subValue}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Content Sections (Alternating Grid with Images) */}
      {(() => {
        // Parse the remaining body lines into logical sections
        const sections: { title: string, lines: string[] }[] = [];
        let currentSection = { title: "", lines: [] as string[] };

        for (let i = 0; i < paragraphs.length; i++) {
          const rawLines = paragraphs[i].split('\n');
          for (let j = 0; j < rawLines.length; j++) {
            const line = rawLines[j].trim();
            if (!line) continue;

            const lineLower = line.toLowerCase();
            const isMajorHeading =
              lineLower.includes("ausgangslage") ||
              lineLower.includes("zielsetzung") ||
              lineLower.includes("sich konkret verändert hat") ||
              lineLower.includes("das ergebnis") ||
              lineLower.includes("ergebnis &") ||
              lineLower.includes("fazit") ||
              lineLower.includes("herausforderung") ||
              (line.length < 30 && !line.includes('.') && !line.includes(':') && (j === 0 || rawLines[j - 1].trim() === ""));

            if (isMajorHeading) {
              if (currentSection.title || currentSection.lines.length > 0) {
                sections.push(currentSection);
              }
              currentSection = { title: line, lines: [] };
            } else {
              if (!currentSection.title && currentSection.lines.length === 0) {
                // If no heading found yet, just use a generic title or push as first line
                currentSection.title = line;
              } else {
                currentSection.lines.push(line);
              }
            }
          }
        }
        if (currentSection.title || currentSection.lines.length > 0) {
          sections.push(currentSection);
        }

        return (
          <div className="bg-[var(--color-bg-light,#ffffff)]">
            {sections.map((section, idx) => {
              if (section.title.toLowerCase().includes("ausgangslage")) {
                const paragraphs: string[] = [];
                let subtitle = "";
                const bullets: string[] = [];
                let alertBox = "";

                let mode = "paragraph";
                section.lines.forEach(line => {
                  if (line.toLowerCase().startsWith("kurz gesagt:")) {
                    alertBox = line;
                  } else if (line.toLowerCase().includes("zentrale punkte") || (line.length < 50 && line.endsWith(":"))) {
                    subtitle = line;
                    mode = "bullets";
                  } else if (mode === "bullets" && !line.toLowerCase().startsWith("kurz gesagt:")) {
                    bullets.push(line.replace(/^[-•]\s*/, ''));
                  } else {
                    paragraphs.push(line);
                  }
                });

                return (
                  <section key={idx} className="relative py-24 px-4 md:px-12 lg:px-24 max-w-[1400px] mx-auto overflow-hidden bg-[var(--color-bg-light,#ffffff)]">
                    <div className="flex flex-col lg:flex-row gap-16 lg:gap-8 items-center">

                      {/* Left Column - Text */}
                      <div className="w-full lg:w-1/2 flex flex-col items-start z-10">
                        <h2 className="text-[40px] md:text-[56px] font-serif uppercase mb-8" style={{ color: "var(--color-brand-secondary)", letterSpacing: "0.05em" }}>
                          {section.title}
                        </h2>

                        {paragraphs.map((p, pIdx) => (
                          <p key={pIdx} className="text-[17px] leading-[1.8] font-sans mb-6 text-gray-500">
                            {p}
                          </p>
                        ))}

                        {subtitle && (
                          <h3 className="text-xl font-bold font-serif mb-6 text-gray-800 mt-4">
                            {subtitle}
                          </h3>
                        )}

                        {bullets.length > 0 && (
                          <ul className="space-y-4 mb-10 w-full">
                            {bullets.map((b, bIdx) => (
                              <li key={bIdx} className="flex items-start gap-4">
                                <div className="mt-1 w-5 h-5 rounded-full bg-[var(--color-brand-primary,#b6ef00)] flex items-center justify-center flex-shrink-0">
                                  <svg className="w-3.5 h-3.5 text-[var(--color-text-light,#ffffff)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                  </svg>
                                </div>
                                <span className="text-[15px] text-gray-600 leading-snug">{b}</span>
                              </li>
                            ))}
                          </ul>
                        )}

                        {alertBox && (
                          <div className="w-full bg-[var(--color-brand-accent,#f8fdf0)] border border-[var(--color-brand-primary,#b6ef00)] rounded-xl p-6 flex items-start gap-4 shadow-sm">
                            <div className="w-8 h-8 rounded-full bg-[var(--color-brand-primary,#b6ef00)] flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-[var(--color-text-light,#ffffff)] font-bold font-serif text-lg leading-none">i</span>
                            </div>
                            <p className="text-[15px] text-gray-700 leading-relaxed font-medium">
                              <span className="font-bold text-gray-900">Kurz gesagt: </span>
                              {alertBox.substring("Kurz gesagt:".length).trim()}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Right Column - Images/Mockups */}
                      <div className="w-full lg:w-1/2 relative h-[500px] md:h-[600px] flex items-center justify-center mt-12 lg:mt-0">
                        {/* Background blob */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] md:w-[130%] md:h-[130%] bg-gradient-to-r from-[#eaf6c6] to-[#26b2b7] z-0" style={{ borderRadius: "54% 46% 40% 60% / 54% 53% 47% 46%", opacity: 0.9 }}></div>

                        {/* Mockup Cascades */}
                        {remainingImages.length > 0 && (
                          <div className="relative w-full h-full max-w-[600px] z-10 drop-shadow-2xl">
                            {/* Back Left (Dark theme) */}
                            {remainingImages[0] && (
                              <div className="absolute top-[15%] left-[5%] w-[55%] h-[65%] rounded-2xl overflow-hidden shadow-2xl transition-transform duration-500 hover:-translate-y-4">
                                <Image src={remainingImages[0]} fill className="object-cover object-top" alt="Mockup 1" sizes="50vw" />
                              </div>
                            )}

                            {/* Back Right (White theme) */}
                            {remainingImages[1] && (
                              <div className="absolute top-[5%] right-[0%] w-[55%] h-[65%] rounded-2xl overflow-hidden shadow-2xl transition-transform duration-500 hover:-translate-y-4 z-10">
                                <Image src={remainingImages[1]} fill className="object-cover object-top" alt="Mockup 2" sizes="50vw" />
                              </div>
                            )}

                            {/* Front Center (Dark/Colorful theme) */}
                            {remainingImages[2] ? (
                              <div className="absolute bottom-[5%] left-[15%] w-[60%] h-[70%] rounded-2xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.4)] z-20 transition-transform duration-500 hover:-translate-y-4 hover:scale-105">
                                <Image src={remainingImages[2]} fill className="object-cover object-top" alt="Mockup 3" sizes="50vw" />
                              </div>
                            ) : remainingImages[0] ? (
                              <div className="absolute bottom-[5%] left-[15%] w-[60%] h-[70%] rounded-2xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.4)] z-20 transition-transform duration-500 hover:-translate-y-4 hover:scale-105">
                                <Image src={remainingImages[0]} fill className="object-cover object-top" alt="Mockup 3" sizes="50vw" />
                              </div>
                            ) : null}
                          </div>
                        )}
                      </div>

                    </div>
                  </section>
                );
              }
              if (section.title.toLowerCase().includes("sich konkret verändert hat")) {
                const cards: { title: string, subtitle: string, bullets: string[] }[] = [];
                let currentCard: { title: string, subtitle: string, bullets: string[] } | null = null;
                const subtitle = section.lines.length > 0 ? section.lines[0] : "";

                for (let i = 1; i < section.lines.length; i++) {
                  const line = section.lines[i];
                  const lineLower = line.toLowerCase();
                  if (lineLower.includes("cro-webdesign") || lineLower.includes("neues ticketsystem") || lineLower.includes("google ads") || lineLower.includes("seo , automatisierung") || lineLower.includes("seo, automatisierung")) {
                    if (currentCard) cards.push(currentCard);
                    currentCard = { title: line, subtitle: section.lines[i + 1] || "", bullets: [] };
                    i++;
                  } else if (currentCard) {
                    currentCard.bullets.push(line);
                  }
                }
                if (currentCard) cards.push(currentCard);

                const getIcon = (cIdx: number) => {
                  switch (cIdx) {
                    case 0: return <svg className="w-7 h-7 text-[var(--color-brand-primary,#b6ef00)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>;
                    case 1: return <svg className="w-7 h-7 text-[var(--color-brand-primary,#b6ef00)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>;
                    case 2: return <svg className="w-7 h-7 text-[var(--color-brand-primary,#b6ef00)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>;
                    case 3: return <svg className="w-7 h-7 text-[var(--color-brand-primary,#b6ef00)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>;
                    default: return <svg className="w-7 h-7 text-[var(--color-brand-primary,#b6ef00)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"></circle></svg>;
                  }
                };

                return (
                  <section key={idx} className="relative py-24 px-4 md:px-12 lg:px-24 overflow-hidden border-y border-[var(--color-brand-secondary,#2a2a2a)]">
                    <div className="absolute inset-0 z-0">
                      <Image
                        src={imageLines[2] || heroImage || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"}
                        alt="Background"
                        fill
                        className="object-cover grayscale"
                        sizes="100vw"
                      />
                      <div className="absolute inset-0 bg-[#000000]/40"></div>
                    </div>

                    <div className="relative z-10 max-w-[1400px] mx-auto">
                      <h2 className="text-3xl md:text-5xl font-serif text-[var(--color-text-light,#ffffff)] uppercase text-center mb-4 tracking-wider">
                        WAS SICH KONKRET VERÄNDERT HAT
                      </h2>
                      <p className="text-[var(--color-text-secondary,#a1a1aa)] text-center max-w-3xl mx-auto mb-16 text-[17px]">
                        {subtitle}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {cards.map((card, cIdx) => (
                          <div key={cIdx} className="bg-[var(--color-brand-secondary,#121212)] border border-[var(--color-brand-secondary,#2a2a2a)] rounded-2xl p-8 shadow-2xl transition-colors duration-300">
                            <div className="flex items-center gap-4 mb-6">
                              {getIcon(cIdx)}
                              <h3 className="text-[var(--color-text-light,#ffffff)] font-bold text-[19px]">{card.title}</h3>
                            </div>
                            <h4 className="text-[var(--color-brand-primary,#b6ef00)] text-[13px] font-bold uppercase tracking-wide mb-6">{card.subtitle}</h4>
                            <ul className="space-y-4">
                              {card.bullets.map((bullet, bIdx) => (
                                <li key={bIdx} className="flex items-start gap-3">
                                  <svg className="w-4 h-4 text-[var(--color-brand-primary,#b6ef00)] flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                    <polyline points="9 18 15 12 9 6"></polyline>
                                  </svg>
                                  <span className="text-[#d4d4d4] text-[14.5px] leading-snug">{bullet}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                );
              }

              if (section.title.toLowerCase().includes("ergebnis")) {
                const subtitle = section.lines.length > 0 ? section.lines[0] : "";
                const bullets: string[] = [];
                let testimonialText = "";
                let testimonialCompany = "";
                let testimonialName = "";

                for (let i = 1; i < section.lines.length; i++) {
                  const line = section.lines[i];
                  if (line.startsWith("„") || line.startsWith("\"") || line.startsWith("“") || line.startsWith("«")) {
                    testimonialText = line;
                    testimonialCompany = section.lines[i + 1] || "";
                    testimonialName = section.lines[i + 2] || "";
                    break;
                  } else {
                    bullets.push(line);
                  }
                }

                const cleanTitle = section.title.replace(/&amp;/g, '&');

                return (
                  <section key={idx} className="py-24 px-4 md:px-12 lg:px-24 max-w-7xl mx-auto overflow-hidden bg-[var(--color-bg-light,#ffffff)]">
                    <div className="mb-12">
                      <h2 className="text-[40px] md:text-[52px] font-serif uppercase mb-4" style={{ color: "var(--color-brand-secondary)", letterSpacing: "0.05em" }}>
                        {cleanTitle}
                      </h2>
                      <p className="text-[17px] leading-[1.8] font-sans mb-12 max-w-3xl" style={{ color: "var(--color-brand-secondary)" }}>
                        {subtitle}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                      {/* Left: Bullets */}
                      <div className="space-y-4 lg:pr-8">
                        {bullets.map((bullet, bIdx) => (
                          <div key={bIdx} className="flex items-start gap-4 mt-3">
                            <svg className="w-5 h-5 text-[var(--color-brand-primary,#b6ef00)] flex-shrink-0 mt-1" viewBox="0 0 24 24" fill="currentColor">
                              <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                            </svg>
                            <span className="text-[14.5px] font-sans" style={{ color: "var(--color-brand-secondary)" }}>{bullet}</span>
                          </div>
                        ))}
                      </div>

                      {/* Right: Testimonial */}
                      {testimonialText && (
                        <div className="bg-[#7a7a7a] p-10 lg:p-14 border-l-[6px] border-[var(--color-brand-primary,#b6ef00)]">
                          <p className="text-[var(--color-text-light,#ffffff)] text-lg lg:text-[21px] italic font-serif leading-relaxed mb-10">
                            {testimonialText}
                          </p>
                          <div>
                            <p className="text-[var(--color-brand-primary,#b6ef00)] font-bold text-[15px] tracking-wide mb-1">{testimonialCompany}</p>
                            <p className="text-[var(--color-text-light,#ffffff)] text-[15px]">{testimonialName}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </section>
                );
              }

              if (section.title.toLowerCase().includes("herausforderung")) {
                const subtitle = section.lines[0];
                const btn1 = section.lines[1] || "";
                const btn2 = section.lines[2] || "";
                const features = section.lines.slice(3).filter(l => l.trim().length > 0);

                return (
                  <section key={idx} className="relative py-28 px-4 md:px-12 lg:px-24 overflow-hidden border-t border-[var(--color-brand-secondary,#2a2a2a)]">
                    <div className="absolute inset-0 z-0">
                      <Image
                        src={imageLines[3] || heroImage || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"}
                        alt="Background"
                        fill
                        className="object-cover grayscale"
                        sizes="100vw"
                      />
                      <div className="absolute inset-0 bg-[#000000]/40"></div>
                    </div>

                    <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
                      <h2 className="text-3xl md:text-5xl lg:text-[46px] font-serif text-[var(--color-text-light,#ffffff)] uppercase mb-6 tracking-wide leading-tight">
                        {section.title}
                      </h2>
                      <p className="text-[var(--color-text-light,#ffffff)] text-[18px] md:text-[21px] font-serif leading-relaxed mb-12 max-w-3xl mx-auto">
                        {subtitle}
                      </p>

                      <div className="flex flex-col sm:flex-row gap-6 mb-12 justify-center w-full">
                        <Link href="/contact" className="inline-block px-8 py-3.5 rounded-full border border-[var(--color-brand-primary,#b6ef00)] text-[var(--color-brand-primary,#b6ef00)] font-bold text-[13px] tracking-widest uppercase hover:bg-[var(--color-brand-primary,#b6ef00)] hover:text-[var(--color-brand-secondary,#111111)] transition-colors duration-300">
                          {btn1}
                        </Link>
                        <Link href="/contact" className="inline-block px-8 py-3.5 rounded-full border border-white text-[var(--color-text-light,#ffffff)] font-bold text-[13px] tracking-widest uppercase hover:bg-[var(--color-bg-light,#ffffff)] hover:text-[var(--color-brand-secondary,#111111)] transition-colors duration-300">
                          {btn2}
                        </Link>
                      </div>

                      <div className="flex flex-wrap justify-center gap-6 md:gap-10 text-[#d4d4d4] font-sans text-[13px] font-bold tracking-widest uppercase">
                        {features.map((feature, fIdx) => (
                          <div key={fIdx} className="flex items-center gap-2">
                            <span className="text-[var(--color-brand-primary,#b6ef00)] text-lg font-serif leading-none mt-1">*</span>
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                );
              }

              return (
                <section key={idx} className="py-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto overflow-hidden">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Text Column */}
                    <div className={`space-y-6 ${idx % 2 === 1 ? 'lg:order-2' : 'lg:order-1'}`}>
                      <h2 className="text-[40px] md:text-[52px] font-serif uppercase mb-6" style={{ color: "var(--color-brand-secondary)", letterSpacing: "0.05em" }}>
                        {section.title}
                      </h2>

                      <div className="space-y-4">
                        {section.lines.map((line, j) => {
                          // Subheadings (end in colon)
                          if (line.endsWith(':')) {
                            return <h3 key={j} className="text-[22px] font-serif mt-8 mb-4" style={{ color: "var(--color-brand-secondary)" }}>{line}</h3>;
                          }

                          // Smaller subheadings
                          if (line === "Hauptziele" || line === "Sekundärziele") {
                            return <h4 key={j} className="text-xl font-serif mt-6 mb-3" style={{ color: "var(--color-brand-secondary)" }}>{line}</h4>;
                          }

                          // List items (heuristic: no period at end, relatively short)
                          if (!line.endsWith('.') && !line.endsWith(':') && line.length < 120) {
                            return (
                              <div key={j} className="flex items-start gap-4 mt-3">
                                <svg className="w-6 h-6 text-[var(--color-brand-primary,#b6ef00)] flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="currentColor">
                                  <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                                </svg>
                                <p className="text-[17px] font-sans" style={{ color: "var(--color-brand-secondary)" }}>{line}</p>
                              </div>
                            );
                          }

                          // Regular paragraphs
                          return <p key={j} className="text-[17px] leading-[1.8] font-sans mb-5" style={{ color: "var(--color-brand-secondary)" }}>{line}</p>;
                        })}
                      </div>
                    </div>

                    {/* Image Column */}
                    <div className={`relative w-full h-[400px] md:h-[600px] rounded-2xl overflow-hidden shadow-2xl border border-black/5 ${idx % 2 === 1 ? 'lg:order-1' : 'lg:order-2'}`}>
                      {remainingImages[idx] ? (
                        <Image
                          src={remainingImages[idx]}
                          alt={section.title}
                          fill
                          className="object-contain lg:object-cover scale-105 hover:scale-100 transition-transform duration-700"
                          sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                      ) : (
                        // Fallback if there are more sections than images
                        remainingImages[0] && (
                          <Image
                            src={remainingImages[0]}
                            alt={section.title}
                            fill
                            className="object-contain lg:object-cover opacity-50 grayscale"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                          />
                        )
                      )}
                    </div>

                  </div>
                </section>
              );
            })}
          </div>
        );
      })()}



    </main>
  );
}
