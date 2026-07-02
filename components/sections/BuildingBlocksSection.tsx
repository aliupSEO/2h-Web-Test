import React from "react";
import SectionBadge from "@/components/ui/SectionBadge";
import VerticalSeparator from "@/components/ui/VerticalSeparator";
import { Link, ArrowUpRight } from "lucide-react";

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
    <section className="pb-24 pt-0 px-6 md:px-12 lg:px-24 bg-white overflow-hidden">
      <div className="relative z-10 max-w-[1200px] mx-auto">
        <div className="text-center mb-16 animate-fade-slide-up">
          {data.subtitle && <VerticalSeparator />}
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
                className="group relative bg-[#f4f4f5] rounded-[24px] overflow-hidden p-10 pb-20 transition-all duration-300 flex flex-col justify-start"
              >
                <h3 
                  className="text-[22px] leading-[30px] font-normal uppercase mb-4"
                  style={{ fontFamily: "var(--font-federo)", color: "#101010" }}
                  suppressHydrationWarning
                >
                  {block.title.replace(/^\d+\.\s*/, '')}
                </h3>
                
                <p 
                  className="text-[17px] leading-[29.8px] font-normal"
                  style={{ fontFamily: "var(--font-serif)", color: "#727272" }}
                  suppressHydrationWarning
                >
                  {block.description}
                </p>
                
                {/* Smooth Corner Cutout Background Elements */}
                {/* Main white square */}
                <div className="absolute bottom-0 right-0 w-[80px] h-[80px] bg-white rounded-tl-[24px] pointer-events-none z-10"></div>
                
                {/* Top smooth curve */}
                <div className="absolute bottom-[80px] right-0 w-[24px] h-[24px] bg-transparent rounded-br-[24px] shadow-[12px_12px_0_0_#ffffff] pointer-events-none z-10"></div>
                
                {/* Left smooth curve */}
                <div className="absolute bottom-0 right-[80px] w-[24px] h-[24px] bg-transparent rounded-br-[24px] shadow-[12px_12px_0_0_#ffffff] pointer-events-none z-10"></div>
                
                {/* Black Circular Button inside the cutout */}
                <div className="absolute bottom-0 right-0 w-[80px] h-[80px] flex items-center justify-center z-20 cursor-pointer transition-transform duration-300">
                  <div className="w-[60px] h-[60px] rounded-full flex items-center justify-center transition-all duration-300 bg-[#101010] group-hover:bg-[var(--color-brand-primary,#b6ef00)]">
                    <div className="group-hover:hidden">
                      <Link size={20} color="white" />
                    </div>
                    <div className="hidden group-hover:block">
                      <ArrowUpRight size={24} color="black" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
