/**
 * components/sections/HeroSection.tsx
 *
 * Reusable hero banner section.
 * Receives ALL data via props — never fetches its own data.
 *
 * Usage:
 *   <HeroSection
 *     title={page.title}
 *     subtitle={page.seo?.description}
 *     backgroundImage={page.featuredImage?.node?.sourceUrl}
 *   />
 */

import Image from "next/image";

interface HeroSectionProps {
  /** Main heading text (from WordPress page title) */
  title: string;
  /** Subtitle / tagline (from WordPress SEO description or content) */
  subtitle?: string;
  /** Background image URL (from WordPress featured image) */
  backgroundImage?: string;
  /** Optional call-to-action button */
  cta?: {
    text: string;
    href: string;
  };
}

export default function HeroSection({
  title,
  subtitle,
  backgroundImage,
  cta,
}: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex flex-col justify-center items-start px-6 md:px-16 lg:px-32 py-20 bg-black overflow-hidden border-b border-brand-border">
      {/* Background Image */}
      {backgroundImage && (
        <div className="absolute inset-0 z-0">
          <Image
            src={backgroundImage}
            alt={title}
            fill
            priority
            className="object-cover object-center filter grayscale"
          />
          <div className="absolute inset-0 bg-black/45" />
        </div>
      )}

      {/* Radial Glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 20% 50%, rgba(34,197,94,0.12) 0%, transparent 80%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-5xl w-full mt-24">
        {subtitle && (
          <div className="mb-6 flex items-center gap-2 text-xs sm:text-sm font-medium tracking-[2.5px] text-white uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-green flex-shrink-0" />
            {subtitle}
          </div>
        )}

        <h1 className="text-5xl sm:text-7xl lg:text-[76px] uppercase tracking-[4px] sm:tracking-[7.8px] text-white leading-[1.3] mb-10 drop-shadow-lg max-w-4xl font-bold">
          {title}
        </h1>

        {cta && (
          <div className="flex flex-wrap gap-4 mt-6">
            <a
              href={cta.href}
              className="inline-block px-10 py-4 bg-transparent border border-brand-green hover:bg-brand-green hover:text-black text-white text-[13px] font-semibold uppercase tracking-[1.5px] rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl bg-black/20 backdrop-blur-sm"
            >
              {cta.text}
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
