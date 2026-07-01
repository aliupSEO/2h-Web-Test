import React from "react";
import Image from "next/image";
import SectionBadge from "@/components/ui/SectionBadge";
import { TrendingUp, PenTool, Globe, Settings, ShieldCheck, Rocket, UserCog, Mail } from "lucide-react";

export interface BuildingBlockData {
  title: string;
  description: string;
}

export interface BuildingBlocksSectionData {
  subtitle?: string;
  title: string;
  description?: string;
  backgroundImage?: string;
  blocks: BuildingBlockData[];
}

interface BuildingBlocksSectionProps {
  data: BuildingBlocksSectionData;
}

export default function BuildingBlocksSection({ data }: BuildingBlocksSectionProps) {
  if (!data || !data.blocks || data.blocks.length === 0) return null;

  const getIcon = (index: number) => {
    const props = { size: 28, color: "var(--color-brand-primary, #b6ef00)" };
    switch (index) {
      case 0: return <TrendingUp {...props} />;
      case 1: return <PenTool {...props} />;
      case 2: return <Globe {...props} />;
      case 3: return <Settings {...props} />;
      case 4: return <ShieldCheck {...props} />;
      case 5: return <Rocket {...props} />;
      case 6: return <UserCog {...props} />;
      case 7: return <Mail {...props} />;
      default: return <TrendingUp {...props} />;
    }
  };

  return (
    <section className="relative py-24 px-6 md:px-12 lg:px-24">
      {/* Background Image & Overlay */}
      {data.backgroundImage ? (
        <>
          <Image 
            src={data.backgroundImage} 
            alt={data.title} 
            fill 
            className="object-cover z-0" 
            sizes="100vw"
            quality={90}
          />
          <div className="absolute inset-0 bg-brand-dark/80 z-0"></div>
        </>
      ) : (
        <div className="absolute inset-0 bg-zinc-900 z-0"></div>
      )}

      <div className="relative z-10 max-w-[1200px] mx-auto">
        <div className="text-center mb-16 animate-fade-slide-up">
          {data.subtitle && <SectionBadge label={data.subtitle} variant="dark" className="mx-auto" />}
          
          <h2 
            className="text-4xl md:text-[45px] leading-[1.2] font-serif font-normal mt-6 tracking-wide text-text-light uppercase mx-auto max-w-4xl"
            suppressHydrationWarning
          >
            {data.title}
          </h2>
          
          {data.description && (
            <p className="text-[17px] leading-[30px] text-text-secondary max-w-[850px] mx-auto mt-6 font-normal">
              {data.description}
            </p>
          )}
        </div>

        {/* Use a 4 column layout on large screens */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-slide-up animation-delay-200">
          {data.blocks.map((block, index) => {
            // Split the comma-separated description into list items
            const listItems = block.description.split(",").map(item => item.trim()).filter(Boolean);
            
            return (
              <div 
                key={index}
                className="relative bg-white rounded-[12px] p-8 md:p-8 transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl h-full flex flex-col justify-start"
              >
                {/* Icon at top left */}
                <div className="w-[50px] h-[50px] rounded-full bg-[#f4fbdf] flex items-center justify-center mb-6">
                  {getIcon(index)}
                </div>
                
                <h3 
                  className="text-[15px] leading-[24px] font-sans font-bold uppercase tracking-[1px] mb-6 text-text-primary"
                  suppressHydrationWarning
                >
                  {block.title.replace(/^\d+\.\s*/, '')} {/* Strip '1. ' if it exists */}
                </h3>
                
                <ul className="flex flex-col gap-3">
                  {listItems.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-brand-primary, #b6ef00)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-1">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span className="text-[14px] leading-[22px] text-text-secondary font-normal" suppressHydrationWarning>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
