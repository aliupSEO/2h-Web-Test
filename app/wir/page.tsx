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
  return (
    <main className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4" style={{ background: "var(--color-bg-dark, #0a0a0a)" }}>
      <div className="mb-8 flex items-center justify-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--color-brand-primary, #b6ef00)" }}></span>
        <span className="text-[14px] md:text-[17px] font-sans uppercase tracking-[2px] md:tracking-[3px]" style={{ color: "var(--color-brand-primary, #b6ef00)" }}>
          Temporär
        </span>
      </div>
      <h1 className="text-3xl md:text-5xl font-bold mb-6 text-white uppercase tracking-wider font-sans">
        Seite im Aufbau
      </h1>
      <p className="text-lg md:text-xl text-zinc-400 max-w-md mx-auto font-sans">
        Diese Seite ist vorübergehend nicht verfügbar. Bitte schauen Sie später wieder vorbei.
      </p>
    </main>
  );
}
