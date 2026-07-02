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
          {data.subtitle && <SectionBadge label={data.subtitle} variant="light" />}
          
          <h2 
            className="text-[36px] md:text-[42px] leading-[1.2] md:leading-[46px] font-medium mb-6 uppercase md:whitespace-nowrap"
            style={{ fontFamily: "var(--font-federo)", color: "#101010" }}
            suppressHydrationWarning
          >
            {data.titleLine1}
            <br />
            {data.titleLine2}
          </h2>

          <p 
            className="text-[18px] leading-[29px] font-medium mb-6 max-w-full lg:max-w-lg whitespace-pre-line"
            style={{ fontFamily: "var(--font-barlow)", color: "#101010" }}
            suppressHydrationWarning
          >
            {data.description}
          </p>

          {data.list1 && data.list1.length > 0 && (
            <ul className="mb-8 space-y-1.5">
              {data.list1.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <BadgeCheck 
                    className="mt-[1px] flex-shrink-0" 
                    size={28} 
                    fill="var(--color-brand-primary,#b6ef00)" 
                    stroke="white" 
                    strokeWidth={2}
                  />
                  <span 
                    className="text-[17px] leading-[30px] font-normal"
                    style={{ fontFamily: "var(--font-barlow)", color: "#101010" }}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          )}
  
          <h5 
            className="text-[20px] leading-[20px] font-medium mb-6 max-w-full lg:max-w-lg"
            style={{ fontFamily: "var(--font-federo)", color: "#101010" }}
            suppressHydrationWarning
          >
            {data.motto}
          </h5>

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
                    className="text-[17px] leading-[30px] font-normal"
                    style={{ fontFamily: "var(--font-barlow)", color: "#101010" }}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          )}
  
          <div className="flex flex-wrap items-center justify-start gap-6">
            {data.btnLink && data.btnText ? (
              <Link 
                href={data.btnLink} 
                className="btn-primary font-sans font-normal uppercase tracking-[1px] text-[15px] leading-[30px] !text-black px-8 py-3 hover:!bg-[#111111] hover:!text-white transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                suppressHydrationWarning
              >
                {data.btnText}
              </Link>
            ) : null}
            
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
                className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
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
