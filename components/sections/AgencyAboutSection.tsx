import React from "react";
import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";

interface AgencyAboutSectionProps {
  title?: string;
  description?: string;
  image1?: string;
  image2?: string;
  btnText?: string;
}

export default function AgencyAboutSection({
  title,
  description,
  image1,
  image2,
  btnText,
}: AgencyAboutSectionProps) {
  if (!title || !description || !image1 || !image2) {
    return (
      <section className="py-20 text-center" style={{ background: "var(--color-bg-primary, #ffffff)" }}>
        <h2 style={{ color: "var(--color-brand-primary, #22c55e)" }} className="text-2xl font-bold mb-4">WordPress Connection Needed</h2>
        <p style={{ color: "var(--color-text-secondary, #a1a1aa)" }}>
          Please add an "Über uns" section with 2 images in the WordPress page content to display this section.
        </p>
      </section>
    );
  }

  return (
    <section className="relative w-full py-20 md:py-32 overflow-hidden" style={{ background: "var(--color-bg-primary, #ffffff)" }}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column: Image Collage */}
          <ScrollReveal animation="fade-slide-up" className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-square flex justify-center items-center lg:-translate-x-8 xl:-translate-x-12">

            {/* Main Background Image */}
            <div className="absolute top-0 left-0 w-[85%] h-[85%] rounded-[2rem] overflow-hidden shadow-2xl z-10" style={{ borderColor: "var(--color-brand-border, #e5e7eb)" }}>
              <Image 
                src={image1} 
                alt={title} 
                fill 
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            {/* Overlapping Foreground Image */}
            <div className="absolute bottom-[-5%] right-[-5%] w-[75%] h-[75%] rounded-[2rem] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.3)] z-20 border-4" style={{ borderColor: "var(--color-bg-primary, #ffffff)" }}>
              <Image 
                src={image2} 
                alt={title} 
                fill 
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            
          </ScrollReveal>

          {/* Right Column: Text Content */}
          <div className="flex flex-col items-start text-left z-20">

            <ScrollReveal animation="fade-slide-left-blur" delay={100}>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] mb-8 tracking-tight" style={{ color: "var(--color-text-primary, #111827)" }}>
                {title}
              </h2>
            </ScrollReveal>
            
            <ScrollReveal animation="fade-slide-up" delay={300}>
              <p className="text-lg mb-10 leading-relaxed max-w-xl" style={{ color: "var(--color-text-secondary, #4b5563)" }}>
                {description}
              </p>
            </ScrollReveal>
            
            {btnText && (
              <ScrollReveal animation="fade-slide-up" delay={400}>
                <Link 
                  href="/about" 
                  className="btn-primary inline-flex items-center justify-center gap-2"
                >
                  {btnText}
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </ScrollReveal>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
