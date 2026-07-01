import { Metadata } from "next";
import { getPageBySlug, extractPortfolioPageData, extractTestimonialsSectionData, getTestimonials, extractNextStepSectionData } from "@/lib/graphql";
import PortfolioPageSection from "@/components/sections/PortfolioPageSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import NextStepSection from "@/components/sections/NextStepSection";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("portfolios");
  return {
    title: page?.seo?.title || "Referenzen - 2H Web Solutions",
    description: page?.seo?.description || "Einblicke in Projekte, die 2H Websolutions begleitet hat",
    keywords: page?.seo?.focusKeywords ? [page.seo.focusKeywords] : undefined,
  };
}

export default async function PortfoliosPage() {
  const page = await getPageBySlug("portfolios");
  
  if (!page) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-brand-card text-text-light">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4" style={{ color: "var(--color-brand-primary, #b6ef00)" }}>WordPress Connection Needed</h1>
          <p className="text-text-secondary">
            Set your WordPress endpoint in <code>.env.local</code> and ensure a page
            with slug <code>"portfolios"</code> exists in WordPress.
          </p>
        </div>
      </main>
    );
  }

  let portfolioData = page.content ? extractPortfolioPageData(page.content) : null;
  if (portfolioData) {
    (portfolioData as any).imageUrl = page.featuredImage?.node?.sourceUrl || "";
  }

  const testimonialsData = page.content ? extractTestimonialsSectionData(page.content) : null;
  const dynamicTestimonials = await getTestimonials();

  if (testimonialsData && dynamicTestimonials.length > 0) {
    testimonialsData.testimonials = dynamicTestimonials;
  }

  const nextStepData = page.content ? extractNextStepSectionData(page.content) : null;

  return (
    <main className="min-h-screen bg-white text-text-primary">
      {portfolioData && <PortfolioPageSection data={portfolioData} />}
      {testimonialsData && <TestimonialsSection data={testimonialsData} />}
      {nextStepData && <NextStepSection data={nextStepData} />}
    </main>
  );
}
