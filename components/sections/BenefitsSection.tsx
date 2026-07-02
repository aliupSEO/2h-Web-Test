import React from "react";
import SectionBadge from "@/components/ui/SectionBadge";
import VerticalSeparator from "@/components/ui/VerticalSeparator";
import { Compass, Handshake, ArrowRight, Zap, Lightbulb, Rocket } from "lucide-react";

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
    const props = { size: 24, color: "var(--color-brand-primary, #b6ef00)", strokeWidth: 2 };
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
    <section className="pb-24 pt-0 px-6 md:px-12 lg:px-24 bg-white relative">
      <div className="max-w-[1000px] mx-auto text-center mb-16 animate-fade-slide-up">
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
      </div>

      <div className="max-w-[1000px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 animate-fade-slide-up animation-delay-200">
        {(data.benefits || []).map((benefit, index) => (
          <div key={index} className="flex items-center gap-6 group cursor-default">
            {/* Outline Icon circle */}
            <div 
              className="w-[60px] h-[60px] rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110 border-[2px]" 
              style={{ borderColor: "var(--color-brand-primary, #b6ef00)", backgroundColor: "transparent" }}
            >
              {getIcon(index)}
            </div>
            
            {/* Benefit text */}
            <h3 
              className="text-[24px] leading-[36px] font-normal"
              style={{ fontFamily: "var(--font-federo)", color: "#101010", letterSpacing: "0px" }}
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
