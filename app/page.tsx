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
import { getHomePage } from "@/lib/graphql";
import Header from "@/components/layout/Header";
import HeroSection from "@/components/sections/HeroSection";
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

  return (
    <main className="min-h-screen bg-brand-dark text-foreground relative overflow-hidden">
      {/* Header — self-fetching server component */}
      <Header />

      {/* Hero Section */}
      <HeroSection
        title={page?.title}
        subtitle={page?.seo?.description}
        backgroundImage={page?.featuredImage?.node?.sourceUrl}
      />

      {/* 
        Add more sections here as you build:
        
        <AboutSection ... />
        <ServicesSection ... />
        <ProjectsSection ... />
        <TestimonialsSection ... />
      */}

      {/* CTA Section */}
      <CTASection
        title={page ? "Ready to Start?" : "CTA Section Preview"}
        description={
          page
            ? undefined
            : "This section will show your call-to-action content from WordPress."
        }
        cta={
          page
            ? { text: "Get in Touch", href: "/contact" }
            : undefined
        }
      />

      {/* Footer — self-fetching server component */}
      <Footer />
    </main>
  );
}
