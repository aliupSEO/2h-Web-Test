
import React from "react";
import Image from "next/image";
import { BadgeCheck } from "lucide-react";
import VerticalSeparator from "@/components/ui/VerticalSeparator";
import SectionBadge from "@/components/ui/SectionBadge";

export interface GoogleFeatureSectionData {
  title: string;
  subtitle?: string;
  description?: string;
  motto?: string;
  items: string[];
  imageUrl?: string;
}

interface GoogleFeatureSectionProps {
  data: GoogleFeatureSectionData;
}

export default function GoogleFeatureSection({ data }: GoogleFeatureSectionProps) {
  if (!data) return null;

  return (
    <section className="pb-24 pt-0 px-6 md:px-12 lg:px-24 bg-white overflow-hidden">
      <div className="max-w-[1250px] mx-auto">
        <VerticalSeparator />
        
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-12 lg:gap-16 items-center">
          {/* Text Content */}
          <div className="flex flex-col items-start text-left animate-fade-slide-up">
            {data.subtitle && (
              <SectionBadge label={data.subtitle} variant="light" className="mb-4" />
            )}
            
            <h2 
              className="text-[32px] md:text-[42px] leading-[1.1] md:leading-[46.2px] font-normal mb-8 uppercase"
              style={{ fontFamily: "var(--font-federo)", color: "#101010" }}
              suppressHydrationWarning
            >
              {data.title}
            </h2>

            {data.description && (
              <p 
                className="text-[18px] leading-[28.8px] font-normal mb-8 max-w-full lg:max-w-[90%] whitespace-pre-line"
                style={{ fontFamily: "var(--font-barlow)", color: "#7A7A7A" }}
                suppressHydrationWarning
              >
                {data.description}
              </p>
            )}

            {data.motto && (
              <h4 
                className="text-[20px] leading-[24px] font-normal mb-6 uppercase"
                style={{ fontFamily: "var(--font-federo)", color: "#101010" }}
                suppressHydrationWarning
              >
                {data.motto}
              </h4>
            )}

            {data.items && data.items.length > 0 && (
              <ul className="space-y-4">
                {data.items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <BadgeCheck 
                      className="mt-[3px] flex-shrink-0" 
                      size={24} 
                      fill="var(--color-brand-primary,#b6ef00)" 
                      stroke="white" 
                      strokeWidth={2}
                    />
                    <span 
                      className="text-[17px] leading-[29.8px] font-normal"
                      style={{ fontFamily: "var(--font-barlow)", color: "#101010" }}
                    >
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
    
          {/* Image */}
          <div className="flex justify-center lg:justify-end animate-fade-slide-up animation-delay-200 mt-8 lg:mt-0 w-full">
            <div className="relative w-full aspect-[4/3] rounded-[1rem] overflow-hidden shadow-xl">
              {data.imageUrl && (
                <Image
                  src={data.imageUrl}
                  alt={data.title}
                  fill
                  quality={95}
                  className="object-cover transition-transform duration-700 ease-in-out hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                  suppressHydrationWarning
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
