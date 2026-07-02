import React from "react";
import SectionBadge from "@/components/ui/SectionBadge";
import { BarChart2, Eye, Award, Coins, Handshake } from "lucide-react";

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
  // Map index to a specific Lucide icon
  const getIcon = (index: number) => {
    const props = { size: 24, color: "white", strokeWidth: 2 };
    switch (index) {
      case 0: return <BarChart2 {...props} />;
      case 1: return <Eye {...props} />;
      case 2: return <Award {...props} />;
      case 3: return <Coins {...props} />;
      case 4: return <Handshake {...props} />;
      default: return <Award {...props} />;
    }
  };

  return (
    <section className="py-24 px-6 md:px-12 lg:px-24 bg-white relative">
      <div className="max-w-[1000px] mx-auto text-center mb-16 animate-fade-slide-up">

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
          className="text-[46px] leading-[59.8px] font-normal mb-6 uppercase mx-auto max-w-4xl"
          style={{ fontFamily: "var(--font-federo)", color: "#101010" }}
          suppressHydrationWarning
        >
          {data.title}
        </h2>
        
        {data.description && (
          <p 
            className="text-[22px] leading-[22px] font-normal max-w-[850px] mx-auto"
            style={{ fontFamily: "var(--font-federo)", color: "#7A7A7A" }}
            suppressHydrationWarning
          >
            {data.description}
          </p>
        )}
      </div>

      <div className="max-w-[1000px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 animate-fade-slide-up animation-delay-200">
        {data.benefits.map((benefit, index) => (
          <div key={index} className="flex items-center gap-6 group cursor-default">
            {/* Solid Icon circle */}
            <div 
              className="w-[60px] h-[60px] rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110" 
              style={{ backgroundColor: "var(--color-brand-primary, #b6ef00)" }}
            >
              {getIcon(index)}
            </div>
            
            {/* Benefit text */}
            <h3 
              className="text-[24px] leading-[36px] font-normal uppercase tracking-[1px]"
              style={{ fontFamily: "var(--font-federo)", color: "#101010" }}
              suppressHydrationWarning
            >
              {benefit}
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
}
