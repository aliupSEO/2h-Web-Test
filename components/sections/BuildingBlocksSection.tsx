import React from "react";
import SectionBadge from "@/components/ui/SectionBadge";
import VerticalSeparator from "@/components/ui/VerticalSeparator";
import { Link as LucideLink, ArrowUpRight, LineChart, Settings, Rocket, Target } from "lucide-react";

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
  variant?: 'google-ads' | 'seo';
}

export default function BuildingBlocksSection({ data, variant = 'google-ads' }: BuildingBlocksSectionProps) {
  if (!data || !data.blocks || data.blocks.length === 0) return null;

  const isSeo = variant === 'seo';

  return (
    <section 
      className={`py-16 md:py-24 px-6 md:px-12 lg:px-24 overflow-hidden relative ${data.backgroundImage ? 'text-white' : 'bg-white'}`}
      style={data.backgroundImage ? { 
        backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${data.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'scroll'
      } : {}}
    >
      <div className="relative z-10 max-w-[1400px] mx-auto">
        <div className="text-center mb-16 animate-fade-slide-up">
          {data.subtitle && (
            <div className="flex justify-center items-center gap-2 mb-4">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--color-brand-primary, #b6ef00)" }}></span>
              <span 
                className="font-sans font-normal uppercase tracking-[2px] text-[14px] md:text-[17px] leading-[24px] md:leading-[29.8px]"
                style={{ color: data.backgroundImage ? "#FFFFFF" : "#101010" }}
                suppressHydrationWarning
              >
                {data.subtitle}
              </span>
            </div>
          )}
          
          <h2 
            className="font-sans font-normal uppercase mx-auto max-w-none text-[32px] md:text-[46px] leading-[40px] md:leading-[59.8px]"
            style={{ color: data.backgroundImage ? "#FFFFFF" : "#101010" }}
            suppressHydrationWarning
          >
            {data.title}
          </h2>
          
          <div 
            className="font-sans font-normal max-w-[1000px] mx-auto mt-6 text-[18px] md:text-[22px] leading-[28px] md:leading-[30.8px]" 
            style={{ color: data.backgroundImage ? "#FFFFFF" : "#727272" }}
            suppressHydrationWarning
            dangerouslySetInnerHTML={{ 
              __html: data.description || ""
            }}
          />
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-2 ${variant === 'google-ads' ? 'lg:grid-cols-2 xl:grid-cols-4' : 'lg:grid-cols-3'} gap-8 animate-fade-slide-up animation-delay-200`}>
          {data.blocks.map((block, index) => {
            const icons = [LineChart, Settings, Rocket, Target];
            const Icon = icons[index % icons.length];

            return (
              <div 
                key={index}
                className="group relative transition-all duration-300 flex flex-col justify-start"
              >
                {/* Background Layer */}
                <div 
                  className={`absolute inset-0 transition-all duration-300 
                    ${isSeo ? 'bg-[#F2F3F5] rounded-[24px]' : 'bg-white rounded-[12px] shadow-xl'}
                  `}
                />

                {/* Content Layer */}
                <div className={`relative z-10 p-8 md:p-10 h-full flex flex-col ${isSeo ? 'pb-32 md:pb-32' : ''}`}>
                  {!isSeo && (
                    <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: "rgba(182, 239, 0, 0.2)" }}>
                      <Icon size={24} style={{ color: "var(--color-brand-primary, #b6ef00)" }} />
                    </div>
                  )}

                  <h3 
                    className="font-sans font-bold uppercase mb-4 text-[18px] md:text-[20px] leading-[24px] md:leading-[26px]"
                    style={{ color: "#101010" }}
                    suppressHydrationWarning
                  >
                    {block.title.replace(/^\d+\.\s*/, '')}
                  </h3>
                  
                  <p 
                    className="font-serif font-normal text-[15px] md:text-[17px] leading-[24px] md:leading-[29.8px]"
                    style={{ color: "#727272" }}
                    suppressHydrationWarning
                  >
                    {block.description}
                  </p>
                </div>

                {/* Button Layer with Smooth Cutout (SEO Variant) */}
                {isSeo && (
                  <div className="absolute bottom-0 right-0 w-[84px] h-[84px] bg-white rounded-tl-[40px] z-20">
                    {/* Top Smooth Curve (Fillet) */}
                    <div 
                      className="absolute top-[-44px] right-0 w-[44px] h-[44px]"
                      style={{ background: 'radial-gradient(circle 44px at 0% 0%, transparent 44px, white 45px)' }}
                    />
                    {/* Left Smooth Curve (Fillet) */}
                    <div 
                      className="absolute bottom-0 left-[-44px] w-[44px] h-[44px]"
                      style={{ background: 'radial-gradient(circle 44px at 0% 0%, transparent 44px, white 45px)' }}
                    />
                    
                    {/* Button */}
                    <div className="absolute bottom-[16px] right-[16px] w-[56px] h-[56px] rounded-full bg-[#101010] group-hover:bg-[var(--color-brand-primary,#b6ef00)] flex items-center justify-center transition-colors duration-300 cursor-pointer overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 opacity-100 group-hover:opacity-0">
                        <LucideLink size={24} className="text-white" />
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                        <ArrowUpRight size={24} className="text-[#101010]" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
