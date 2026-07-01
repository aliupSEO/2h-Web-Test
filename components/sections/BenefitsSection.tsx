import React from "react";
import SectionBadge from "@/components/ui/SectionBadge";
import { Zap, Sliders, TrendingUp, Target, Rocket, Award } from "lucide-react";

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
    const props = { size: 24, color: "white" };
    switch (index) {
      case 0: return <Zap {...props} />;
      case 1: return <Sliders {...props} />;
      case 2: return <TrendingUp {...props} />;
      case 3: return <Target {...props} />;
      case 4: return <Rocket {...props} />;
      default: return <Award {...props} />;
    }
  };

  return (
    <section className="py-24 px-6 md:px-12 lg:px-24 bg-white relative">
      <div className="max-w-[1000px] mx-auto text-center mb-16 animate-fade-slide-up">

        <h2 
          className="text-4xl md:text-[42px] leading-tight font-serif font-normal mb-6 tracking-wide text-text-primary uppercase mx-auto max-w-4xl"
          suppressHydrationWarning
        >
          {data.title}
        </h2>
        
        {data.description && (
          <p 
            className="text-[17px] leading-[30px] text-text-secondary max-w-[850px] mx-auto font-normal"
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
              className="text-[15px] md:text-[16px] font-bold uppercase tracking-[1px] text-text-primary leading-snug"
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
