import { Metadata } from "next";
import { getDigitaleLosungenPage, extractDigitaleHeroSectionData, extractDigitaleNextStepSectionData, extractDigitaleServicesData } from "@/lib/graphql";
import DigitaleHeroSection from "@/components/sections/DigitaleHeroSection";
import DigitaleServicesSection from "@/components/sections/DigitaleServicesSection";
import NextStepSection from "@/components/sections/NextStepSection";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getDigitaleLosungenPage();
  return {
    title: page?.seo?.title || "Digitale Lösungen | 2H Web Solutions",
    description: page?.seo?.description || "Maßgeschneiderte digitale Lösungen für Ihr Unternehmen.",
    keywords: page?.seo?.focusKeywords ? [page.seo.focusKeywords] : undefined,
  };
}

export default async function DigitaleLosungenPage() {
  const page = await getDigitaleLosungenPage();

  if (!page) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white pt-24">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4" style={{ color: "var(--color-brand-primary, #b6ef00)" }}>WordPress Connection Needed</h1>
          <p className="text-zinc-400">
            Set your WordPress endpoint in <code>.env.local</code> and ensure a page
            with slug <code>digitale-losungen</code> exists in WordPress.
          </p>
        </div>
      </main>
    );
  }

  const heroData = extractDigitaleHeroSectionData(page.content);
  if (heroData && page.featuredImage?.node?.sourceUrl) {
    heroData.imageUrl = page.featuredImage.node.sourceUrl;
  }
  const servicesData = extractDigitaleServicesData(page.content);
  const nextStepData = extractDigitaleNextStepSectionData(page.content);

  return (
    <main className="min-h-screen bg-black">
      <DigitaleHeroSection data={heroData} />
      <DigitaleServicesSection services={servicesData} />
      <NextStepSection data={nextStepData} />
    </main>
  );
}
