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
  const page = await getPageBySlug("seo");
  return {
    title: page?.seo?.title || "SEO | 2H Web Solutions",
    description: page?.seo?.description || "Mehr Sichtbarkeit, bessere Rankings und qualifizierte Anfragen.",
    keywords: page?.seo?.focusKeywords ? [page.seo.focusKeywords] : undefined,
  };
}

export default async function SeoPage() {
  const page = await getPageBySlug("seo");

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

      <div className="py-16 md:py-24" style={{ background: "var(--color-bg-primary, #0a0a0a)" }}>
        {sections.map((section, idx) => {
          if (section.type === "about") {
            return <AboutSection key={idx} data={section.data} />;
          }
          if (section.type === "benefits") {
            return <BenefitsSection key={idx} data={section.data} />;
          }
          if (section.type === "buildingBlocks") {
            return <BuildingBlocksSection key={idx} data={section.data} />;
          }
          if (section.type === "faq") {
            return <FaqSection key={idx} data={section.data} />;
          }
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
        })}
      </div>

      {servicesData && <ServicesSection data={servicesData} variant="dark" />}

      {nextStepData && <NextStepSection data={nextStepData} />}
    </>
  );
}
