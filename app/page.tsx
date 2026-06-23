/**
 * app/page.tsx — Home Page
 *
 * Fetches content from WordPress and renders the page layout.
 * When WordPress is not connected, shows a preview layout with
 * placeholder "not set" states so you can see the structure while designing.
 *
 * AGENT RULES:
 * - ALL visible text comes from WordPress — NEVER hardcode content.
 * - Use generateMetadata() with focusKeywords from RankMath.
 * - Each section is a separate component in components/sections/.
 */

import { Metadata } from "next";
import { 
  getHomePage, 
  extractHeroSectionData,
  extractAboutSectionData, 
  extractServicesSectionData,
  extractProjectsSectionData,
  extractTestimonialsSectionData,
  extractNextStepSectionData,
  getProjects,
  getTestimonials
} from "@/lib/graphql";
import Header from "@/components/layout/Header";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import ServicesSection from "@/components/sections/ServicesSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import NextStepSection from "@/components/sections/NextStepSection";
import CTASection from "@/components/sections/CTASection";
import Footer from "@/components/layout/Footer";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getHomePage();
  return {
    title: page?.seo?.title || "Home",
    description: page?.seo?.description || "",
    keywords: page?.seo?.focusKeywords
      ? [page.seo.focusKeywords]
      : undefined,
  };
}

export default async function HomePage() {
  const page = await getHomePage();
  const heroData = page?.content ? extractHeroSectionData(page.content) : null;
  const aboutData = page?.content ? extractAboutSectionData(page.content) : null;
  const servicesData = page?.content ? extractServicesSectionData(page.content) : null;
  const projectsData = page?.content ? extractProjectsSectionData(page.content) : null;
  const testimonialsData = page?.content ? extractTestimonialsSectionData(page.content) : null;
  const nextStepData = page?.content ? extractNextStepSectionData(page.content) : null;

  // Fetch dynamic posts from WordPress categories
  const dynamicProjects = await getProjects();
  const dynamicTestimonials = await getTestimonials();

  // Merge dynamic posts with parsed section data
  if (projectsData && dynamicProjects.length > 0) {
    projectsData.projects = dynamicProjects;
  }
  
  if (testimonialsData && dynamicTestimonials.length > 0) {
    testimonialsData.testimonials = dynamicTestimonials;
  }

  return (
    <main className="min-h-screen text-foreground relative overflow-hidden" style={{ background: "var(--color-bg-dark, #0a0a0a)" }}>
      {/* Header — self-fetching server component */}
      <Header />

      {/* Hero Section */}
      <HeroSection
        title={heroData?.title || page?.title}
        subtitle={heroData?.subtitle || page?.seo?.description}
        backgroundImage={page?.featuredImage?.node?.sourceUrl}
        cta={heroData ? { text: heroData.btnText, href: heroData.btnLink } : undefined}
      />

      {/* About Section */}
      <AboutSection data={aboutData} />

      {/* Services Section */}
      <ServicesSection data={servicesData} />

      {/* Projects Section */}
      <ProjectsSection data={projectsData} />

      {/* Testimonials Section */}
      <TestimonialsSection data={testimonialsData} />

      {/* Next Step Section */}
      <NextStepSection data={nextStepData} />



      {/* Footer — self-fetching server component */}
      <Footer />
    </main>
  );
}
