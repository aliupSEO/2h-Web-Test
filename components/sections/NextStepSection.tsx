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
          <div className="absolute inset-0 bg-black/75 z-10" />
        </>
      )}

      {/* Content */}
      <div className="max-w-4xl mx-auto text-center flex flex-col items-center animate-fade-slide-up relative z-20 w-full">
        
        <div className="mb-4 flex items-center justify-center gap-2">
          <span className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full" style={{ background: "var(--color-brand-primary, #b6ef00)" }}></span>
          <span className="text-[10px] md:text-[12px] uppercase tracking-[3px] font-medium" style={{ color: "var(--color-brand-primary, #b6ef00)" }}>
            Nächster Schritt
          </span>
        </div>

        <h2 className="text-3xl sm:text-[40px] lg:text-[50px] font-serif text-white uppercase tracking-[1px] md:tracking-[2px] leading-[1.1] mb-5">
          {data.title}
        </h2>

        <p className="text-[14px] md:text-[16px] lg:text-[18px] font-serif leading-relaxed mb-8 max-w-[680px] mx-auto text-center text-white" style={{ color: "var(--color-text-light, #e4e4e7)" }}>
          {data.description}
        </p>

        <Link 
          href={data.btnLink} 
          className="inline-flex items-center justify-center border text-white rounded-full px-8 md:px-10 py-3 md:py-3.5 text-[10px] md:text-[12px] tracking-[2px] md:tracking-[3px] uppercase transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl backdrop-blur-sm mb-10 hover:bg-[#b6ef00] hover:text-black hover:border-[#b6ef00]"
          style={{ 
            borderColor: "#b6ef00",
          }}
        >
          {data.btnText}
        </Link>

        {/* Features List */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 md:gap-x-10 gap-y-4 w-full mt-2">
          {data.features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="font-bold text-lg md:text-xl leading-none mt-1" style={{ color: "var(--color-brand-primary, #b6ef00)" }}>*</span>
              <span className="font-medium text-[#d4d4d8] tracking-[1.5px] md:tracking-[2px] uppercase text-[9px] md:text-[11px]">
                {feature}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
