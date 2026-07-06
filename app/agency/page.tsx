/**
 * app/agency/page.tsx
 *
 * The Agency Page layout.
 * Fetches data from WordPress and renders the custom Agency Hero section.
 */

import { Metadata } from "next";
import { 
  getAgencyPage, 
  extractAgencyHeroSectionData,
} from "@/lib/graphql";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AgencyHeroSection from "@/components/sections/AgencyHeroSection";
import AgencyAboutSection from "@/components/sections/AgencyAboutSection";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getAgencyPage();
  return {
    title: page?.seo?.title || "Agency",
    description: page?.seo?.description || "",
    keywords: page?.seo?.focusKeywords
      ? [page.seo.focusKeywords]
      : undefined,
  };
}

export default async function AgencyPage() {
  const page = await getAgencyPage();
  const heroData = page?.content ? extractAgencyHeroSectionData(page.content) : null;

  // Extract About Section data from WordPress
  let aboutTitle: string | undefined = undefined;
  let aboutDesc: string | undefined = undefined;
  let aboutImage1: string | undefined = undefined;
  let aboutImage2: string | undefined = undefined;
  let aboutBtnText: string | undefined = undefined;
  let techStack: string[] = [];

  if (page?.content) {
    const aboutSplit = page.content.split(/Über uns/i);
    
    // Extract tech stack from the hero section part (before Über uns)
    const heroContent = aboutSplit[0];
    const heroParagraphs = [...heroContent.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)]
      .map(m => m[1].replace(/<[^>]*>?/gm, '').trim())
      .filter(t => t.length > 0);
      
    // Find short uppercase words that represent the tech stack
    techStack = heroParagraphs.filter(p => p.length > 0 && p.length < 25 && p.toUpperCase() === p);

    if (aboutSplit.length > 1) {
      aboutTitle = "Über uns"; // Since we matched it
      
      // Grab everything before the next h2 to scope our search
      const aboutSectionEnd = aboutSplit[1].search(/<h[2-6]/i);
      const aboutSectionHtml = aboutSectionEnd !== -1 ? aboutSplit[1].substring(0, aboutSectionEnd) : aboutSplit[1];

      // Find images after 'Über uns'
      const aboutImages = [...aboutSectionHtml.matchAll(/<img[^>]*src=["'](.*?)["']/gi)].map(m => m[1]);
      if (aboutImages.length >= 2) {
        // remove the size suffix like -1024x532 to get full resolution
        aboutImage1 = aboutImages[0].replace(/-\d+x\d+(?=\.[a-z]+$)/i, '');
        aboutImage2 = aboutImages[1].replace(/-\d+x\d+(?=\.[a-z]+$)/i, '');
      }
      
      // Find all paragraphs in this section
      const pMatches = [...aboutSectionHtml.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)]
        .map(m => m[1].replace(/<[^>]*>?/gm, '').trim())
        .filter(text => text.length > 0);
        
      if (pMatches.length > 0) {
        aboutDesc = pMatches[0];
      }
      if (pMatches.length > 1) {
        aboutBtnText = pMatches[pMatches.length - 1]; // The last paragraph is usually the button text
      }
    }
  }

  return (
    <main className="min-h-screen text-foreground relative overflow-hidden" style={{ background: "var(--color-bg-primary, #ffffff)" }}>
      
      {/* Hero Section */}
      <AgencyHeroSection
        title={heroData?.title || page?.title}
        description={heroData?.description || page?.seo?.description}
        btnText={heroData?.btnText}
        btnLink={heroData?.btnLink}
        secondaryBtnText={heroData?.secondaryBtnText}
        secondaryBtnLink={heroData?.secondaryBtnLink}
        rightImage={page?.featuredImage?.node?.sourceUrl || heroData?.mainImage}
        logos={[]} // explicitly empty to show the text banner instead of incorrectly captured images
        floatingImages={heroData?.floatingImages}
        techStack={techStack}
      />

      {/* New About Section */}
      <AgencyAboutSection 
        title={aboutTitle}
        description={aboutDesc}
        image1={aboutImage1}
        image2={aboutImage2}
        btnText={aboutBtnText}
      />

    </main>
  );
}
