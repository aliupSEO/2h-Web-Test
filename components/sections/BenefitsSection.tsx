import React from "react";
import SectionBadge from "@/components/ui/SectionBadge";
import VerticalSeparator from "@/components/ui/VerticalSeparator";
import { BarChart2, Eye, Award, Coins, Handshake, Zap, TrendingUp, Rocket, SlidersHorizontal, Target, Compass, ArrowRight, Lightbulb } from "lucide-react";

import ScrollReveal from "@/components/ui/ScrollReveal";

export interface BenefitsSectionData {
  subtitle?: string;
  title: string;
  description: string;
  benefits: string[];
}

interface BenefitsSectionProps {
  data: BenefitsSectionData;
}

export default function BenefitsSection({ data }: BenefitsSectionProps) {
  // Determine if this is the Webdesign section (based on title or subtitle)
  const isWebdesign = (data.title || "").toLowerCase().includes("channel") || (data.title || "").toLowerCase().includes("vertriebskanal");

  // Map index to a specific Lucide icon based on text
  const getIcon = (benefitText: string, index: number, iconColor: string) => {
    const props = { size: 30, color: iconColor, strokeWidth: 2 };
    const lower = (benefitText || "").toLowerCase();
    
    // Webdesign page icons
    if (lower.includes("worum es geht") || lower.includes("what it's about")) return <Compass {...props} />;
    if (lower.includes("vertrauen statt zweifel") || lower.includes("trust instead of doubt")) return <Handshake {...props} />;
    if (lower.includes("geführt") || lower.includes("guided")) return <ArrowRight {...props} />;
    if (lower.includes("überzeugen") || lower.includes("convinces")) return <Zap {...props} />;
    if (lower.includes("schritte") || lower.includes("steps")) return <Lightbulb {...props} />;
    if (lower.includes("schnell. mobil.") || lower.includes("fast. mobile.")) return <Rocket {...props} />;

    // Google Ads icons
    if (lower.includes("sofort sichtbar")) return <Zap {...props} />;
    if (lower.includes("planbare und messbare")) return <TrendingUp {...props} />;
    if (lower.includes("schneller start")) return <Rocket {...props} />;
    if (lower.includes("kontrolle") || lower.includes("budget")) return <SlidersHorizontal {...props} />;
    if (lower.includes("abschluss")) return <Target {...props} />;
    
    // SEO page icons
    if (lower.includes("planbare anfragen")) return <BarChart2 {...props} />;
    if (lower.includes("hochwertigere kunden")) return <Eye {...props} />;
    if (lower.includes("vertrauen")) return <Award {...props} />;
    if (lower.includes("geringere kosten")) return <Coins {...props} />;
    if (lower.includes("marktposition")) return <Handshake {...props} />;
    
    // Fallbacks
    switch (index) {
      case 0: return <Compass {...props} />;
      case 1: return <Handshake {...props} />;
      case 2: return <ArrowRight {...props} />;
      case 3: return <Zap {...props} />;
      case 4: return <Lightbulb {...props} />;
      case 5: return <Rocket {...props} />;
      default: return <Compass {...props} />;
    }
  };

  return (
    <section className="pb-24 pt-0 px-6 md:px-12 lg:px-24 bg-[var(--color-bg-light,#ffffff)] relative">
      <ScrollReveal className="max-w-[1000px] mx-auto text-center mb-16">
        {data.subtitle && <VerticalSeparator />}

        {data.subtitle && (
          <div className="flex justify-center items-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--color-brand-primary, #22c55e)" }}></span>
            <span 
              className="text-[17px] leading-[29.8px] font-normal uppercase"
              style={{ fontFamily: "var(--font-federo)", color: "#101010", letterSpacing: "0px" }}
              suppressHydrationWarning
            >
              {data.subtitle}
            </span>
          </div>
        )}

        <h2 
          className="text-[32px] md:text-[46px] leading-[1.2] md:leading-[59.8px] font-normal mb-6 uppercase mx-auto w-full"
          style={{ fontFamily: "var(--font-federo)", color: "#101010" }}
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: data.title }}
        />
        
        {data.description && (
          <div 
            className="text-[18px] md:text-[22px] leading-[1.4] md:leading-[22px] font-normal max-w-[850px] mx-auto"
            style={{ fontFamily: "var(--font-federo)", color: "#7A7A7A" }}
            suppressHydrationWarning
            dangerouslySetInnerHTML={{ __html: data.description }}
          />
        )}
      </ScrollReveal>

      <div className="max-w-[1000px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
        {(data.benefits || []).map((benefit, index) => (
          <ScrollReveal delay={((index % 6) + 1) * 100 as any} key={index} className="flex items-center gap-6 group cursor-default">
            {/* Icon circle - Solid for Ads/SEO, Outline for Webdesign */}
            <div 
              className={`w-[60px] h-[60px] rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110 ${isWebdesign ? "border-[2px]" : ""}`} 
              style={
                isWebdesign 
                  ? { borderColor: "var(--color-brand-primary, #b6ef00)", backgroundColor: "transparent" }
                  : { backgroundColor: "var(--color-brand-primary, #b6ef00)" }
              }
            >
              {getIcon(benefit, index, isWebdesign ? "var(--color-brand-primary, #b6ef00)" : "#FFFFFF")}
            </div>
            
            {/* Benefit text */}
            <h3 
              className="text-[24px] leading-[36px] font-normal"
              style={{ fontFamily: "var(--font-federo)", color: "#101010", letterSpacing: "0px" }}
              suppressHydrationWarning
            >
              {benefit}
            </h3>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
