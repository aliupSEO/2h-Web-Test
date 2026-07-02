import { getPageBySlug, extractNextStepSectionData, extractSeoPageData, extractServicesSectionData, extractGoogleAdsPageData } from "@/lib/graphql";
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
  const page = await getPageBySlug("google-ads");
  return {
    title: page?.seo?.title || "Google Ads Agentur Wien",
    description: page?.seo?.description || "",
    keywords: page?.seo?.focusKeywords ? [page.seo.focusKeywords] : undefined,
  };
}

export default async function GoogleAdsPage() {
  const page = await getPageBySlug("google-ads");

  if (!page) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: "var(--color-bg-dark, #0a0a0a)" }}>
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4" style={{ color: "var(--color-brand-primary, #22c55e)" }}>
            WordPress Connection Needed
          </h1>
          <p style={{ color: "var(--color-text-secondary, #a1a1aa)" }}>
            Please ensure the &quot;seo&quot; page exists in WordPress.
          </p>
        </div>
      </main>
    );
  }

  const { heroData, sections } = extractGoogleAdsPageData(page.content || "");
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

      <div style={{ background: "var(--color-bg-primary, #0a0a0a)" }}>
        {sections.map((section, idx) => {
          switch (section.type) {
            case "about":
              return <AboutSection key={idx} data={section.data as any} />;
            case "benefits":
              return <BenefitsSection key={idx} data={section.data as any} />;
            case "buildingBlocks":
              return <BuildingBlocksSection key={idx} data={section.data as any} />;
            case "faq":
              return <FaqSection key={idx} data={section.data as any} />;
            case "googleFeature":
              // We'll need to import or handle this type if we use it, 
              // but for now AboutSection handles most of them.
              return <AboutSection key={idx} data={section.data as any} />;
            case "nextStep":
              return <NextStepSection key={idx} data={section.data as any} />;
            case "generic":
              return (
                <div key={idx} className="max-w-4xl mx-auto px-6 mt-16">
                  <div 
                    className="wp-content about-wp-content"
                    style={{ color: "var(--color-text-primary, #f4f4f5)" }}
                    dangerouslySetInnerHTML={{ __html: section.html || "" }}
                    suppressHydrationWarning
                  />
                </div>
              );
            default:
              return null;
          }
        })}
      </div>

      {servicesData && <ServicesSection data={servicesData} variant="dark" />}

      {!sections.some(s => s.type === "nextStep") && nextStepData && <NextStepSection data={nextStepData} />}
    </>
  );
}
