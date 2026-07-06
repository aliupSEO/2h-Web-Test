import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProjectContentBySlug } from "@/lib/graphql";

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

export async function generateMetadata(): Promise<Metadata> {
  const slug = "mozarthaus-wien";
  const page = await getProjectContentBySlug(slug);
  return {
    title: page?.seo?.title || page?.title || "Projekt Detail",
    description: page?.seo?.description || "",
    keywords: page?.seo?.focusKeywords ? [page.seo.focusKeywords] : undefined,
  };
}

export default async function ProjectPage() {
  const slug = "mozarthaus-wien";
  const page = await getProjectContentBySlug(slug);
  if (!page) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4" style={{ color: "var(--color-brand-primary, #22c55e)" }}>WordPress Connection Needed</h1>
          <p className="text-zinc-400">
            Set your WordPress endpoint in <code>.env.local</code> and ensure a page
            with slug <code>{slug}</code> exists in WordPress.
          </p>
        </div>
      </main>
    );
  }

  // Parse the raw content we scraped
  const rawContent = page.content || "";
  
  // Extract images directly from raw HTML
  const imageLines = Array.from(rawContent.matchAll(/<img[^>]+src=["']([^"']+)["']/g)).map((m: any) => {
    let url = m[1];
    url = url.replace(/-\d+x\d+(?=\.[a-zA-Z]+$)/, '');
    url = url.replace(/-scaled(?=\.[a-zA-Z]+$)/, '');
    return url;
  });

  // Convert block-level tags to newlines
  let textContent = rawContent
    .replace(/<\/?(?:div|p|br|li|h[1-6]|ul)[^>]*>/gi, '\n')
    .replace(/<[^>]+>/g, '');
  
  textContent = textContent.replace(/\n{3,}/g, '\n\n').trim();
  const parts = textContent.split("IMAGES FOUND:");
  let mainText = parts[0].trim();
  mainText = decodeHTMLEntities(mainText);
  
  const heroImage = page.featuredImage?.node?.sourceUrl || "";
  
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

  const allLines = mainText.split('\n').map((l: string) => l.trim()).filter((l: string) => l !== '');

  const firstLine = allLines[0] || "";
  const titleParts = firstLine.split(",");
  const heroTitleLine1 = titleParts[0] ? titleParts[0].trim() + (titleParts.length > 1 ? "," : "") : page.title;
  const heroTitleLine2 = titleParts[1] ? titleParts[1].trim() : "";

  let heroDescription = allLines[1] || "";

  // Extract Metadata Dynamically
  const infoItems: { label: string, value: string, subValue: string }[] = [];
  const metaStartIdx = allLines.findIndex((l: string) => l.includes(':') && l.length < 50);
  let bodyStartIdx = Math.min(10, allLines.length - 1);

  if (metaStartIdx !== -1) {
    for (let i = metaStartIdx; i < allLines.length; i++) {
      const l = allLines[i];
      
      // Dynamically break when we reach the end of the metadata list
      if (i > metaStartIdx && !l.includes(':') && l.length < 60 && !allLines[i - 1].includes(':')) {
        bodyStartIdx = i;
        break;
      }

      const parts = l.split(':');
      if (parts.length > 1) {
        const val = parts.slice(1).join(':').trim();
        if (!val && allLines[i + 1] && !allLines[i + 1].includes(':')) {
          infoItems.push({
            label: parts[0].trim() + ':',
            value: allLines[i + 1].trim(),
            subValue: (allLines[i + 2] && !allLines[i + 2].includes(':') && !(i + 2 > metaStartIdx && !allLines[i + 2].includes(':') && !allLines[i + 1].includes(':'))) ? allLines[i + 2].trim() : ""
          });
          i += infoItems[infoItems.length - 1].subValue ? 2 : 1;
        } else {
          infoItems.push({ label: parts[0].trim() + ':', value: val || "", subValue: "" });
        }
      }
    }
  }
  
  const bodyLines = bodyStartIdx < allLines.length ? allLines.slice(bodyStartIdx) : [];
  const paragraphs = bodyLines.length > 0 ? [bodyLines.join('\n')] : [];

  const mockupImage = heroImage || remainingImages[0] || "";
  const bgImage = mockupImage;

  // Extract Buttons dynamically from raw HTML
  let btn1 = "";
  let btn2 = "";
  const rawButtons: string[] = [];
  const linkBtnRegex = /<a[^>]*class=["'][^"']*(?:btn-primary|btn-secondary|button)[^"']*["'][^>]*>([^<]+)<\/a>/gi;
  let btnMatch;
  while ((btnMatch = linkBtnRegex.exec(rawContent)) !== null) {
    rawButtons.push(btnMatch[1].trim());
  }
  if (rawButtons.length === 0) {
    const btnRegex = /<span class="elementor-button-text">([^<]*)<\/span>/g;
    while ((btnMatch = btnRegex.exec(rawContent)) !== null) {
      rawButtons.push(btnMatch[1].trim());
    }
  }
  if (rawButtons.length >= 2) {
    btn1 = rawButtons[0];
    btn2 = rawButtons[1];
  } else if (rawButtons.length === 1) {
    btn1 = rawButtons[0];
  }

  return (
    <main className="min-h-screen" style={{ background: "var(--color-bg-primary, #0a0a0a)" }}>
      {/* 1. Centered Hero Section */}
      <section className="relative w-full min-h-[115vh] flex flex-col overflow-hidden" style={{ background: "var(--color-bg-dark, #0a0a0a)" }}>
        {bgImage && (
          <div className="absolute inset-0 z-0">
            <Image src={bgImage} alt="Background" fill className="object-cover grayscale" priority sizes="100vw" />
            <div className="absolute inset-0 z-10 bg-black/60"></div>
            <div className="absolute inset-0 z-10" style={{ background: "linear-gradient(to top, #656565 0%, transparent 70%)" }}></div>
            <div className="absolute inset-0 z-10" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, transparent 40%)" }}></div>
          </div>
        )}

        <div className="relative z-20 w-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 flex flex-col justify-center flex-grow pt-32 pb-24 h-full">
          <div className="w-full max-w-4xl flex flex-col items-start text-left animate-fade-slide-up z-30">
            <h1 className="text-[32px] md:text-[56px] lg:text-[78px] leading-[1.2] mb-6 uppercase">
              <div className="drop-shadow-lg" style={{ color: "var(--color-text-light, #ffffff)" }}>{heroTitleLine1}</div>
              {heroTitleLine2 && (
                <div className="drop-shadow-lg" style={{ color: "var(--color-brand-primary, #22c55e)" }}>{heroTitleLine2}</div>
              )}
            </h1>
            
            {heroDescription && (
              <p className="text-[16px] md:text-[18px] lg:text-[22px] max-w-2xl leading-[1.4] mb-12 drop-shadow-md" style={{ color: "var(--color-text-light, #ffffff)" }}>
                {heroDescription}
              </p>
            )}
            
            {(btn1 || btn2) && (
              <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto">
                {btn1 && (
                <Link href="/contact" 
                  className="inline-flex items-center justify-center px-6 py-3.5 md:px-8 lg:px-10 lg:py-4 rounded-full border border-[color:var(--color-brand-primary,#22c55e)] bg-black/40 backdrop-blur-sm transition-all duration-300 text-[15px] md:text-[18px] lg:text-[20px] leading-none text-center w-full sm:w-auto text-[color:var(--color-brand-primary,#22c55e)] hover:bg-[var(--color-brand-primary,#22c55e)] hover:!text-black"
                >
                  {btn1}
                </Link>
                )}
                {btn2 && (
                <Link href="/contact" 
                  className="inline-flex items-center justify-center px-6 py-3.5 md:px-8 lg:px-10 lg:py-4 rounded-full border border-white bg-black/40 backdrop-blur-sm transition-all duration-300 text-[15px] md:text-[18px] lg:text-[20px] leading-none text-center w-full sm:w-auto text-white hover:bg-white hover:!text-black"
                >
                  {btn2}
                </Link>
                )}
              </div>
            )}
          </div>
        </div>

        {infoItems.length > 0 && (
          <div className="relative z-20 w-full mt-auto backdrop-blur-lg border-y py-8" style={{ background: "rgba(0,0,0,0.4)", borderColor: "var(--color-brand-border, #1f2937)" }}>
            <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 grid grid-cols-2 md:grid-cols-4 gap-8">
              {infoItems.map((item, idx) => (
                <div key={idx} className="flex flex-col items-start gap-1">
                  <h4 className="text-[15px] md:text-[18px] leading-tight mb-2" style={{ color: "var(--color-text-light, #ffffff)" }}>{item.label}</h4>
                  <p className="text-[18px] md:text-[22px] leading-tight" style={{ color: "var(--color-brand-primary, #22c55e)" }}>{item.value}</p>
                  {item.subValue && (
                    <p className="text-[14px] md:text-[16px] leading-[1.2] mt-1 opacity-80" style={{ color: "var(--color-text-light, #ffffff)" }}>{item.subValue}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 2. Content Sections */}
      {(() => {  // Split sections using <h2> tags
  const sections: { title: string, html: string, lines: string[] }[] = [];
  const parts = rawContent.split(/<h2[^>]*>/i);
  if (parts.length > 0) {
    for (let i = 1; i < parts.length; i++) {
      const match = parts[i].match(/^(.*?)<\/h2>([\s\S]*)$/i);
      if (match) {
        const title = decodeHTMLEntities(match[1].replace(/<[^>]+>/g, '').trim());
        const html = match[2];
        const lines = html
          .replace(/<li[^>]*>/gi, '<li>- ')
          .replace(/<\/?(?:div|p|br|li|h[1-6]|ul)[^>]*>/gi, '\n')
          .replace(/<[^>]+>/g, '')
          .split('\n')
          .map((l: string) => decodeHTMLEntities(l.trim()))
          .filter((l: string) => l);
        sections.push({ title, html, lines });
      }
    }
  }

        return (
          <div style={{ background: "var(--color-bg-primary, #0a0a0a)" }}>
            {sections.map((section, idx) => {
              if (idx === 0) {
                // Determine layout modes for this section
                let alertBox = "";
                const paragraphs: string[] = [];
                const bullets: string[] = [];
                let subtitle = "";
                let mode = "paragraph";
                section.lines.forEach(line => {
                  const isAlert = line.includes(':') && !line.endsWith(':') && line.split(':')[0].length < 30;
                  if (isAlert) alertBox = line;
                  else if (line.length < 50 && line.endsWith(":")) {
                    subtitle = line;
                    mode = "bullets";
                  } else if (mode === "bullets" && !isAlert) {
                    bullets.push(line.replace(/^[-•]\s*/, ''));
                  } else {
                    paragraphs.push(line);
                  }
                });

                return (
                  <section key={idx} className="relative pt-10 md:pt-16 lg:pt-24 pb-10 md:pb-16 lg:pb-24 px-4 md:px-12 lg:px-24 w-full bg-white overflow-hidden">
                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center max-w-[1400px] mx-auto w-full">
                      
                      {/* Left Column - Text */}
                      <div className="w-full lg:w-1/2 flex flex-col items-start text-left z-10 pt-12 md:pt-16 lg:pt-0">
                        <h2 className="text-[#101010] text-[28px] md:text-[36px] lg:text-[42px] leading-tight md:leading-[46.2px] uppercase mb-6" style={{ fontFamily: "'Federo', sans-serif" }}>
                          {section.title}
                        </h2>
                        
                        {paragraphs.map((p, pIdx) => (
                          <p key={pIdx} className="text-[15px] md:text-[16px] lg:text-[18px] leading-[1.6] lg:leading-[28.8px] text-[#7A7A7A] mb-8" style={{ fontFamily: "'Barlow', sans-serif" }}>
                            {p}
                          </p>
                        ))}
                        
                        {subtitle && (
                          <div className="w-full text-left mt-4 mb-6">
                            <h3 className="text-[16px] md:text-[18px] lg:text-[20px] leading-tight lg:leading-[20px] text-[#101010] mb-6" style={{ fontFamily: "'Federo', sans-serif" }}>
                              {subtitle}
                            </h3>
                            <ul className="space-y-4">
                              {bullets.map((bullet, bIdx) => (
                                <li key={bIdx} className="flex items-start gap-4 mb-1">
                                  <div className="mt-[2px] w-[20px] h-[20px] md:w-[26px] md:h-[26px] flex items-center justify-center flex-shrink-0">
                                    <svg viewBox="0 0 24 24" style={{ fill: "var(--color-brand-primary, #22c55e)" }} className="w-[20px] h-[20px] md:w-[26px] md:h-[26px]">
                                      <path d="M12 2l2.4 2.1 3.1-.9.9 3.1 2.1 2.4-1.5 2.9 1.5 2.9-2.1 2.4-.9 3.1-3.1-.9L12 22l-2.4-2.1-3.1.9-.9-3.1-2.1-2.4 1.5-2.9-1.5-2.9 2.1-2.4.9-3.1 3.1.9L12 2z" />
                                      <path d="M9 12l2 2 4-4" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                                    </svg>
                                  </div>
                                  <span className="text-[15px] md:text-[16px] lg:text-[17px] leading-[1.6] lg:leading-[29.8px] text-[#101010]" style={{ fontFamily: "'Barlow', sans-serif" }}>
                                    {bullet}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {alertBox && (
                          <div className="w-full mt-8 p-6 rounded-2xl border" style={{ backgroundColor: "var(--color-bg-alternate, #111111)", borderColor: "var(--color-brand-border, #1f2937)" }}>
                            <p className="text-[15px] leading-relaxed font-medium" style={{ color: "var(--color-text-secondary, #a1a1aa)" }}>
                              <span className="font-bold" style={{ color: "var(--color-text-primary, #ffffff)" }}>{alertBox.includes(':') ? alertBox.split(':')[0] + ':' : ''} </span>
                              {alertBox.includes(':') ? alertBox.split(':').slice(1).join(':').trim() : alertBox}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <div className="w-full lg:w-1/2 relative h-[300px] sm:h-[350px] md:h-[350px] lg:h-[400px] flex items-center justify-center lg:justify-end mt-8 lg:mt-0 mb-4 lg:mb-0">
                        {remainingImages[0] && (
                          <div className="relative w-full lg:w-[115%] h-full lg:h-[85%] max-w-[1100px] z-10 scale-100 lg:scale-[1.35] origin-center lg:origin-right translate-x-0 lg:translate-x-[25%] transition-transform duration-500 rounded-[15px] lg:rounded-[40px] overflow-hidden">
                            <Image src={remainingImages[0]} fill className="object-cover object-center lg:object-left" alt="Ausgangslage Mockup" sizes="100vw" priority unoptimized={true} />
                          </div>
                        )}
                      </div>
                    </div>
                  </section>
                );
              }

              // Determine if this section is Grid Cards
              const subtitle = section.lines.length > 0 ? section.lines[0] : "";
              const cards: { title: string, subtitle: string, bullets: string[] }[] = [];
              let currentCard: { title: string, subtitle: string, bullets: string[] } | null = null;
              
              for (let i = 1; i < section.lines.length; i++) {
                const line = section.lines[i];
                // Allow titles to start with '-' since they are often in WordPress lists
                const isTitle = line.length < 60 && !line.endsWith('.') && !line.endsWith(':');
                const nextLine = section.lines[i+1] || "";
                
                // Subtitles are separated from titles by a line break, so they will NOT have the '-' prefix
                const isNextLineSubtitle = nextLine.length > 0 && nextLine.length < 60 && !nextLine.endsWith('.') && !nextLine.endsWith(':') && !nextLine.startsWith('-');
                
                const prevLineWasBullet = currentCard && currentCard.bullets.length > 0;
                
                if (!currentCard || (isTitle && isNextLineSubtitle && prevLineWasBullet)) {
                  if (currentCard) cards.push(currentCard);
                  // Strip the '-' prefix from the title since it was injected during HTML parsing
                  currentCard = { title: line.replace(/^[-•]\s*/, ''), subtitle: nextLine, bullets: [] };
                  if (isNextLineSubtitle) i++; // skip subtitle line
                } else if (currentCard) {
                  currentCard.bullets.push(line.replace(/^[-•]\s*/, ''));
                }
              }
              if (currentCard) cards.push(currentCard);

              // Grid Cards Section
              if (cards.length >= 3 && section.title.toLowerCase().includes("verändert")) {
                const getIcon = (cIdx: number) => {
                  switch(cIdx) {
                    case 0: return <svg className="w-7 h-7 flex-shrink-0" style={{ fill: "var(--color-brand-primary, #22c55e)" }} viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>;
                    case 1: return <svg className="w-7 h-7" style={{ color: "var(--color-brand-primary, #22c55e)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>;
                    case 2: return <svg className="w-7 h-7" style={{ color: "var(--color-brand-primary, #22c55e)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>;
                    case 3: return <svg className="w-7 h-7" style={{ color: "var(--color-brand-primary, #22c55e)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>;
                    default: return <svg className="w-7 h-7" style={{ color: "var(--color-brand-primary, #22c55e)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"></circle></svg>;
                  }
                };

                return (
                  <section key={idx} className="relative py-24 px-4 md:px-8 lg:px-8 overflow-hidden border-y" style={{ borderColor: "var(--color-brand-border, #1f2937)" }}>
                    <div className="absolute inset-0 z-0">
                      <Image src={imageLines[2] || heroImage || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"} alt="Background" fill className="object-cover grayscale" sizes="100vw" unoptimized={true} />
                      <div className="absolute inset-0 bg-black/60"></div>
                    </div>

                    <div className="relative z-10 max-w-[1420px] mx-auto">
                      <div className="text-center mb-12 md:mb-16 max-w-5xl mx-auto px-4">
                        <h2 className="text-[32px] md:text-[40px] lg:text-[46px] leading-[1.2] lg:leading-[59.8px] uppercase mb-4" style={{ fontFamily: "'Federo', sans-serif", color: "#FFFFFF" }}>
                          {section.title}
                        </h2>
                        <p className="text-[15px] md:text-[16px] lg:text-[18px] leading-[1.6] lg:leading-[28.8px] max-w-none mx-auto mb-10 md:mb-16 px-4 md:px-0" style={{ fontFamily: "'Barlow', sans-serif", color: "#FFFFFF" }}>
                          {subtitle}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
                        {cards.map((card, cIdx) => (
                          <div key={cIdx} className="group flex flex-col border rounded-2xl p-5 md:p-6 pb-8 relative overflow-hidden shadow-2xl transition-colors duration-300 h-full" style={{ background: "var(--color-bg-secondary, #000000)", borderColor: "var(--color-brand-primary, #22c55e)" }}>
                            <div className="flex items-center gap-3 md:gap-4 mb-6 relative z-10">
                              <div className="w-8 h-8 lg:w-10 lg:h-10 flex items-center justify-center flex-shrink-0" style={{ color: "var(--color-brand-primary, #22c55e)" }}>
                                {getIcon(cIdx)}
                              </div>
                              <h3 className="text-[20px] lg:text-[24px] leading-tight lg:leading-[29.8px]" style={{ fontFamily: "'Federo', sans-serif", color: "#FFFFFF" }}>{card.title}</h3>
                            </div>
                            <h4 className="text-[15px] lg:text-[18px] leading-tight lg:leading-[18px] uppercase mb-4 md:mb-6 relative z-10" style={{ fontFamily: "'Federo', sans-serif", color: "#B7EF02" }}>{card.subtitle}</h4>
                            <ul className="space-y-3 md:space-y-4 relative z-10 pb-2">
                              {card.bullets.map((bullet, bIdx) => (
                                <li key={bIdx} className="flex items-start gap-3">
                                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "var(--color-brand-primary, #22c55e)" }} viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                                  </svg>
                                  <span className="text-[14px] lg:text-[17px] leading-[1.6] lg:leading-[29.8px]" style={{ fontFamily: "'Barlow', sans-serif", color: "rgba(255, 255, 255, 0.64)" }}>{bullet}</span>
                                </li>
                              ))}
                            </ul>
                            
                            <div className="mt-auto pt-6 w-full relative z-10">
                              <div className="w-full h-px opacity-30" style={{ background: "var(--color-text-secondary, #a1a1aa)" }}></div>
                            </div>
                            
                            <div className="absolute bottom-6 left-6 right-6 h-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: "linear-gradient(to right, transparent, color-mix(in srgb, var(--color-brand-primary, #22c55e) 50%, transparent), transparent)" }}></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                );
              }

              const isTestimonial = section.title.toLowerCase().includes("fazit") || section.title.toLowerCase().includes("ergebnis") || section.lines.some(l => l.includes('"'));

              if (isTestimonial) {
                const subtitle = section.lines.length > 0 ? section.lines[0] : "";
                const bullets: string[] = [];
                let testimonialText = "";
                let testimonialCompany = "";
                let testimonialName = "";

                for (let i = 1; i < section.lines.length; i++) {
                  const line = section.lines[i];
                  if (line.includes('"') || line.includes('„') || line.includes('“') || line.includes('«') || line.startsWith('_')) {
                    testimonialText = line.replace(/^[_"„“«]+/, '').replace(/[_"„“»]+$/, '');
                    testimonialCompany = section.lines[i+1] || "";
                    testimonialName = section.lines[i+2] || "";
                    break;
                  } else {
                    bullets.push(line.replace(/^[-•]\s*/, ''));
                  }
                }

                return (
                  <section key={idx} className="py-24 px-4 md:px-12 lg:px-24 max-w-7xl mx-auto">
                    <div className="mb-8 md:mb-12">
                      <h2 className="text-[32px] md:text-[46px] leading-[1.2] md:leading-[59.8px] uppercase mb-4" style={{ fontFamily: "'Federo', sans-serif", color: "#101010" }}>
                        {section.title}
                      </h2>
                      <p className="text-[16px] md:text-[20px] leading-[1.6] md:leading-[20px] mb-8 md:mb-12 w-full" style={{ fontFamily: "'Federo', sans-serif", color: "#7A7A7A" }}>
                        {subtitle}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
                      <div className="space-y-2 lg:col-span-5 lg:pr-4">
                        {bullets.map((bullet, bIdx) => (
                          <div key={bIdx} className="flex items-start gap-3 md:gap-4">
                            <svg className="w-5 h-5 md:w-7 md:h-7 flex-shrink-0 mt-0.5 md:mt-1" style={{ color: "var(--color-brand-primary, #22c55e)" }} viewBox="0 0 24 24" fill="currentColor">
                                <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                            </svg>
                            <span className="text-[15px] md:text-[17px] leading-[1.6] md:leading-[29.8px]" style={{ fontFamily: "'Barlow', sans-serif", color: "#101010" }}>{bullet}</span>
                          </div>
                        ))}
                      </div>

                      {testimonialText && (
                        <div className="lg:col-span-7 lg:ml-12 p-6 md:p-8 lg:px-12 lg:py-8 border-l-[6px]" style={{ background: "var(--color-bg-secondary, #000000)", borderColor: "var(--color-brand-primary, #22c55e)" }}>
                          <p className="text-[16px] md:text-[20px] leading-[1.4] md:leading-[26px] mb-6 md:mb-8" style={{ fontFamily: "'Federo', sans-serif", color: "#FFFFFF" }}>
                            „{testimonialText}“
                          </p>
                          <div>
                            <p className="text-[16px] md:text-[20px] leading-tight md:leading-[20px] mb-1" style={{ fontFamily: "'Federo', sans-serif", color: "#B7EF02" }}>{testimonialCompany}</p>
                            <p className="text-[14px] md:text-[17px] leading-tight md:leading-[17px] mt-2" style={{ fontFamily: "'Barlow', sans-serif", color: "#FFFFFF" }}>{testimonialName}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </section>
                );
              }

              if (idx === sections.length - 1 || section.title.toLowerCase().includes("herausforderung")) {
                const subtitle = (section.lines[0] || "").replace(/^[-•]\s*/, '');
                const ctaBtn1 = (section.lines[1] || btn1 || "").replace(/^[-•]\s*/, '');
                const ctaBtn2 = (section.lines[2] || btn2 || "").replace(/^[-•]\s*/, '');
                const features = section.lines.slice(3).filter(l => l.trim().length > 0).map(l => l.replace(/^[-•]\s*/, ''));

                return (
                  <section key={idx} className="relative py-28 px-4 md:px-12 lg:px-24 overflow-hidden border-t" style={{ borderColor: "var(--color-brand-border, #1f2937)", background: "var(--color-bg-dark, #0a0a0a)" }}>
                    <div className="absolute inset-0 z-0">
                      <Image src={imageLines[3] || heroImage || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"} alt="Background" fill className="object-cover grayscale" sizes="100vw" unoptimized={true} />
                      <div className="absolute inset-0 bg-black/60"></div>
                    </div>

                    <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
                      <h2 className="text-[28px] md:text-[40px] lg:text-[50px] leading-tight md:leading-[65px] uppercase mb-6 max-w-4xl mx-auto" style={{ color: "var(--color-text-light, #ffffff)" }}>
                        {section.title}
                      </h2>
                      <p className="text-[15px] md:text-[18px] lg:text-[22px] leading-[1.6] md:leading-[26.4px] mb-12 max-w-3xl mx-auto px-4 md:px-0" style={{ color: "var(--color-text-light, #ffffff)" }}>
                        {subtitle}
                      </p>

                      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-12 justify-center w-full">
                        <Link href="/contact" 
                          className="inline-flex items-center justify-center w-full sm:w-auto text-center px-4 py-3.5 sm:px-6 md:px-8 lg:px-10 lg:py-4 rounded-full border border-[color:var(--color-brand-primary,#B7EF02)] bg-black/40 font-bold text-[11.5px] sm:text-[13px] tracking-wider sm:tracking-widest uppercase text-white hover:bg-[var(--color-brand-primary,#B7EF02)] hover:text-[#101010] transition-all duration-300"
                        >
                          {ctaBtn1}
                        </Link>
                        {section.lines[2] && (
                          <Link href="/contact" 
                            className="inline-flex items-center justify-center w-full sm:w-auto text-center px-4 py-3.5 sm:px-6 md:px-8 lg:px-10 lg:py-4 rounded-full border border-[color:var(--color-text-light,#ffffff)] bg-black/40 font-bold text-[11.5px] sm:text-[13px] tracking-wider sm:tracking-widest uppercase text-white hover:bg-[var(--color-text-light,#ffffff)] hover:text-[#101010] transition-all duration-300"
                          >
                            {ctaBtn2}
                          </Link>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row sm:flex-wrap items-center justify-center gap-4 md:gap-10">
                        {features.map((feature, fIdx) => (
                          <div key={fIdx} className="flex items-center gap-2">
                            <span className="text-[18px] md:text-[20px] leading-none mt-1" style={{ color: "var(--color-brand-primary, #22c55e)" }}>*</span>
                            <span className="text-[15px] md:text-[16px] lg:text-[18px] leading-[1.6] lg:leading-[29.8px]" style={{ fontFamily: "'Barlow', sans-serif", color: "#D3D3D3" }}>
                              {feature.replace(/^\*\s*/, '')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                );
              }

              return (
              <section key={idx} className="relative pt-10 pb-10 md:pb-16 lg:pb-24 px-4 md:px-12 lg:px-24 w-full bg-white overflow-hidden">
                <div className={`flex flex-col lg:flex-row gap-8 lg:gap-16 items-center max-w-[1400px] mx-auto w-full ${idx % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                  
                  <div className="w-full lg:w-1/2 flex flex-col items-start z-10">
                    <h2 className="text-[28px] md:text-[36px] lg:text-[42px] leading-tight md:leading-[46.2px] uppercase mb-4" style={{ fontFamily: "'Federo', sans-serif", color: "#101010" }}>
                      {section.title}
                    </h2>
                    
                    <div className="w-full">
                      {section.lines.map((line, j) => {
                        const isBullet = line.startsWith('- ');
                        const cleanLine = line.replace(/^[-•]\s*/, '');

                        if (cleanLine.endsWith(':')) {
                          return <h3 key={j} className="text-[16px] md:text-[18px] lg:text-[20px] leading-tight lg:leading-[20px] mb-3 mt-4" style={{ fontFamily: "'Federo', sans-serif", color: "#101010" }}>{cleanLine}</h3>;
                        }
                        
                        if (!isBullet && cleanLine.length < 40 && !cleanLine.includes('.') && !cleanLine.includes(':') && idx === 1) {
                          return <h4 key={j} className="text-[16px] md:text-[18px] lg:text-[20px] leading-tight lg:leading-[20px] mb-3 mt-4" style={{ fontFamily: "'Federo', sans-serif", color: "#101010" }}>{cleanLine}</h4>;
                        }

                        if (isBullet || (!cleanLine.endsWith('.') && !cleanLine.endsWith(':') && cleanLine.length < 120)) {
                          return (
                            <div key={j} className="flex items-start gap-3 md:gap-4 mt-1.5 mb-2">
                              <div className="mt-[2px] w-[20px] h-[20px] md:w-[26px] md:h-[26px] flex items-center justify-center flex-shrink-0">
                                <svg viewBox="0 0 24 24" style={{ fill: "var(--color-brand-primary, #22c55e)" }} className="w-[20px] h-[20px] md:w-[26px] md:h-[26px]">
                                  <path d="M12 2l2.4 2.1 3.1-.9.9 3.1 2.1 2.4-1.5 2.9 1.5 2.9-2.1 2.4-.9 3.1-3.1-.9L12 22l-2.4-2.1-3.1.9-.9-3.1-2.1-2.4 1.5-2.9-1.5-2.9 2.1-2.4.9-3.1 3.1.9L12 2z" />
                                  <path d="M9 12l2 2 4-4" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                                </svg>
                              </div>
                              <span className="text-[15px] md:text-[16px] lg:text-[17px] leading-[1.6] lg:leading-[29.8px]" style={{ fontFamily: "'Barlow', sans-serif", color: "#101010" }}>{cleanLine}</span>
                            </div>
                          );
                        }

                        return <p key={j} className="text-[15px] md:text-[16px] lg:text-[18px] leading-[1.6] lg:leading-[28.8px] mb-4" style={{ fontFamily: "'Barlow', sans-serif", color: "#7A7A7A" }}>{cleanLine}</p>;
                      })}
                    </div>
                  </div>

                  <div className={`w-full lg:w-1/2 relative flex items-center justify-center mt-8 lg:mt-0 lg:min-h-[700px] ${idx % 2 === 1 ? 'lg:justify-start' : 'lg:justify-end'}`}>
                    {remainingImages[idx] ? (
                      <div className={`relative lg:absolute lg:top-1/2 lg:left-1/2 lg:-translate-y-1/2 lg:-translate-x-1/2 w-full lg:w-[850px] max-w-full lg:max-w-[850px] h-[300px] sm:h-[400px] lg:h-[550px] rounded-[15px] lg:rounded-[30px] overflow-hidden z-10 border ${idx % 2 === 1 ? 'lg:left-auto lg:right-[-5%] lg:translate-x-0' : 'lg:left-[-5%] lg:translate-x-0'}`} style={{ borderColor: "var(--color-brand-border, #1f2937)" }}>
                        <Image src={remainingImages[idx]} alt={section.title} fill className="object-cover object-center" sizes="100vw" unoptimized={true} />
                      </div>
                    ) : (
                      remainingImages[0] && (
                        <div className={`relative lg:absolute lg:top-1/2 lg:left-1/2 lg:-translate-y-1/2 lg:-translate-x-1/2 w-full lg:w-[850px] max-w-full lg:max-w-[850px] h-[300px] sm:h-[400px] lg:h-[550px] rounded-[15px] lg:rounded-[30px] overflow-hidden z-10 border ${idx % 2 === 1 ? 'lg:left-auto lg:right-[-5%] lg:translate-x-0' : 'lg:left-[-5%] lg:translate-x-0'}`} style={{ borderColor: "var(--color-brand-border, #1f2937)" }}>
                          <Image src={remainingImages[0]} alt={section.title} fill className="object-cover object-center opacity-50 grayscale" sizes="100vw" unoptimized={true} />
                        </div>
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
