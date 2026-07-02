import { getPageBySlug, extractNextStepSectionData, extractSeoPageData, extractServicesSectionData } from "@/lib/graphql";
import { Metadata } from "next";
import NextStepSection from "@/components/sections/NextStepSection";
import HeroSection from "@/components/sections/HeroSection";
import TickerSection from "@/components/sections/TickerSection";
import AboutSection from "@/components/sections/AboutSection";
import BenefitsSection from "@/components/sections/BenefitsSection";
import BuildingBlocksSection from "@/components/sections/BuildingBlocksSection";
import FaqSection from "@/components/sections/FaqSection";
import ServicesSection from "@/components/sections/ServicesSection";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("web-design");
  return {
    title: page?.seo?.title || "Webdesign & Webshops | 2H Web Solutions",
    description: page?.seo?.description || "Maßgeschneiderte Websites und Webshops für mehr Sichtbarkeit und qualifizierte Anfragen.",
    keywords: page?.seo?.focusKeywords ? [page.seo.focusKeywords] : undefined,
  };
}

export default async function WebDesignPage() {
  const page = await getPageBySlug("web-design");

  if (!page) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: "var(--color-bg-dark, #0a0a0a)" }}>
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4" style={{ color: "var(--color-brand-primary, #22c55e)" }}>
            WordPress Connection Needed
          </h1>
          <p style={{ color: "var(--color-text-secondary, #a1a1aa)" }}>
            Please ensure the &quot;web-design&quot; page exists in WordPress.
          </p>
        </div>
      </main>
    );
  }

  const { heroData, sections } = extractSeoPageData(page.content || "");
  const nextStepData = page.content ? extractNextStepSectionData(page.content) : null;
  const servicesData = page.content ? extractServicesSectionData(page.content) : null;

  return (
    <>
      {heroData ? (
        <>
          <HeroSection
            title={heroData.title || page.title}
            description={heroData.description}
            backgroundImage={page.featuredImage?.node?.sourceUrl}
            cta={heroData.ctaText && heroData.ctaLink ? { text: heroData.ctaText, href: heroData.ctaLink } : undefined}
            bulletPoints={heroData.bulletPoints}
          />
          {heroData.tickerText && <TickerSection text={heroData.tickerText} />}
        </>
      ) : (
        <HeroSection
          title={page.title}
          backgroundImage={page.featuredImage?.node?.sourceUrl}
        />
      )}

      {(() => {
        const aboutSection = sections.find(s => s.type === "about");
        const benefitsSection = sections.find(s => s.type === "benefits");
        const buildingBlocksSection = sections.find(s => s.type === "buildingBlocks");
        const faqSection = sections.find(s => s.type === "faq");
        const genericSections = sections.filter(s => s.type === "generic");

        const hasAnySection = aboutSection || benefitsSection || buildingBlocksSection || faqSection || genericSections.length > 0;
        if (!hasAnySection) return null;

        return (
          <div style={{ background: "var(--color-bg-primary, #0a0a0a)" }}>
            {aboutSection && <AboutSection data={aboutSection.data as any} />}
            {benefitsSection && <BenefitsSection data={benefitsSection.data as any} />}
            {buildingBlocksSection && <BuildingBlocksSection data={buildingBlocksSection.data as any} />}
            {faqSection && <FaqSection data={faqSection.data as any} />}
            {genericSections.map((section, idx) => (
              <div key={idx} className="max-w-4xl mx-auto px-6 mt-16">
                <div 
                  className="wp-content about-wp-content"
                  style={{ color: "var(--color-text-primary, #f4f4f5)" }}
                  dangerouslySetInnerHTML={{ __html: section.html || "" }}
                  suppressHydrationWarning
                />
              </div>
            ))}
          </div>
        );
      })()}

      {servicesData && <ServicesSection data={servicesData} variant="dark" />}

      {nextStepData && <NextStepSection data={nextStepData} />}
    </>
  );
}
