import React from "react";
import SectionBadge from "@/components/ui/SectionBadge";
import { Link } from "lucide-react";

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

  return (
    <section className="relative py-24 px-6 md:px-12 lg:px-24 bg-white">
      <div className="relative z-10 max-w-[1200px] mx-auto">
        <div className="text-center mb-16 animate-fade-slide-up">
          {data.subtitle && (
            <div className="flex justify-center items-center gap-2 mb-4">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--color-brand-primary, #b6ef00)" }}></span>
              <span 
                className="text-[14px] md:text-[15px] font-medium uppercase tracking-[2px]"
                style={{ color: "#7A7A7A" }}
                suppressHydrationWarning
              >
                {data.subtitle}
              </span>
            </div>
          )}
          
          <h2 
            className="text-[36px] md:text-[46px] leading-[1.2] font-normal uppercase mx-auto max-w-4xl"
            style={{ fontFamily: "var(--font-federo)", color: "#101010" }}
            suppressHydrationWarning
          >
            {data.title}
          </h2>
          
          {data.description && (
            <p className="text-[18px] leading-[28px] max-w-[850px] mx-auto mt-6 font-normal" style={{ color: "#7A7A7A" }}>
              {data.description}
            </p>
          )}
        </div>

        {/* 3 column layout like Image 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-slide-up animation-delay-200">
          {data.blocks.map((block, index) => {
            return (
              <div 
                key={index}
                className="relative bg-[#f4f4f5] rounded-[24px] p-10 transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col justify-start"
              >
                <h3 
                  className="text-[22px] leading-[30px] font-normal uppercase mb-4"
                  style={{ fontFamily: "var(--font-federo)", color: "#101010" }}
                  suppressHydrationWarning
                >
                  {block.title.replace(/^\d+\.\s*/, '')}
                </h3>
                
                <p 
                  className="text-[16px] leading-[26px] font-normal"
                  style={{ color: "#7A7A7A" }}
                  suppressHydrationWarning
                >
                  {block.description}
                </p>
                
                {/* Black Circular Button overlapping bottom right */}
                <div className="absolute -bottom-4 -right-4 w-[60px] h-[60px] rounded-full bg-[#101010] flex items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-110 shadow-lg border-[6px] border-white">
                  <Link size={20} color="white" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
