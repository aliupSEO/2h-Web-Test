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
  getPageBySlug,
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
  const page = await getPageBySlug("wir");
  return {
    title: page?.seo?.title || "Wir | 2H Web Solutions",
    description: page?.seo?.description || "Aus Leidenschaft für Webdesign, Sichtbarkeit und digitale Strategien entstehen Lösungen, die langfristig funktionieren.",
    keywords: page?.seo?.focusKeywords ? [page.seo.focusKeywords] : undefined,
  };
}

export default async function WirPage() {
  const page = await getPageBySlug("wir");

  if (!page) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: "var(--color-bg-dark, #0a0a0a)" }}>
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4" style={{ color: "var(--color-brand-primary, #22c55e)" }}>
            WordPress Connection Needed
          </h1>
          <p style={{ color: "var(--color-text-secondary, #a1a1aa)" }}>
            Please ensure the &quot;wir&quot; page exists in WordPress.
          </p>
        </div>
      </main>
    );
  }

  const html = page.content || "";
  const heroData = extractHeroSectionData(html);
  const aboutData = extractAboutSectionData(html);
  const servicesData = extractServicesSectionData(html);
  const teamData = extractTeamSectionData(html);
  const officeData = extractOfficeSectionData(html);
  const nextStepData = extractNextStepSectionData(html);

  return (
    <>
      <HeroSection 
        title={heroData?.title || page.title}
        subtitle={heroData?.subtitle}
        description={heroData?.description}
        backgroundImage={page.featuredImage?.node?.sourceUrl}
      />
      {aboutData && <AboutSection data={aboutData} />}
      {servicesData && <ServicesSection data={servicesData} variant="dark" />}
      {teamData && <TeamSection data={teamData} />}
      {officeData && <OfficeSection data={officeData} />}
      {nextStepData && <NextStepSection data={nextStepData} />}
    </>
  );
}
