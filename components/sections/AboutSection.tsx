import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, CheckSquare } from "lucide-react";
import SectionBadge from "@/components/ui/SectionBadge";
import SectionTitle from "@/components/ui/SectionTitle";
import { AboutSectionData } from "@/lib/graphql";

interface AboutSectionProps {
  data: AboutSectionData | null;
}

export default function AboutSection({ data }: AboutSectionProps) {
  if (!data) return null;

  return (
    <section className="py-24 px-6 md:px-12 lg:px-24 bg-white overflow-hidden">
      <div className="max-w-[1250px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-12 lg:gap-12 items-center">
        {/* Text Content */}
        <div className="flex flex-col items-start text-left animate-fade-slide-up">
          {data.subtitle && (
            <div 
              className="font-sans font-normal uppercase tracking-[2px] mb-4"
              style={{ fontSize: "21px", lineHeight: "21px", color: "#101010" }}
            >
              {data.subtitle}
            </div>
          )}
          
          <h2 
            className="font-sans font-normal mb-6 uppercase"
            style={{ fontSize: "42px", lineHeight: "46.2px", color: "#101010" }}
            suppressHydrationWarning
            dangerouslySetInnerHTML={{ __html: data.titleLine2 ? `${data.titleLine1}<br/>${data.titleLine2}` : data.titleLine1 }}
          />

          <div 
            className="font-sans font-normal mb-6 max-w-full lg:max-w-lg"
            style={{ fontSize: "22px", lineHeight: "22px", color: "#7A7A7A" }}
            suppressHydrationWarning
            dangerouslySetInnerHTML={{ __html: data.description || "Sie erreichen genau die Menschen, die aktiv nach Ihrer Leistung suchen – und können Ergebnisse jederzeit messen und steuern." }}
          />

          {data.motto && (
            <div 
              className="font-sans font-normal mb-8 max-w-full lg:max-w-lg"
              style={{ fontSize: "20px", lineHeight: "24px", color: "#101010" }}
              suppressHydrationWarning
            >
              {data.motto}
            </div>
          )}

          {data.list1 && data.list1.length > 0 && (
            <ul className="mb-8 space-y-4">
              {data.list1.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <div className="mt-[4px] w-[24px] h-[24px] rounded-full bg-[var(--color-brand-primary,#b6ef00)] flex items-center justify-center flex-shrink-0">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <span 
                    className="font-serif font-normal"
                    style={{ fontSize: "17px", lineHeight: "29.8px", color: "#101010" }}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          )}
          
          {/* Fallback list if WP is empty */}
          {(!data.list1 || data.list1.length === 0) && (
            <ul className="mb-8 space-y-4">
              <li className="flex items-start gap-2.5">
                <BadgeCheck className="mt-[4px] flex-shrink-0" size={28} fill="var(--color-brand-primary,#b6ef00)" stroke="white" strokeWidth={2} />
                <span className="font-sans font-normal" style={{ fontSize: "24px", lineHeight: "36px", color: "#101010" }}>
                  Sofort sichtbar bei Google
                </span>
              </li>
            </ul>
          )}

          {data.list2 && data.list2.length > 0 && (
            <ul className="mb-10 space-y-1.5">
              {data.list2.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <div className="mt-[1px] w-[28px] h-[28px] rounded-[4px] bg-[var(--color-brand-primary,#b6ef00)] flex items-center justify-center flex-shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
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
  
          <div className="flex flex-wrap items-center justify-start gap-6">
            {/* Button removed per user request */}
            
            {data.phoneText && (
              <a 
                href={data.phoneLink} 
                className="flex items-center gap-3 text-[rgb(16,16,16)] hover:opacity-80 transition-opacity font-sans font-normal text-[20px] leading-[30px] tracking-wide"
                suppressHydrationWarning
              >
                <span className="flex items-center justify-center w-[40px] h-[40px] rounded-full bg-[#111111]">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-brand-primary, #b6ef00)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </span>
                {data.phoneText}
              </a>
            )}
          </div>
        </div>
  
        {/* Image */}
        <div className="flex justify-center lg:justify-end animate-fade-slide-up animation-delay-200 mt-4 lg:mt-0 w-full">
          <div className="relative w-full aspect-[4/3] rounded-[1rem] overflow-hidden shadow-xl group cursor-pointer">
            {data.imageUrl && (
              <Image
                src={data.imageUrl}
                alt={data.motto || "About Image"}
                fill
                quality={95}
                className="object-cover grayscale transition-all duration-700 ease-in-out"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
                suppressHydrationWarning
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
