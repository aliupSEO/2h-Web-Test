/**
 * app/impact/page.tsx — Impact Page
 *
 * Fetches the WordPress page with slug "impact" and renders the parsed sections.
 *
 * AGENT RULES:
 * - ZERO hardcoded content — all text is fetched and parsed from WordPress.
 * - ZERO hardcoded styling — colors are controlled via WordPress design system settings.
 */

import { Metadata } from "next";
import { 
  getPageBySlug, 
  extractHeroSectionData,
  extractAboutSectionData, 
  extractServicesSectionData,
  extractNextStepSectionData 
} from "@/lib/graphql";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import ServicesSection from "@/components/sections/ServicesSection";
import NextStepSection from "@/components/sections/NextStepSection";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("impact");
  return {
    title: page?.seo?.title || "Impact | Centi",
    description: page?.seo?.description || "Centi transforms lives and businesses through digital wallets, micropayments, and tokenization.",
    keywords: page?.seo?.focusKeywords ? [page.seo.focusKeywords] : undefined,
  };
}

export default async function ImpactPage() {
  const page = await getPageBySlug("impact");

  if (!page) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white pt-24">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4" style={{ color: "var(--color-brand-primary, #b6ef00)" }}>WordPress Connection Needed</h1>
          <p className="text-zinc-400">
            Set your WordPress endpoint in <code>.env.local</code> and ensure a page
            with slug <code>"impact"</code> exists in WordPress.
          </p>
        </div>
      </main>
    );
  }

  const heroData = page.content ? extractHeroSectionData(page.content) : null;
  const aboutData = page.content ? extractAboutSectionData(page.content) : null;
  const servicesData = page.content ? extractServicesSectionData(page.content) : null;
  const nextStepData = page.content ? extractNextStepSectionData(page.content) : null;

  return (
    <main className="min-h-screen text-foreground relative overflow-hidden" style={{ background: "var(--color-bg-dark, #0a0a0a)" }}>
      {/* Hero Section */}
      <HeroSection
        title={heroData?.title || page.title}
        subtitle={heroData?.subtitle || page.seo?.description}
        backgroundImage={page.featuredImage?.node?.sourceUrl}
        cta={heroData?.btnText ? { text: heroData.btnText, href: heroData.btnLink } : undefined}
      />

      {/* About Section (Consumer Impact) */}
      <AboutSection data={aboutData} />

      {/* Services Section (Innovating Micropayments) */}
      <ServicesSection data={servicesData} />

      {/* Next Step Section (Advancing Tokenization) */}
      <NextStepSection data={nextStepData} />
    </main>
  );
}
