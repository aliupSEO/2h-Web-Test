import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProjectContentBySlug } from "@/lib/graphql";
import Image from "next/image";
import Link from "next/link";
import { Federo, Barlow } from 'next/font/google';

const federo = Federo({ weight: '400', subsets: ['latin'] });
const barlow = Barlow({ weight: ['400', '500', '700'], subsets: ['latin'] });

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
    .replace(/&gt;/g, '>')
    .replace(/-&gt;/g, '→')
    .replace(/->/g, '→')
    .replace(/&#038;/g, '&')
    .replace(/&#8211;/g, '-')
    .replace(/&#8220;/g, '„')
    .replace(/&#8221;/g, '“');
}

export async function generateMetadata(): Promise<Metadata> {
  const slug = "panamatura";
  const page = await getProjectContentBySlug(slug);
  return {
    title: page?.seo?.title || page?.title || "",
    description: page?.seo?.description || "",
    keywords: page?.seo?.focusKeywords ? [page.seo.focusKeywords] : undefined,
  };
}

export default async function ProjectPage() {
  const slug = "panamatura";
  const page = await getProjectContentBySlug(slug);
  if (!page) {
    notFound();
  }


  // Parse raw content for images and text
  const rawContent = page.content || "";
  const imageLines = Array.from(rawContent.matchAll(/<img[^>]+src=["']([^"']+)["']/g)).map((m: any) => m[1]);

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
    .map((l: any) => decodeHTMLEntities(l.replace(/\u00A0/g, ' ').trim()))
    .filter((l: any) => l !== '');
  const sections: { title: string, html: string }[] = [];
  const parts = rawContent.split(/<h2[^>]*>/i);
  if (parts.length > 0) {
    for (let i = 1; i < parts.length; i++) {
      const altMatch = parts[i].match(/^(.*?)<\/h2>([\s\S]*)$/i);
      if (altMatch) {
        sections.push({
          title: altMatch[1].replace(/<[^>]+>/g, '').trim(),
          html: altMatch[2]
        });
      }
    }
  }

  const allLines = getCleanLines(rawContent);
  const metaLines = parts.length > 0 ? getCleanLines(parts[0]) : allLines;

  const uberblickLines = sections.slice(0, 5).flatMap(s => getCleanLines(s.html));

  const ausgangslageLines = sections[5] ? getCleanLines(sections[5].html) : [];
  if (sections[6]) ausgangslageLines.push(...getCleanLines(sections[6].title), ...getCleanLines(sections[6].html));
  if (sections[7]) ausgangslageLines.push(...getCleanLines(sections[7].title), ...getCleanLines(sections[7].html));

  const zielsetzungLines = sections[8] ? getCleanLines(sections[8].html) : [];
  if (sections[9]) zielsetzungLines.push(...getCleanLines(sections[9].title), ...getCleanLines(sections[9].html));
  if (sections[10]) zielsetzungLines.push(...getCleanLines(sections[10].title), ...getCleanLines(sections[10].html));

  const loesungLines = sections[11] ? getCleanLines(sections[11].html) : [];
  if (sections[12]) loesungLines.push(...getCleanLines(sections[12].title), ...getCleanLines(sections[12].html));
  if (sections[13]) loesungLines.push(...getCleanLines(sections[13].title), ...getCleanLines(sections[13].html));
  if (sections[14]) loesungLines.push(...getCleanLines(sections[14].title), ...getCleanLines(sections[14].html));
  if (sections[15]) loesungLines.push(...getCleanLines(sections[15].title), ...getCleanLines(sections[15].html));

  const ergebnisLines = sections[16] ? getCleanLines(sections[16].html) : [];
  const warumLines = sections[17] ? getCleanLines(sections[17].html) : [];
  const ctaLines = sections[17] ? getCleanLines(sections[17].html) : [];

  // Images logic
  const heroImage = page.featuredImage?.node?.sourceUrl || "";
  const bgImage = heroImage || imageLines[0] || "";
  const getFullSizeUrl = (url: string) => url.replace(/-\d+x\d+(?=\.[a-zA-Z]+$)/, '');
  const remainingImages = imageLines.map(getFullSizeUrl);
  const mockups = remainingImages.length >= 3 ? remainingImages : imageLines.filter((img: any) => img !== bgImage);
  const ctaBgImage = remainingImages[remainingImages.length - 1] || heroImage || "/placeholder.webp";

  // Title & Hero
  const cleanTitle = (page.title || "").replace(/\.[a-z]{2,3}$/i, '');
  const heroDescription = metaLines.find((l: string) => l.length > 30) || metaLines[0] || "";
  // Dynamically extract buttons from raw HTML to support custom text
  let heroBtn1 = "";
  let heroBtn2 = "";
  const rawButtons: string[] = [];
  
  // Try to find standard link buttons first (e.g. <a class="btn-primary">Text</a>)
  const linkBtnRegex = /<a[^>]*class=["'][^"']*(?:btn-primary|btn-secondary|button)[^"']*["'][^>]*>([^<]+)<\/a>/gi;
  let btnMatch;
  while ((btnMatch = linkBtnRegex.exec(rawContent)) !== null) {
    rawButtons.push(btnMatch[1].trim());
  }

  // Fallback to Elementor buttons
  if (rawButtons.length === 0) {
    const btnRegex = /<span class="elementor-button-text">([^<]*)<\/span>/g;
    while ((btnMatch = btnRegex.exec(rawContent)) !== null) {
      rawButtons.push(btnMatch[1].trim());
    }
  }

  if (rawButtons.length >= 2) {
    heroBtn1 = rawButtons[0] || heroBtn1;
    heroBtn2 = rawButtons[1] || heroBtn2;
  } else if (rawButtons.length === 1) {
    heroBtn1 = rawButtons[0] || heroBtn1;
  }

  const infoItems: { label: string, value: string, subValue: string }[] = [];
  for (let i = 0; i < metaLines.length; i++) {
    const l = metaLines[i];
    const parts = l.split(':');
    if (parts.length > 1) {
      const val = parts.slice(1).join(':').trim();
      if (!val && metaLines[i + 1] && !metaLines[i + 1].includes(':')) {
        infoItems.push({
          label: parts[0].trim() + ':',
          value: metaLines[i + 1].trim(),
          subValue: (metaLines[i + 2] && !metaLines[i + 2].includes(':')) ? metaLines[i + 2].trim() : ""
        });
        i += infoItems[infoItems.length - 1].subValue ? 2 : 1;
      } else {
        infoItems.push({ label: parts[0].trim() + ':', value: val || "", subValue: "" });
      }
    }
  }

  const boldPhrases = (text: string) => {
    if (!text) return text;
    const parts = text.split(/(<strong>|<\/strong>)/i);
    let isBold = false;
    return parts.map((part, i) => {
      if (/^<strong>$/i.test(part)) { isBold = true; return null; }
      if (/^<\/strong>$/i.test(part)) { isBold = false; return null; }
      if (!part) return null;
      return isBold ? <strong key={i} className="font-bold text-[#727272]">{part}</strong> : part;
    });
  };

  const ueberblickItems = [
    { title: sections[1]?.title || "", text: getCleanLines(sections[1]?.html || "")[0] || "", iconPath: "M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" },
    { title: sections[2]?.title || "", text: getCleanLines(sections[2]?.html || "")[0] || "", iconPath: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm0-7c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" },
    { title: sections[3]?.title || "", text: getCleanLines(sections[3]?.html || "")[0] || "", iconPath: "M13.13 2.13l1.89 1.89c.14-.15.3-.29.47-.42l-2.36-2.36c-.44.47-.94.88-1.46 1.25l1.46 1.46c.14-.15.29-.3.47-.42-.16-.48-.31-.95-.47-1.4zm6.39 3.29c.14.3.26.6.36.91l2.36-2.36c-.36-.52-.77-1.02-1.25-1.46l-1.47 1.47c.3.1.59.22.88.36-.29.35-.61.69-.97 1.01l1.01 1.01c.29-.29.58-.61.85-.94h-.77zM2.51 14.5c.34-.14.67-.28 1.01-.41l-1.48-1.48c-.5.48-1.01 1-1.46 1.55l2.36 2.36c-.14-.31-.28-.63-.43-.95l-1.01-1.01h1.01zm5.12-2.12c-.17-.18-.35-.34-.54-.51L5.61 13.3c.3.14.6.28.91.43l1.47-1.47c-.12-.29-.24-.59-.36-.88zM20.9 9.1c-.26-.81-.59-1.58-1-2.29l-3.32 3.32c-1.4-1.4-1.4-3.66 0-5.06-1.57.19-3.03.88-4.14 1.99-3.21 3.21-3.12 8.35.25 11.71l-5.69 5.69 1.41 1.41 5.69-5.69c3.36 3.36 8.5 3.46 11.71.25 1.11-1.11 1.81-2.57 1.99-4.14-1.4.14-3.66-.14-5.06-1.54l3.32-3.32c-.71-.4-1.48-.74-2.29-1zM11.64 16.64c-1.95-1.95-2.07-5.02-.37-7.11 1.08 2.5 3 4.41 5.51 5.48-2.09 1.69-5.16 1.57-7.1-.37z" },
    { title: sections[4]?.title || "", text: getCleanLines(sections[4]?.html || "")[0] || "", iconPath: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" }
  ].filter(i => i.title && i.text);

  const ausgangslageDetails = {
    title: sections[5]?.title || "",
    description: ausgangslageLines[0] || "",
    subtitle: ausgangslageLines.find(l => l.endsWith(":")),
    bullets: (() => {
      const idx = ausgangslageLines.findIndex(l => l.endsWith(':'));
      if (idx !== -1) {
        const bs = [];
        for (let i = idx + 1; i < ausgangslageLines.length; i++) {
          if (ausgangslageLines[i].includes(':')) break;
          bs.push(ausgangslageLines[i]);
        }
        return bs;
      }
      return [];
    })(),
    summary: (() => {
      const idx = ausgangslageLines.findIndex(l => l.includes(':') && !l.endsWith(':'));
      if (idx !== -1) {
        const parts = ausgangslageLines[idx].split(':');
        return {
          bold: parts[0] + ':',
          text: parts.slice(1).join(':').trim()
        };
      }
      const firstColonIdx = ausgangslageLines.findIndex(l => l.endsWith(':'));
      if (firstColonIdx !== -1) {
        const secondColonIdx = ausgangslageLines.findIndex((l, i) => i > firstColonIdx && l.endsWith(':'));
        if (secondColonIdx !== -1 && secondColonIdx + 1 < ausgangslageLines.length) {
          return {
            bold: ausgangslageLines[secondColonIdx],
            text: " " + ausgangslageLines[secondColonIdx + 1]
          };
        }
      }
      return null;
    })()
  };

  const zielsetzungDetails = {
    title: sections[8]?.title || "",
    description: zielsetzungLines[0] || "",
    hauptzieleTitle: sections[9]?.title || "",
    hauptziele: getCleanLines(sections[9]?.html || ""),
    sekundaerzieleTitle: sections[10]?.title || "",
    sekundaerziele: getCleanLines(sections[10]?.html || "")
  };

  const getLIcon = (idx: number) => {
    if (idx === 0) return <svg className="w-7 h-7 text-[#b6ef00]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" /></svg>;
    if (idx === 1) return <svg className="w-7 h-7 text-[#b6ef00]" fill="currentColor" viewBox="0 0 24 24"><path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7zm-4 6h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" /></svg>;
    if (idx === 2) return <svg className="w-7 h-7 text-[#b6ef00]" fill="currentColor" viewBox="0 0 24 24"><path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" /></svg>;
    return <svg className="w-7 h-7 text-[#b6ef00]" fill="currentColor" viewBox="0 0 24 24"><path d="M11 21h-1l1-7H7.5c-.58 0-.57-.32-.38-.66.19-.34.05-.08.16-.28L11.5 2h1l-1 7h3.5c.49 0 .56.33.47.51l-.07.15C12.96 14.55 11 21 11 21z" /></svg>;
  };

  const parsedCards: any[] = [];
  [12, 13, 14, 15].forEach((sIdx, idx) => {
    const sec = sections[sIdx];
    if (!sec || !sec.title) return;
    const cl = getCleanLines(sec.html);
    const card = { 
      title: sec.title, 
      subtitle: cl[0] || "", 
      desc: "", 
      bullets: [] as string[], 
      result: "", 
      icon: getLIcon(idx) 
    };
    for (let i = 1; i < cl.length; i++) {
      const l = cl[i];
      if (l.includes(':') && !l.endsWith(':')) {
        card.result = l;
      } else if (l.endsWith(":")) {
        card.desc = l;
      } else {
        card.bullets.push(l);
      }
    }
    parsedCards.push(card);
  });

  const loesungDetails = {
    title: sections[11]?.title || "",
    cards: parsedCards
  };

  const ergebnisDetails = {
    title: (sections[16]?.title || "").replace(/&amp;/gi, '&'),
    subtitle: ergebnisLines[0] || "",
    bullets: (() => {
      const bs = [];
      for (let i = 1; i < ergebnisLines.length; i++) {
        if (ergebnisLines[i].startsWith("„") || ergebnisLines[i].startsWith("\"") || ergebnisLines[i].startsWith("“")) break;
        bs.push(ergebnisLines[i]);
      }
      return bs;
    })(),
    testimonial: (() => {
      const tIdx = ergebnisLines.findIndex(l => l.startsWith("„") || l.startsWith("\"") || l.startsWith("“"));
      if (tIdx !== -1) {
        const parts = (ergebnisLines[tIdx + 1] || "").split(",");
        return {
          quote: ergebnisLines[tIdx],
          name: parts[0] ? parts[0].trim() : "",
          role: parts[1] ? parts[1].trim() : ""
        };
      }
      return null;
    })()
  };

  const parsedBesonderheit: any[] = [];
  for (let i = 0; i < warumLines.length; i++) {
    const l = warumLines[i];
    if (l.endsWith("?")) {
      // We hit the CTA question, stop parsing grid items!
      break;
    } else if (l.includes(":") && !l.endsWith(":")) {
      const parts = l.split(":");
      parsedBesonderheit.push({ title: parts[0].trim(), text: parts.slice(1).join(":").trim() });
    } else if (l.endsWith(":")) {
      parsedBesonderheit.push({ title: l.replace(":", "").trim(), text: warumLines[i + 1] || "" });
      i++;
    } else if (l.length > 0) {
      parsedBesonderheit.push({ title: l, text: "" });
    }
  }

  const besonderheitDetails = {
    title: sections[17]?.title || "",
    items: parsedBesonderheit
  };

  const ctaTitleIndex = ctaLines.findIndex((l: string) => l.includes("?"));
  let ctaFeatures = ctaLines.filter((l: string) => l === l.toUpperCase() && l.length < 20 && !l.includes("?"));
  if (ctaFeatures.length === 0) {
    ctaFeatures = ["UNVERBINDLICH", "KLARE ROADMAP", "TRANSPARENT"];
  }

  const ctaDetails = {
    title: ctaTitleIndex !== -1 ? ctaLines[ctaTitleIndex] : "STEHST DU VOR EINER ÄHNLICHEN HERAUSFORDERUNG?",
    description: ctaTitleIndex !== -1 && ctaLines[ctaTitleIndex + 1] ? ctaLines[ctaTitleIndex + 1] : "Wenn deine Website nicht verkauft, du Geld in Ads investierst, aber wenig zurückbekommst, und deine Kosten pro Verkauf unnötig hoch sind, lohnt sich ein Gespräch.",
    button1: heroBtn1 || "ÄHNLICHES PROJEKT BESPRECHEN",
    button2: heroBtn2 || "KOSTENLOSE EINSCHÄTZUNG ERHALTEN",
    features: ctaFeatures
  };

  return (
    <main className={`project-page-theme min-h-screen selection:bg-[#b6ef00] selection:text-[#101010] ${barlow.className}`} style={{ background: "var(--color-bg-light, #111111)", color: "var(--color-text-dark, #ffffff)" }}>

      <style dangerouslySetInnerHTML={{
        __html: `
        .project-page-theme {
           --local-brand: var(--color-brand-primary, #b6ef00);
           --local-font-primary: var(--font-family-primary, ${federo.style.fontFamily});
           --local-font-secondary: var(--font-family-secondary, ${barlow.style.fontFamily});
        }
        
        /* Font Family Mappings */
        .project-page-theme .${federo.className} { font-family: var(--local-font-primary) !important; }
        .project-page-theme .${barlow.className} { font-family: var(--local-font-secondary) !important; }

        /* Selection */
        .project-page-theme.selection\\:bg-[\\#b6ef00] *::selection { background-color: var(--local-brand) !important; }
        
        /* Brand Colors */
        .project-page-theme .text-[\\#b6ef00],
        .project-page-theme .text-[\\#b7ef02],
        .project-page-theme .text-[\\#B7EF02] { color: var(--local-brand) !important; }
        .project-page-theme .bg-[\\#b6ef00] { background-color: var(--local-brand) !important; }
        .project-page-theme .border-[\\#b6ef00] { border-color: var(--local-brand) !important; }
        .project-page-theme .fill-[\\#b6ef00] { fill: var(--local-brand) !important; }
        
        /* Dark Backgrounds (Mapped to Plugin's Secondary Color) */
        .project-page-theme .bg-[\\#111111] { background-color: var(--color-brand-secondary, #111111) !important; }
        .project-page-theme .bg-[\\#0a0a0a] { background-color: var(--color-brand-secondary, #0a0a0a) !important; }
        .project-page-theme .bg-black { background-color: var(--color-brand-secondary, #000000) !important; }
        
        /* Light/Alternate Backgrounds (Mapped to Plugin's Accent Color) */
        .project-page-theme .bg-white { background-color: var(--color-brand-accent, #ffffff) !important; }
        .project-page-theme .bg-[\\#FBFFEF] { background-color: var(--color-brand-accent, #FBFFEF) !important; }
        .project-page-theme .bg-[\\#f8fdf0] { background-color: var(--color-brand-accent, #f8fdf0) !important; }
        .project-page-theme .bg-[\\#fbfbf9] { background-color: var(--color-brand-accent, #fbfbf9) !important; }
        
        /* Dark Text (Mapped to Plugin's Secondary Color) */
        .project-page-theme .text-[\\#101010] { color: var(--color-brand-secondary, #101010) !important; }
        .project-page-theme .text-[\\#212121] { color: var(--color-brand-secondary, #212121) !important; }
        
        /* Muted Text */
        .project-page-theme .text-[\\#7A7A7A],
        .project-page-theme .text-[\\#727272],
        .project-page-theme .text-[\\#9C9C9C] { color: var(--color-text-secondary, #7A7A7A) !important; }
        
        /* Light Text (Mapped to Plugin's Accent Color) */
        .project-page-theme .text-[\\#FFFFFF], .project-page-theme .text-white { color: var(--color-brand-accent, #ffffff) !important; }
        .project-page-theme .text-[\\#ffffffa3] { color: var(--color-brand-accent, rgba(255,255,255,0.64)) !important; }
      `}} />

      {/* 1. HERO SECTION matching the user's screenshot exactly */}
      <section className="relative w-full min-h-[115vh] flex flex-col overflow-hidden bg-[#111111]">

        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          {bgImage && (
            <>
              <Image src={bgImage} alt="Hero Background" fill className="object-cover grayscale" priority sizes="100vw" />
              <div className="absolute inset-0 bg-black/90 z-10"></div>
            </>
          )}
        </div>

        <div className="relative z-20 w-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 flex flex-col lg:flex-row items-center justify-between flex-grow pb-16 lg:pb-24 gap-12 lg:gap-8 pt-24 lg:pt-32 h-full">

          {/* Left Text Column */}
          <div className="w-full lg:w-[40%] flex flex-col items-start text-left animate-fade-slide-up z-30 mt-10 lg:mt-0">
            <h1 className={`${federo.className} text-4xl sm:text-5xl md:text-6xl lg:text-[72px] text-[#b7ef02] mb-6 block animate-fade-slide-up leading-[1.2] uppercase`}>
              {cleanTitle}
            </h1>

            {heroDescription && (
              <p className={`${federo.className} text-white text-[16px] sm:text-[18px] md:text-[22px] max-w-xl leading-[1.4] mb-12 drop-shadow-md tracking-normal`}>
                {heroDescription}
              </p>
            )}

            <div className="flex flex-col gap-4 w-full sm:w-auto items-start">
              <Link
                href="/contact"
                className={`inline-flex items-center justify-center px-6 py-3 md:px-10 md:py-4 rounded-full border border-[#b6ef00] bg-black/50 backdrop-blur-sm hover:!bg-[#b6ef00] hover:!text-[#101010] transition-colors duration-300 text-[#b6ef00] text-[14px] md:text-[20px] leading-none text-center uppercase tracking-normal ${federo.className}`}
              >
                {heroBtn1}
              </Link>
              <Link
                href="/contact"
                className={`inline-flex items-center justify-center px-6 py-3 md:px-10 md:py-4 rounded-full border border-white bg-black/50 backdrop-blur-sm hover:!bg-white hover:!text-[#101010] transition-colors duration-300 text-white text-[14px] md:text-[20px] leading-none text-center uppercase tracking-normal ${federo.className}`}
              >
                {heroBtn2}
              </Link>
            </div>
          </div>

          {/* Right Column - Single Image */}
          <div className="w-full lg:w-[60%] relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[450px] flex items-center justify-end animate-fade-in z-20 mt-12 lg:mt-0 lg:scale-100 lg:translate-x-0 xl:scale-125 xl:translate-x-16">
            <div className="relative w-full h-full max-w-[1200px] drop-shadow-2xl">
              <Image
                src={mockups[0] || heroImage || "/placeholder.webp"}
                fill
                className="object-contain object-right"
                alt="Hero Presentation"
                sizes="(max-width: 1024px) 100vw, 70vw"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* INFO BAR */}
      <div className="w-full border-y border-white/10 bg-[#0a0a0a] py-8 lg:py-12 px-6 md:px-12 lg:px-24 relative z-30 shadow-xl">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">

          {infoItems.map((item, idx) => (
            <div key={idx} className="flex flex-col items-start gap-1">
              <span className={`${federo.className} text-white text-[18px]`}>{item.label}</span>
              <span
                className={`${federo.className} text-[#b7ef02] text-[22px] leading-tight font-semibold`}
                style={{ WebkitTextStroke: '0.7px #b7ef02' }}
              >
                {item.value}
              </span>
              {item.subValue && (
                <span className="text-white/75 text-[16px] mt-1">{item.subValue}</span>
              )}
            </div>
          ))}

        </div>
      </div>

      {/* 3. PROJEKTÜBERBLICK SECTION */}
      <section className="w-full py-12 md:py-16 lg:py-24 bg-[#FBFFEF]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16">
          <h2
            className={`${federo.className} text-center text-[28px] md:text-[36px] lg:text-[46px] text-[#101010] leading-tight md:leading-[1.3] mb-12 md:mb-16 uppercase font-medium`}
            style={{ WebkitTextStroke: '0.4px #101010' }}
          >
            {sections[0]?.title || ""}
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {ueberblickItems.map((item, idx) => (
              <div key={idx} className="bg-[#fafafa] hover:bg-[#f8fdf0] transition-all duration-300 hover:-translate-y-2 hover:border-[#b6ef00] hover:shadow-xl rounded-xl p-5 md:py-6 md:px-8 lg:py-8 lg:px-12 border border-[#b6ef00]/50 shadow-lg shadow-black/5 flex flex-col sm:flex-row lg:flex-col xl:flex-row items-start gap-6 lg:gap-8">
                <div className="w-[64px] h-[64px] md:w-[84px] md:h-[84px] rounded-[20px] bg-gradient-to-b from-[#444444] to-[#111111] flex items-center justify-center shadow-inner flex-shrink-0">
                  <svg className="w-7 h-7 md:w-10 md:h-10 text-[#b7ef02]" fill="currentColor" viewBox="0 0 24 24">
                    <path d={item.iconPath}></path>
                  </svg>
                </div>
                <div className="flex flex-col gap-4">
                  <h3
                    className={`${federo.className} text-[18px] md:text-[22px] text-[#101010] leading-[1.45] uppercase font-semibold`}
                    style={{ WebkitTextStroke: '0.7px #101010' }}
                  >{item.title}</h3>
                  <p className="text-[#727272] text-[15px] md:text-[17px] leading-[1.5] md:leading-[1.75]">
                    {boldPhrases(item.text)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. AUSGANGSLAGE DETAILED SECTION */}
      <section className="w-full py-12 md:py-16 lg:py-24 bg-white relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 flex flex-col lg:flex-row items-center gap-16">

          {/* Left Text Column */}
          <div className="w-full lg:w-[65%] flex flex-col items-start relative z-10 order-2 lg:order-1">
            <h2 className={`${federo.className} text-[26px] md:text-[34px] lg:text-[42px] leading-tight md:leading-[46.2px] text-[#101010] uppercase mb-4`}>
              {ausgangslageDetails.title}
            </h2>
            <p className="text-[#7A7A7A] text-[16px] md:text-[18px] leading-[1.5] md:leading-[28.8px] max-w-[650px] mb-4">
              {ausgangslageDetails.description}
            </p>

            <h3 className={`${barlow.className} text-[#101010] text-[15px] md:text-[17px] leading-[1.5] md:leading-[29.8px] mb-3 mt-2 font-medium`}>
              {ausgangslageDetails.subtitle}
            </h3>

            <ul className="space-y-1.5 mb-8 w-full">
              {ausgangslageDetails.bullets.map((bullet: any, idx: any) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="mt-1.5 w-6 h-6 flex items-center justify-center flex-shrink-0">
                    <svg viewBox="0 0 24 24" fill="#b6ef00" className="w-6 h-6">
                      <path d="M12 2l2.4 2.1 3.1-.9.9 3.1 2.1 2.4-1.5 2.9 1.5 2.9-2.1 2.4-.9 3.1-3.1-.9L12 22l-2.4-2.1-3.1.9-.9-3.1-2.1-2.4 1.5-2.9-1.5-2.9 2.1-2.4.9-3.1 3.1.9L12 2z" />
                      <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </svg>
                  </div>
                  <span className={`${barlow.className} text-[#101010] text-[15px] md:text-[17px] leading-[1.5] md:leading-[29.8px] max-w-full break-words`}>{bullet}</span>
                </li>
              ))}
            </ul>

            {ausgangslageDetails.summary && (
              <div className="w-full bg-[#f8fdf0] border border-[#b6ef00] rounded-xl p-4 md:p-6 flex items-start gap-3 md:gap-4 shadow-sm">
                <div className="w-6 h-6 rounded-full bg-[#b6ef00] flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold text-sm italic leading-none pt-[2px]">i</span>
                </div>
                <p className={`${barlow.className} text-[15px] md:text-[17px] leading-[1.5] md:leading-[29.8px] text-[#101010]`}>
                  <span className="font-bold text-[#212121]">{ausgangslageDetails.summary.bold}</span>
                  {ausgangslageDetails.summary.text}
                </p>
              </div>
            )}
          </div>

          {/* Right Image Column */}
          <div className="w-full lg:w-[55%] relative h-[300px] sm:h-[400px] md:h-[600px] lg:h-[800px] flex items-center justify-center mt-8 lg:mt-0 order-1 lg:order-2 mb-4 lg:mb-0">
            {/* Mockup images */}
            <div className="relative w-full h-full max-w-[1000px] z-10 drop-shadow-2xl scale-100 lg:scale-[1.7] origin-center lg:origin-right translate-x-0 lg:translate-x-[350px] transition-transform duration-500">
              <Image
                src={mockups[1] || mockups[0] || heroImage || "/placeholder.webp"}
                fill
                className="object-contain object-center lg:object-right"
                alt="Ausgangslage Details"
              />
            </div>
          </div>

        </div>
      </section>

      {/* 5. ZIELSETZUNG DETAILED SECTION */}
      <section className="w-full py-12 md:py-16 lg:py-24 bg-[#fbfbf9] relative overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 lg:px-16 flex flex-col-reverse lg:flex-row items-center gap-8 lg:gap-0">

          {/* Left Image Column */}
          <div className="w-full lg:w-[50%] relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[750px] flex items-center justify-center mb-4 lg:mb-0">
            {/* Mockup images */}
            <div className="relative z-10 w-full h-full max-w-[800px] drop-shadow-2xl scale-100 lg:scale-[1.35] origin-center lg:origin-left -translate-x-0 lg:-translate-x-[300px] transition-transform duration-500">
              <Image
                src={mockups[2] || mockups[1] || heroImage || "/placeholder.webp"}
                fill
                className="object-contain object-center lg:object-left"
                alt="Zielsetzung Details"
              />
            </div>
          </div>

          {/* Right Text Column */}
          <div className="w-full lg:w-[50%] flex flex-col items-start relative z-10">
            <h2 className={`${federo.className} text-[32px] md:text-[42px] leading-tight md:leading-[46.2px] text-[#101010] uppercase mb-4`}>
              {zielsetzungDetails.title}
            </h2>
            <p className={`${barlow.className} text-[18px] leading-[28.8px] text-[#7A7A7A] mb-8 max-w-[650px]`}>
              {zielsetzungDetails.description}
            </p>

            {/* Hauptziele */}
            <h3 className={`${federo.className} text-[20px] leading-[20px] text-[#101010] mb-4`}>
              {zielsetzungDetails.hauptzieleTitle}
            </h3>
            <ul className="space-y-1.5 mb-8 w-full">
              {zielsetzungDetails.hauptziele.map((bullet: any, idx: any) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="mt-1.5 w-6 h-6 flex items-center justify-center flex-shrink-0">
                    <svg viewBox="0 0 24 24" fill="#b6ef00" className="w-6 h-6">
                      <path d="M12 2l2.4 2.1 3.1-.9.9 3.1 2.1 2.4-1.5 2.9 1.5 2.9-2.1 2.4-.9 3.1-3.1-.9L12 22l-2.4-2.1-3.1.9-.9-3.1-2.1-2.4 1.5-2.9-1.5-2.9 2.1-2.4.9-3.1 3.1.9L12 2z" />
                      <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </svg>
                  </div>
                  <span className={`${barlow.className} text-[#101010] text-[17px] leading-[29.8px] max-w-full break-words`}>{bullet}</span>
                </li>
              ))}
            </ul>

            {/* Sekundärziele */}
            <h3 className={`${federo.className} text-[20px] leading-[20px] text-[#101010] mb-4`}>
              {zielsetzungDetails.sekundaerzieleTitle}
            </h3>
            <ul className="space-y-1.5 w-full">
              {zielsetzungDetails.sekundaerziele.map((bullet: any, idx: any) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="mt-1.5 w-6 h-6 flex items-center justify-center flex-shrink-0">
                    <svg viewBox="0 0 24 24" fill="#b6ef00" className="w-6 h-6">
                      <path d="M12 2l2.4 2.1 3.1-.9.9 3.1 2.1 2.4-1.5 2.9 1.5 2.9-2.1 2.4-.9 3.1-3.1-.9L12 22l-2.4-2.1-3.1.9-.9-3.1-2.1-2.4 1.5-2.9-1.5-2.9 2.1-2.4.9-3.1 3.1.9L12 2z" />
                      <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </svg>
                  </div>
                  <span className={`${barlow.className} text-[#101010] text-[17px] leading-[29.8px] max-w-full break-words`}>{bullet}</span>
                </li>
              ))}
            </ul>

          </div>

        </div>
      </section>

      {/* 6. UNSERE LÖSUNG SECTION */}
      <section className="w-full py-12 md:py-16 lg:py-24 relative overflow-hidden bg-black">
        {/* Background Image Overlay */}
        <div
          className="absolute inset-0 z-0 bg-center bg-cover bg-no-repeat grayscale"
          style={{ backgroundImage: `url("http://silvioh23.sg-host.com/wp-content/uploads/2026/07/what-we-do.webp")` }}
        />
        <div className="absolute inset-0 z-0 bg-[#111111]/70" />

        <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 relative z-10">
          <h2 className={`${federo.className} text-[32px] md:text-[42px] leading-tight md:leading-[46.2px] text-[#FFFFFF] text-center uppercase mb-12 drop-shadow-lg`}>
            {loesungDetails.title}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 xl:gap-6">
            {loesungDetails.cards.map((card: any, idx: any) => (
              <div key={idx} className="bg-[#111111] rounded-2xl p-4 sm:p-5 lg:p-6 xl:p-7 border border-[#b6ef00]/30 flex flex-col shadow-2xl shadow-black">
                {/* Header: Icon + Title */}
                <div className="flex items-center gap-3 mb-3">
                  {card.icon}
                  <h3 className={`${federo.className} text-[24px] leading-[29.8px] text-[#FFFFFF]`} style={{ WebkitTextStroke: '0.8px currentColor' }}>{card.title}</h3>
                </div>

                {/* Subtitle */}
                <h4 className={`${federo.className} text-[18px] leading-[25px] text-[#b6ef00] uppercase mb-3`} style={{ WebkitTextStroke: '0.8px currentColor' }}>
                  {card.subtitle}
                </h4>

                {/* Description (if exists) */}
                {card.desc && (
                  <p className={`${barlow.className} text-[17px] leading-[29.8px] text-[#ffffffa3] mb-3`}>
                    {card.desc}
                  </p>
                )}

                {/* Bullets */}
                <ul className="flex flex-col gap-2 mb-5 flex-grow">
                  {card.bullets.map((bullet: any, bIdx: any) => (
                    <li key={bIdx} className="flex items-start gap-2">
                      <span className="text-[#b6ef00] font-bold text-[24px] mt-0.5 leading-none">›</span>
                      <span className={`${barlow.className} text-[17px] leading-[29.8px] text-[#ffffffa3]`}>{bullet}</span>
                    </li>
                  ))}
                </ul>

                {/* Separator & Result */}
                <div className="w-full h-px bg-white/10 mb-4" />
                <p className={`${federo.className} text-[18px] leading-[18px] text-[#FFFFFF]`}>
                  {card.result}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. ERGEBNIS & WIRKUNG SECTION */}
      <section className="w-full py-12 md:py-16 lg:py-24 bg-white relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 flex flex-col gap-6 md:gap-8">

          {/* Header */}
          <div className="w-full max-w-3xl">
            <h2 className={`${federo.className} text-[36px] md:text-[46px] leading-tight md:leading-[59.8px] text-[#101010] uppercase mb-2`}>
              {ergebnisDetails.title}
            </h2>
            <p className={`${federo.className} text-[20px] leading-[20px] text-[#7A7A7A]`}>
              {ergebnisDetails.subtitle}
            </p>
          </div>

          <div className="flex flex-col lg:flex-row items-start gap-10 lg:gap-16">

            {/* Left Column: Bullets */}
            <div className="w-full lg:w-[55%]">
              <ul className="flex flex-col gap-2.5">
                {ergebnisDetails.bullets.map((bullet: any, idx: any) => (
                  <li key={idx} className="flex items-start gap-3">
                    <svg className="w-7 h-7 text-[#B7EF02] flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="currentColor">
                      <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                    </svg>
                    <span className={`${barlow.className} text-[17px] leading-[29.8px] text-[#101010]`}>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Column: Testimonial Box */}
            <div className="w-full lg:w-[45%]">
              {ergebnisDetails.testimonial && (
                <div className="bg-[#111111] border-l-[6px] border-[#b6ef00] py-6 px-8 md:py-10 md:px-12 shadow-2xl">
                  <p className={`${federo.className} text-[20px] leading-[26px] text-[#FFFFFF] italic mb-5`}>
                    {ergebnisDetails.testimonial.quote}
                  </p>
                  <div className="flex flex-col">
                    <span className={`${federo.className} text-[20px] leading-[20px] text-[#B7EF02]`}>{ergebnisDetails.testimonial.name}</span>
                    <span className={`${barlow.className} text-[17px] leading-[17px] text-[#FFFFFF] mt-1`}>{ergebnisDetails.testimonial.role}</span>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* 8. WARUM DIESES PROJEKT BESONDERS IST SECTION */}
      <section className="w-full pt-16 md:pt-20 pb-16 md:pb-20 bg-[#111111]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 xl:px-16">

          <h2 className={`${federo.className} text-[36px] md:text-[46px] leading-tight md:leading-[59.8px] text-[#FFFFFF] uppercase mb-8 md:mb-12 text-left`}>
            {besonderheitDetails.title}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8">
            {besonderheitDetails.items.map((item: any, idx: any) => (
              <div key={idx} className="flex flex-col gap-2">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#b6ef00] flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <h3 className={`${federo.className} text-[20px] leading-[29.8px] text-[#FFFFFF]`} style={{ fontWeight: 600 }}>
                    {item.title}
                  </h3>
                </div>
                <p className={`${barlow.className} text-[18px] leading-[28px] text-[#9C9C9C] pl-8`}>
                  {item.text}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 9. CTA SECTION */}
      <section className="w-full py-12 md:py-16 lg:py-24 relative overflow-hidden bg-black flex items-center justify-center">
        {/* Background Image Overlay */}
        <div
          className="absolute inset-0 z-0 opacity-50 bg-center bg-cover bg-no-repeat grayscale"
          style={{ backgroundImage: `url(${ctaBgImage})` }}
        />
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#111111]/80 via-[#111111]/50 to-[#111111]/80" />

        <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-12 text-center flex flex-col items-center">

          <h2 className={`${federo.className} text-[32px] md:text-[40px] lg:text-[50px] leading-tight lg:leading-[65px] text-[#FFFFFF] uppercase mb-6`}>
            {ctaDetails.title}
          </h2>

          <p className={`${federo.className} text-[22px] leading-[26.4px] text-[#FFFFFF] mb-12 max-w-3xl`}>
            {ctaDetails.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 mb-12 w-full justify-center">
            <Link
              href="/contact"
              className={`${federo.className} px-4 py-3.5 sm:px-6 md:px-10 md:py-3.5 bg-[#111111]/60 border border-[#b6ef00] rounded-full text-[#b6ef00] text-[11.5px] sm:text-[13px] md:text-[15px] lg:text-[18px] leading-[1.2] md:leading-[20px] tracking-wider sm:tracking-widest uppercase hover:!bg-[#b6ef00] hover:!text-[#101010] transition-colors duration-300 text-center flex items-center justify-center w-full sm:w-auto`}
            >
              {ctaDetails.button1}
            </Link>
            <Link
              href="/contact"
              className={`${federo.className} px-4 py-3.5 sm:px-6 md:px-10 md:py-3.5 bg-[#111111]/60 border border-white rounded-full text-white text-[11.5px] sm:text-[13px] md:text-[15px] lg:text-[18px] leading-[1.2] md:leading-[20px] tracking-wider sm:tracking-widest uppercase hover:!bg-white hover:!text-[#101010] transition-colors duration-300 text-center flex items-center justify-center w-full sm:w-auto`}
            >
              {ctaDetails.button2}
            </Link>
          </div>

          <div className={`flex flex-col sm:flex-row sm:flex-wrap items-center justify-center gap-4 md:gap-12 ${federo.className} text-[16px] md:text-[22px] leading-tight md:leading-[26.4px] text-[#FFFFFF] uppercase`}>
            {ctaDetails.features.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-[#b6ef00] text-[24px] md:text-[32px] leading-none mt-1 md:mt-2">*</span>
                <span>{feature}</span>
              </div>
            ))}
          </div>

        </div>
      </section>

    </main>
  );
}
