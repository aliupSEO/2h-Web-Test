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
            suppressHydrationWarning
          />
          <div className="absolute inset-0 bg-black/50 z-10" />
        </>
      )}

      {/* Content */}
      <div className="max-w-[1300px] mx-auto flex flex-col items-start relative z-20 w-full animate-fade-slide-up">
        
        <div className="mb-2 flex items-center justify-start gap-2">
          <span className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full" style={{ background: "var(--color-brand-primary, #b6ef00)" }}></span>
          <span className="text-[15px] md:text-[17px] leading-[30px] font-sans font-normal text-white uppercase tracking-[1px]">
            {data.subtitle}
          </span>
        </div>
  
        <h1 
          className="text-4xl sm:text-5xl md:text-[60px] lg:text-[76px] font-sans font-normal text-white uppercase tracking-[1px] md:tracking-[2px] leading-[1.1] lg:leading-[99px] mb-6"
          suppressHydrationWarning
        >
          {data.title}
        </h1>
  
        <p 
          className="text-[18px] md:text-[22px] font-sans font-medium leading-[1.5] lg:leading-[31px] mb-10 max-w-[800px] text-left text-white"
          suppressHydrationWarning
        >
          {data.description}
        </p>
  
        <Link 
          href={data.btnLink} 
          className="inline-flex items-center justify-center rounded-full px-8 md:px-12 py-4 md:py-5 text-[14px] md:text-[15px] leading-[15px] font-sans font-medium uppercase tracking-[1px] transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl border border-[var(--color-brand-primary,#b6ef00)] bg-transparent text-white hover:bg-[var(--color-brand-primary,#b6ef00)] hover:text-black"
        >
          {data.btnText}
        </Link>
      </div>
    </section>
  );
}
