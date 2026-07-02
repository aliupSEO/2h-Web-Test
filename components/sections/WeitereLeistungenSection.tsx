import React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export interface WeitereLeistungenData {
  title: string;
  description: string;
  imageUrl?: string;
  items: string[];
}

interface WeitereLeistungenSectionProps {
  data: WeitereLeistungenData;
}

export default function WeitereLeistungenSection({ data }: WeitereLeistungenSectionProps) {
  if (!data) return null;

  return (
    <section className="py-16 md:py-24 px-6 md:px-12 lg:px-24 bg-white relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-4 items-center">
          
          {/* Left Column: Text & List */}
          <div className="animate-fade-slide-up">
            <h2 
              className="font-sans font-normal uppercase text-[32px] md:text-[46px] leading-[40px] md:leading-[59.8px] mb-6"
              style={{ color: "#101010" }}
              suppressHydrationWarning
            >
              {data.title}
            </h2>
            
            {data.description && (
              <p 
                className="font-serif font-normal max-w-[550px] text-[15px] md:text-[17px] leading-[24px] md:leading-[29.8px] mb-12"
                style={{ color: "#727272" }}
                suppressHydrationWarning
              >
                {data.description}
              </p>
            )}

            <ul className="space-y-6">
              {data.items.map((item, index) => (
                <li key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={{ color: "var(--color-brand-primary, #b6ef00)" }}>
                      <path d="M13.025 1l-2.847 2.828 6.175 6.176h-16.353v3.992h16.353l-6.175 6.176 2.847 2.828 10.975-11z"/>
                    </svg>
                  </div>
                  <span 
                    className="font-sans font-normal text-[18px] md:text-[20px] leading-[28px]"
                    style={{ color: "#101010" }}
                    suppressHydrationWarning
                    dangerouslySetInnerHTML={{ __html: item }}
                  />
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column: Image */}
          {data.imageUrl && (
            <div className="relative w-full aspect-square lg:aspect-auto lg:h-[600px] animate-fade-slide-up animation-delay-200">
              <Image
                src={data.imageUrl}
                alt={data.title}
                fill
                className="object-contain grayscale hover:grayscale-0 transition-all duration-500"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
