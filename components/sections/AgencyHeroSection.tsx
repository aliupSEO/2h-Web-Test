/**
 * components/sections/AgencyHeroSection.tsx
 *
 * Custom hero section for the Agency page.
 * Features a split layout with text on the left, an illustration on the right,
 * and a logo strip at the bottom.
 * 
 * Implements "zero hardcoded content" and respects CSS variables.
 */

import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";

interface AgencyHeroSectionProps {
  title?: string;
  description?: string;
  btnText?: string;
  btnLink?: string;
  secondaryBtnText?: string;
  secondaryBtnLink?: string;
  rightImage?: string;
  logos?: string[];
  floatingImages?: string[];
  techStack?: string[];
}

export default function AgencyHeroSection({
  title,
  description,
  btnText,
  btnLink,
  secondaryBtnText,
  secondaryBtnLink,
  rightImage,
  logos = [],
  floatingImages = [],
  techStack = [],
}: AgencyHeroSectionProps) {
  const hasData = !!title;

  if (!hasData) {
    return (
      <section
        className="relative min-h-screen flex flex-col justify-center items-center px-6"
        style={{ background: "var(--color-bg-primary, #ffffff)" }}
      >
        <div className="text-center max-w-md">
          <p className="text-2xl font-bold mb-3" style={{ color: "var(--color-brand-primary, #22c55e)" }}>
            WordPress Connection Needed
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-primary, #0a0a0a)" }}>
            Please create a page with slug <code>agency</code> in WordPress and add content.
          </p>
        </div>
      </section>
    );
  }

  // Add custom brush stroke underline to the specific word "Webentwicklung" or any <u> tags
  const processTitle = (html: string) => {
    // 1. Add brush stroke
    const brushStrokeSvg = `<div class="absolute left-[-2%] bottom-[-8px] h-[16px] w-[105%] z-[-1] overflow-hidden animate-reveal-width">
      <svg class="w-full h-full text-[var(--color-brand-primary,#22c55e)]" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0,8 C30,12 70,8 100,2 C60,4 20,4 0,8 Z" fill="currentColor"/></svg>
    </div>`;
    const wrapWithStroke = (text: string) => `<span class="relative inline-block z-10">${text}${brushStrokeSvg}</span>`;

    let processed = html.replace(/<(u|span)>(.*?)<\/\1>/gi, wrapWithStroke('$2'));
    
    if (!processed.includes('relative inline-block') && processed.includes('Webentwicklung')) {
      processed = processed.replace('Webentwicklung', wrapWithStroke('Webentwicklung'));
    }
    
    // 2. Wrap words in animated spans (ignoring HTML tags)
    let wordIndex = 0;
    processed = processed.replace(/(<[^>]*>)|([^<]+)/g, (match, tag, text) => {
      if (tag) return tag; // preserve HTML tags completely
      
      // Split by whitespace but keep whitespace intact
      return text.split(/(\s+)/).map((word: string) => {
        if (!word.trim()) return word; // return whitespace as is
        
        const delay = 0.1 + (wordIndex * 0.12); // stagger each word by 120ms
        wordIndex++;
        
        return `<span class="inline-block animate-word-blur" style="animation-delay: ${delay}s">${word}</span>`;
      }).join('');
    });
    
    return processed;
  };

  const processedTitle = title ? processTitle(title) : "";

  return (
    <section
      className="relative min-h-screen flex flex-col pt-32 overflow-hidden"
      style={{ background: "var(--color-bg-primary, #ffffff)" }}
    >
      {/* Massive Gradient Background (Inspired by Screenshot) */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
        style={{
          maskImage: "linear-gradient(to bottom, black 75%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 75%, transparent 100%)"
        }}
      >
        
        {/* 1. Primary Massive Soft Glow (Right Side) */}
        <div 
          className="absolute top-[-10%] right-[-15%] w-[80vw] h-[80vw] rounded-[100%] filter blur-[160px] opacity-[0.35] animate-breathe" 
          style={{ background: "linear-gradient(135deg, #dcfce7, var(--color-brand-primary, #22c55e))" }}
        />
        
        {/* 2. Secondary Glow (Bottom Right) */}
        <div 
          className="absolute bottom-[-10%] right-[5%] w-[60vw] h-[60vw] rounded-full filter blur-[140px] opacity-[0.25]" 
          style={{ backgroundColor: "#10b981" }}
        />

        {/* 3. The Solid Sharp Circle framing the images (hidden on mobile, visible on desktop) */}
        <div 
          className="absolute top-[15%] right-[2%] w-[700px] h-[700px] rounded-full opacity-[0.06] hidden lg:block" 
          style={{ background: "linear-gradient(135deg, var(--color-brand-primary, #22c55e), #047857)" }}
        />
        
        {/* Very subtle noise overlay for premium texture (optional, minimal opacity) */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 md:px-12 flex-grow flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-[45%_55%] gap-8 lg:gap-10 items-center">

          {/* Left Column: Text */}
          <div className="flex flex-col items-start text-left max-w-2xl relative">
            
            {/* Large Hand-drawn looping arrow pointing to the right column images */}
            <div className="absolute right-[-140px] -top-10 hidden lg:block opacity-90 rotate-[15deg] z-20 xl:right-[-180px] drop-shadow-[0_8px_12px_rgba(34,197,94,0.3)]">
              <svg width="220" height="180" viewBox="0 0 100 80" fill="none" stroke="var(--color-brand-primary, #22c55e)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M 10,60 C 30,30 60,10 70,40 C 75,60 50,70 45,50 C 40,25 70,25 90,35" className="animate-draw-arrow-body" />
                <path d="M 75,25 L 92,36 L 80,45" className="animate-draw-arrow-head" />
              </svg>
            </div>

            <h1
              className="text-[42px] md:text-[54px] lg:text-[56px] leading-[1.1] font-bold font-sans tracking-tight mb-6 text-balance"
              style={{ color: "var(--color-brand-secondary, #111827)" }}
              dangerouslySetInnerHTML={{ __html: processedTitle }}
            />

            {description && (
              <ScrollReveal delay={200}>
                <p
                  className="text-[18px] md:text-[20px] leading-[1.6] font-normal font-sans mb-10"
                  style={{ color: "var(--color-text-secondary, #4b5563)" }}
                >
                  {description}
                </p>
              </ScrollReveal>
            )}

            {/* Buttons */}
            <ScrollReveal delay={300}>
              <style>{`
                @keyframes wordBlurFadeIn {
                  0% {
                    opacity: 0;
                    filter: blur(12px);
                    transform: translateX(40px);
                  }
                  100% {
                    opacity: 1;
                    filter: blur(0);
                    transform: translateX(0);
                  }
                }
                .animate-word-blur {
                  opacity: 0;
                  animation: wordBlurFadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                  will-change: transform, opacity, filter;
                }
                .agency-btn-primary {
                  background-color: var(--color-brand-primary, #22c55e) !important;
                  color: #000000 !important;
                  border-radius: 6px !important;
                  padding: 16px 32px !important;
                  font-weight: 600 !important;
                  font-size: 16px !important;
                  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
                  box-shadow: 0 4px 14px 0 rgba(0,0,0,0.05) !important;
                  display: inline-flex;
                  align-items: center;
                  justify-content: center;
                }
                .agency-btn-primary:hover {
                  transform: translateY(-2px) !important;
                  box-shadow: 0 8px 20px -6px var(--color-brand-primary) !important;
                  /* Keep background and text color identical on hover */
                  background-color: var(--color-brand-primary, #22c55e) !important;
                  color: #000000 !important;
                }
                .agency-btn-secondary {
                  background-color: #1f2937 !important;
                  color: #ffffff !important;
                  border-radius: 6px !important;
                  padding: 16px 32px !important;
                  font-weight: 600 !important;
                  font-size: 16px !important;
                  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
                  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1) !important;
                  display: inline-flex;
                  align-items: center;
                  justify-content: center;
                }
                .agency-btn-secondary:hover {
                  transform: translateY(-2px) !important;
                  box-shadow: 0 12px 25px -5px rgba(0, 0, 0, 0.4) !important;
                  /* Keep background and text color identical on hover */
                  background-color: #1f2937 !important;
                  color: #ffffff !important;
                }
                @keyframes drawStroke {
                  to { stroke-dashoffset: 0; }
                }
                .animate-draw-arrow-body {
                  stroke-dasharray: 200;
                  stroke-dashoffset: 200;
                  animation: drawStroke 0.6s ease-in-out forwards;
                  animation-delay: 1.4s;
                }
                .animate-draw-arrow-head {
                  stroke-dasharray: 50;
                  stroke-dashoffset: 50;
                  animation: drawStroke 0.2s ease-out forwards;
                  animation-delay: 1.9s;
                }
              `}</style>
              <div className="flex flex-col sm:flex-row items-center gap-4 relative z-10">
                {btnText && (
                  <Link href={btnLink || "#"} className="agency-btn-primary">
                    {btnText}
                  </Link>
                )}
                {secondaryBtnText && (
                  <Link href={secondaryBtnLink || "#"} className="agency-btn-secondary">
                    {secondaryBtnText}
                  </Link>
                )}
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column: Illustration/Image/Components */}
          <div className="relative w-full h-[450px] md:h-[650px] lg:h-[750px] flex items-center justify-center lg:translate-x-24 xl:translate-x-32 2xl:translate-x-48">
            {(floatingImages && floatingImages.length > 0) || !rightImage ? (
              // Floating Components View (Uses local fallback if no WP gallery provided)
              <div className="w-full h-full relative">
                {/* Optional background / featured image behind the floating items */}
                {rightImage && (
                  <ScrollReveal delay={200} className="absolute inset-0 opacity-20">
                    <Image src={rightImage} alt="Background" fill className="object-contain" sizes="(max-width: 768px) 100vw, 50vw" />
                  </ScrollReveal>
                )}

                {/* Floating Image 0: Base List Card (Center) */}
                {floatingImages[0] && (
                  <div className="absolute top-[5%] left-[5%] w-[90%] h-[90%] animate-float rounded-2xl z-10" style={{ animationDelay: '0s' }}>
                    <ScrollReveal delay={300} animation="pop-up" className="w-full h-full relative drop-shadow-2xl">
                      <Image src={floatingImages[0]} alt="Base Component" fill className="object-contain" />
                    </ScrollReveal>
                  </div>
                )}

                {/* Top Right Card (Profile) -> User uploaded as 4th image (index 3) */}
                {floatingImages[3] && (
                  <div className="absolute top-[0%] right-[10%] w-[40%] h-[45%] animate-float z-30" style={{ animationDelay: '1.2s' }}>
                    <ScrollReveal delay={500} animation="pop-up" className="w-full h-full relative drop-shadow-2xl">
                      <Image src={floatingImages[3]} alt="Top Right Component" fill className="object-contain" />
                    </ScrollReveal>
                  </div>
                )}

                {/* Bottom Left Card (Sales) -> User uploaded as 2nd image (index 1) */}
                {floatingImages[1] && (
                  <div className="absolute bottom-[0%] left-[5%] w-[45%] h-[45%] animate-float z-40" style={{ animationDelay: '0.5s' }}>
                    <ScrollReveal delay={700} animation="pop-up" className="w-full h-full relative drop-shadow-2xl">
                      <Image src={floatingImages[1]} alt="Bottom Left Component" fill className="object-contain" />
                    </ScrollReveal>
                  </div>
                )}

                {/* Envelope (Center Right) -> User uploaded as 3rd image (index 2) */}
                {floatingImages[2] && (
                  <div className="absolute bottom-[10%] right-[10%] w-[35%] h-[35%] animate-float z-20" style={{ animationDelay: '1.8s' }}>
                    <ScrollReveal delay={900} animation="pop-up" className="w-full h-full relative drop-shadow-xl">
                      <Image src={floatingImages[2]} alt="Envelope Component" fill className="object-contain" />
                    </ScrollReveal>
                  </div>
                )}
              </div>
            ) : (
              // Fallback to simple featured image
              <ScrollReveal delay={400} className="w-full h-full relative">
                {rightImage ? (
                  <Image src={rightImage} alt="Hero Graphic" fill className="object-contain" sizes="(max-width: 768px) 100vw, 50vw" priority />
                ) : (
                  <div className="w-full h-full border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center bg-gray-50/50">
                    <p className="text-gray-400 text-sm">Add Gallery or Featured Image</p>
                  </div>
                )}
              </ScrollReveal>
            )}
          </div>
        </div>
      </div>

      {/* Logos Strip */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 md:px-12 mt-auto mb-4">
        {logos && logos.length > 0 ? (
          <ScrollReveal delay={500}>
            <div className="flex flex-wrap justify-center md:justify-between items-center gap-8 md:gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-300">
              {logos.map((logo, idx) => (
                <div key={idx} className="relative h-10 w-28 md:w-36">
                  <Image src={logo} alt={`Logo ${idx + 1}`} fill className="object-contain" />
                </div>
              ))}
            </div>
          </ScrollReveal>
        ) : techStack && techStack.length > 0 ? (
          <div className="flex justify-center w-full opacity-90">
            <div 
              className="flex flex-wrap justify-center items-center gap-8 md:gap-16 px-10 py-6 md:px-16 md:py-8 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.05)] rounded-2xl transition-all"
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                border: "1px solid var(--color-brand-primary, #22c55e)"
              }}
            >
              {techStack.map((item, idx) => (
                <div key={idx} className="font-medium text-sm md:text-base tracking-widest uppercase" style={{ color: "var(--color-text-primary, #000000)" }}>
                  {item}
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
