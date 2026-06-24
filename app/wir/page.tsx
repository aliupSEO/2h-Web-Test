/**
 * app/wir/page.tsx — Wir Page (About Us)
 *
 * Fetches the WordPress page with slug "wir" and renders all section components.
 *
 * AGENT RULES:
 * - ZERO hardcoded content — all text is fetched and parsed from WordPress.
 * - ZERO hardcoded styling — colors are controlled via WordPress design system settings.
 */

import { Metadata } from "next";
import { 
  getWirPage, 
  extractHeroSectionData,
  extractAboutSectionData, 
  extractServicesSectionData,
  extractTeamSectionData,
  extractOfficeSectionData,
  extractNextStepSectionData 
} from "@/lib/graphql";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import ServicesSection from "@/components/sections/ServicesSection";
import TeamSection from "@/components/sections/TeamSection";
import OfficeSection from "@/components/sections/OfficeSection";
import NextStepSection from "@/components/sections/NextStepSection";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getWirPage();
  return {
    title: page?.seo?.title || "Wir | 2H Web Solutions",
    description: page?.seo?.description || "Aus Leidenschaft für Webdesign, Sichtbarkeit und digitale Strategien entstehen Lösungen, die langfristig funktionieren.",
    keywords: page?.seo?.focusKeywords ? [page.seo.focusKeywords] : undefined,
  };
}

export default async function WirPage() {
  const page = await getWirPage();

  if (!page) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white pt-24">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4" style={{ color: "var(--color-brand-primary, #b6ef00)" }}>WordPress Connection Needed</h1>
          <p className="text-zinc-400">
            Set your WordPress endpoint in <code>.env.local</code> and ensure a page
            with slug <code>"wir"</code> exists in WordPress.
          </p>
        </div>
      </main>
    );
  }

  const heroData = page.content ? extractHeroSectionData(page.content) : null;
  const aboutData = page.content ? extractAboutSectionData(page.content) : null;
  const servicesData = page.content ? extractServicesSectionData(page.content) : null;
  const teamData = page.content ? extractTeamSectionData(page.content) : null;
  const officeData = page.content ? extractOfficeSectionData(page.content) : null;
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

      {/* About Section (Gründer Christian Haas) */}
      <AboutSection data={aboutData} />

      {/* Services Section (Was 2H aufbaut) */}
      <ServicesSection data={servicesData} />

      {/* Team/Partner Section (Silvio Hartleb & Ali Haider) */}
      <TeamSection data={teamData} />

      {/* Office Section (Standort Windmühlgasse Wien) */}
      <OfficeSection data={officeData} />

      {/* Next Step Section (Größter Hebel) */}
      <NextStepSection data={nextStepData} />
    </main>
  );
}
