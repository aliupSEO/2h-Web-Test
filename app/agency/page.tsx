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
  extractAgencyServicesData,
  getProjects,
  extractProjectsSectionData
} from "@/lib/graphql";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AgencyHeroSection from "@/components/sections/AgencyHeroSection";
import AgencyAboutSection from "@/components/sections/AgencyAboutSection";
import AgencyServicesSection from "@/components/sections/AgencyServicesSection";
import AgencyProjectsSection from "@/components/sections/AgencyProjectsSection";

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
  const dbProjects = await getProjects();
  
  // Custom parser for the user's uploaded projects at the bottom of the Agency page
  let pageProjects: any[] = [];
  let projectsTitle = "";
  let h2Parts: string[] = [];
  let projectsPartIndex = -1;
  
  if (page?.content) {
    h2Parts = page.content.split(/(?=<h2[^>]*>)/i).filter((p: string) => p.replace(/<[^>]*>?/gm, '').trim().length > 0);
    projectsPartIndex = h2Parts.findIndex((part: string) => /<h4[^>]*>/i.test(part));
    
    if (projectsPartIndex !== -1) {
      const projectsSection = h2Parts[projectsPartIndex];
      const match = projectsSection.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
      if (match && match[1]) {
        projectsTitle = match[1].replace(/<[^>]*>?/gm, '').trim();
      }
      
      const imgRegex = /<img[^>]*src=["'](.*?)["']/gi;
      const h4Regex = /<h4[^>]*>([\s\S]*?)<\/h4>/gi;
      
      const images = [...projectsSection.matchAll(imgRegex)].map(m => m[1]);
      const titles = [...projectsSection.matchAll(h4Regex)].map(m => m[1].replace(/<[^>]*>?/gm, '').trim());
      
      for (let i = 0; i < images.length; i++) {
        let title = titles[i] || "";
        let imageUrl = images[i].replace(/-\d+x\d+(?=\.[a-z]+$)/i, '');
        pageProjects.push({ title, tags: "", link: "", imageUrl });
      }
    }
  }
  
  // Use page content if available, otherwise fallback to WP categories
  const projects = pageProjects.length > 0 ? pageProjects : dbProjects;

  // Extract About Section data from WordPress
  let aboutTitle: string | undefined = undefined;
  let aboutDesc: string | undefined = undefined;
  let aboutImage1: string | undefined = undefined;
  let aboutImage2: string | undefined = undefined;
  let aboutBtnText: string | undefined = undefined;
  let techStack: string[] = [];

  if (page?.content) {
    // Extract tech stack from the hero section part (before the first h2 after hero)
    // We assume the first h2 is the Hero title or the hero has h1.
    // Let's just find the first paragraph-like elements with short uppercase text.
    const allParagraphs = [...page.content.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)]
      .map(m => m[1].replace(/<[^>]*>?/gm, '').trim())
      .filter(t => t.length > 0);
      
    techStack = allParagraphs.filter(p => p.length > 0 && p.length < 25 && p.toUpperCase() === p).slice(0, 4);

    // To find the About section dynamically:
    // With our perfectly consistent layout, About is always block 1!
    // (Block 0 = Hero, Block 1 = About, Block 2 = Services Title)
    const aboutIndex = 1;
    const aboutContentStr = h2Parts[aboutIndex] || "";
    
    const h2Match = aboutContentStr.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
    if (h2Match) {
      aboutTitle = h2Match[1].replace(/<[^>]*>?/gm, '').trim();
    }
    
    // Extract paragraphs for description
    const aboutParagraphs = [...aboutContentStr.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)]
      .map(m => m[1].replace(/<[^>]*>?/gm, '').trim())
      .filter(t => t.length > 0);
      
    aboutDesc = aboutParagraphs.join("\n\n");
    
    // Extract images
    const imgRegex = /<img[^>]*src=["'](.*?)["']/gi;
    const aboutImages = [...aboutContentStr.matchAll(imgRegex)].map(m => m[1].replace(/-\d+x\d+(?=\.[a-z]+$)/i, ''));
    aboutImage1 = aboutImages[0];
    aboutImage2 = aboutImages[1];
    
    // Extract button if present
    const btnMatch = aboutContentStr.match(/<a[^>]*class=["'][^"']*wp-block-button__link[^"']*["'][^>]*>([\s\S]*?)<\/a>/i);
    if (btnMatch) {
      aboutBtnText = btnMatch[1].replace(/<[^>]*>?/gm, '').trim();
    } else {
      aboutBtnText = "";
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

      {/* Services Section */}
      <AgencyServicesSection services={extractAgencyServicesData(page?.content || "")} />

      {/* Projects Showcase Section */}
      <AgencyProjectsSection title={projectsTitle || "Unsere Projekte"} projects={projects} />

    </main>
  );
}
