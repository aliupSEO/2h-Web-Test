import Link from "next/link";
import Image from "next/image";
import { DigitaleHeroSectionData } from "@/lib/graphql";

interface DigitaleHeroSectionProps {
  data: DigitaleHeroSectionData | null;
}

export default function DigitaleHeroSection({ data }: DigitaleHeroSectionProps) {
  if (!data) return null;

  return (
    <section className="relative pt-[180px] pb-32 px-6 sm:px-10 md:px-12 lg:px-24 min-h-[calc(100vh+100px)] flex flex-col justify-center overflow-hidden bg-black mt-[-100px]">
      
      {/* Background Image & Overlay */}
      {data.imageUrl && (
        <>
          <Image 
            src={data.imageUrl} 
            alt="Hero Background" 
            fill 
            className="object-cover z-0 filter grayscale" 
            priority
          />
          <div className="absolute inset-0 bg-black/50 z-10" />
        </>
      )}

      {/* Content */}
      <div className="max-w-[1300px] mx-auto flex flex-col items-start relative z-20 w-full animate-fade-slide-up">
        
        <div className="mb-2 flex items-center justify-start gap-2">
          <span className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full" style={{ background: "var(--color-brand-primary, #b6ef00)" }}></span>
          <span className="text-[10px] md:text-[12px] uppercase tracking-[3px] font-medium" style={{ color: "var(--color-brand-primary, #b6ef00)" }}>
            {data.subtitle}
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-[70px] lg:text-[90px] font-serif text-white uppercase tracking-[1px] md:tracking-[2px] leading-[1.1] mb-6">
          {data.title}
        </h1>

        <p className="text-[15px] md:text-[18px] lg:text-[20px] font-serif leading-relaxed mb-10 max-w-[650px] text-left text-white" style={{ color: "var(--color-text-light, #e4e4e7)" }}>
          {data.description}
        </p>

        <Link 
          href={data.btnLink} 
          className="inline-flex items-center justify-center border text-white rounded-full px-8 md:px-12 py-3 md:py-3.5 text-[10px] md:text-[11px] tracking-[2px] md:tracking-[3px] uppercase transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl backdrop-blur-sm hover:bg-[#b6ef00] hover:text-black hover:border-[#b6ef00]"
          style={{ 
            borderColor: "#b6ef00",
            borderWidth: "1px"
          }}
        >
          {data.btnText}
        </Link>
      </div>
    </section>
  );
}
