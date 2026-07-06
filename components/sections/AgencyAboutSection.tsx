import React from "react";
import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";
import StaggeredText from "@/components/ui/StaggeredText";
import AnimatedGridBackground from "@/components/ui/AnimatedGridBackground";

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
          Please add an introductory section (with a heading and 2 images) in the WordPress page content to display this section.
        </p>
      </section>
    );
  }

  return (
    <section className="relative w-full py-20 md:py-32 overflow-hidden" style={{ background: "var(--color-bg-primary, #ffffff)" }}>
      <AnimatedGridBackground />
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column: Image Collage */}
          <div className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-square flex justify-center items-center lg:-translate-x-8 xl:-translate-x-12 group cursor-pointer">

            {/* Main Background Image */}
            <ScrollReveal animation="fade-slide-right" className="absolute top-0 left-0 w-[85%] h-[85%] z-10">
              <div 
                className="relative w-full h-full rounded-[2rem] overflow-hidden shadow-2xl border-4 transition-all duration-700 ease-out group-hover:-translate-x-2 group-hover:-translate-y-4 group-hover:-rotate-2 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)]" 
                style={{ borderColor: "var(--color-brand-border, #e5e7eb)" }}
              >
                <Image 
                  src={image1} 
                  alt={title || "Image"} 
                  fill 
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </ScrollReveal>

            {/* Overlapping Foreground Image */}
            <ScrollReveal animation="fade-slide-up" delay={200} className="absolute bottom-[-5%] right-[-5%] w-[75%] h-[75%] z-20">
              <div 
                className="relative w-full h-full rounded-[2rem] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.3)] border-4 transition-all duration-700 ease-out group-hover:translate-x-3 group-hover:translate-y-3 group-hover:rotate-2 group-hover:shadow-[0_40px_80px_rgba(0,0,0,0.4)]" 
                style={{ borderColor: "var(--color-bg-primary, #ffffff)" }}
              >
                <Image 
                  src={image2} 
                  alt={title || "Image"} 
                  fill 
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </ScrollReveal>
            
          </div>

          {/* Right Column: Text Content */}
          <div className="flex flex-col items-start text-left z-20">

            <ScrollReveal animation="fade-slide-left-blur" delay={100}>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] mb-8 tracking-tight" style={{ color: "var(--color-text-primary, #111827)" }}>
                {title}
              </h2>
            </ScrollReveal>
            
            {description && (
              <StaggeredText 
                text={description} 
                delay={300} 
                stagger={100} 
                className="text-lg mb-10 leading-loose max-w-xl" 
                style={{ color: "var(--color-text-primary, #000000)" }} 
              />
            )}
            
            {btnText && (
              <ScrollReveal animation="fade-slide-up" delay={400}>
                <Link 
                  href="/about" 
                  className="btn-primary group inline-flex items-center justify-center gap-2 hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(34,197,94,0.4)]"
                  style={{
                    "--btn-primary-padding-y": "16px",
                    "--btn-primary-padding-x": "32px",
                    "--btn-primary-font-size": "16px",
                    "--btn-primary-hover-bg": "var(--btn-primary-bg, var(--color-brand-primary))",
                    "--btn-primary-hover-text": "var(--btn-primary-text, #000000)"
                  } as React.CSSProperties}
                >
                  {btnText}
                  <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
