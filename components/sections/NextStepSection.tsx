import Link from "next/link";
import Image from "next/image";
import { NextStepSectionData } from "@/lib/graphql";

interface NextStepSectionProps {
  data: NextStepSectionData | null;
}

export default function NextStepSection({ data }: NextStepSectionProps) {
  if (!data) return null;

  return (
    <section className="relative py-24 px-6 md:px-12 lg:px-24 min-h-[60vh] md:min-h-[70vh] flex flex-col justify-center overflow-hidden bg-black">
      
      {/* Background Image & Overlay */}
      {data.imageUrl && (
        <>
          <Image 
            src={data.imageUrl} 
            alt="Next Step Background" 
            fill 
            className="object-cover z-0 filter grayscale" 
            priority
          />
          <div className="absolute inset-0 bg-black/60 z-10" />
        </>
      )}

      {/* Content */}
      <div className="max-w-[1100px] mx-auto text-center flex flex-col items-center animate-fade-slide-up relative z-20 w-full">
        
        <h2 
          className="text-[32px] md:text-[50px] leading-[1.2] md:leading-[65px] uppercase mb-5 max-w-[750px] mx-auto"
          style={{ fontFamily: 'var(--font-federo)', fontWeight: 500, color: '#ffffff' }}
          dangerouslySetInnerHTML={{ __html: data.title }}
        />
  
        <p 
          className="text-[18px] md:text-[22px] leading-[1.4] md:leading-[26px] mb-8 max-w-[780px] mx-auto text-center whitespace-pre-line px-2 md:px-0"
          style={{ fontFamily: 'var(--font-federo)', fontWeight: 500, color: '#ffffff' }}
        >
          {data.description}
        </p>
  
        <Link 
          href={data.btnLink} 
          className="inline-flex items-center justify-center rounded-full px-6 md:px-12 py-4 md:py-6 text-[15px] leading-[15px] font-sans font-normal text-[#E7E7E7] uppercase bg-transparent border border-[var(--color-brand-primary,#b6ef00)] hover:bg-[var(--color-brand-primary,#b6ef00)] hover:text-[rgb(16,16,16)] transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl mb-10 max-w-[90vw] text-center"
        >
          {data.btnText}
        </Link>
  
        {/* Features List */}
        <div className="flex flex-row flex-wrap md:flex-nowrap items-center justify-center gap-x-3 md:gap-x-10 gap-y-2 w-full mt-2">
        {data.features.map((feature, index) => (
          <div key={index} className="flex items-center gap-1 md:gap-2">
            <span className="font-sans font-bold text-[22px] md:text-[30px] leading-none mt-1.5 md:mt-2" style={{ color: "var(--color-brand-primary, #b6ef00)" }}>*</span>
            <span 
              className="uppercase whitespace-nowrap text-[14px] md:text-[17px] leading-[1.4] md:leading-[30px]"
              style={{ fontFamily: 'var(--font-barlow)', fontWeight: 500, color: 'rgb(211,211,211)' }}
            >
              {feature}
            </span>
          </div>
        ))}
      </div>
      </div>
    </section>
  );
}
