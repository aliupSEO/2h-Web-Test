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
            className="object-cover z-0" 
            priority
          />
          <div className="absolute inset-0 bg-black/75 z-10" />
        </>
      )}

      {/* Content */}
      <div className="max-w-4xl mx-auto text-center flex flex-col items-center animate-fade-slide-up relative z-20 w-full">
        
        <div className="mb-4 flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: "var(--color-brand-primary, #b6ef00)" }}></span>
          <span className="text-[11px] uppercase tracking-[2.5px] font-bold font-sans" style={{ color: "var(--color-brand-primary, #b6ef00)" }}>
            Nächster Schritt
          </span>
        </div>

        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-6 tracking-wide">
          {data.title}
        </h2>

        <p className="text-base md:text-lg leading-relaxed mb-10 max-w-3xl text-center text-white">
          {data.description}
        </p>

        <Link 
          href={data.btnLink} 
          className="inline-block border text-white rounded-[32px] px-8 py-4 text-xs tracking-widest uppercase transition-all duration-300 mb-12 font-medium hover:bg-[var(--color-brand-primary,#b6ef00)] hover:text-black"
          style={{ 
            borderColor: "var(--color-brand-primary, #b6ef00)",
          }}
        >
          {data.btnText}
        </Link>

        {/* Features List */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-10 w-full mt-2">
          {data.features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="font-bold text-xl leading-none mt-1" style={{ color: "var(--color-brand-primary, #b6ef00)" }}>*</span>
              <span className="font-sans font-medium text-zinc-300 tracking-[0.15em] uppercase text-[11px] sm:text-xs">
                {feature}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
