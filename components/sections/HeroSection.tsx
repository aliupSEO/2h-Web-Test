/**
 * components/sections/HeroSection.tsx
 *
 * Reusable hero banner section.
 * Receives ALL data via props — never fetches its own data.
 * Shows elegant placeholder state when no WordPress data is provided.
 * Colors from CSS variables (Design System plugin) with generic dark fallbacks.
 *
 * Usage:
 *   <HeroSection
 *     title={page.title}
 *     subtitle={page.seo?.description}
 *     backgroundImage={page.featuredImage?.node?.sourceUrl}
 *     cta={{ text: "Learn More", href: "#services" }}
 *   />
 */

import Image from "next/image";
import Link from "next/link";

interface HeroSectionProps {
  /** Main heading text (from WordPress page title) */
  title?: string;
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
  const hasData = !!title;

  if (!hasData) {
    return (
      <section
        className="relative min-h-screen flex flex-col justify-center items-center px-6 md:px-16 lg:px-32 py-20 overflow-hidden"
        style={{ background: "var(--color-bg-dark, #0a0a0a)" }}
      >
        <div className="text-center max-w-md">
          <p
            className="text-2xl font-bold mb-3"
            style={{ color: "var(--color-brand-primary, #22c55e)" }}
          >
            WordPress Connection Needed
          </p>
          <p
            className="text-sm leading-relaxed"
            style={{ color: "var(--color-brand-muted, #6b7280)" }}
          >
            Set your endpoint in <code className="bg-white/10 px-1 rounded text-xs">.env.local</code> and
            ensure a page with slug <code className="bg-white/10 px-1 rounded text-xs">home</code> exists.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      className="relative min-h-screen flex flex-col justify-center items-start px-6 md:px-16 lg:px-32 py-20 overflow-hidden"
      style={{ background: "var(--color-bg-dark, #0a0a0a)" }}
    >
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
            `radial-gradient(ellipse 60% 60% at 20% 50%, color-mix(in srgb, var(--color-brand-primary, #22c55e) 12%, transparent) 0%, transparent 80%)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-5xl w-full mt-24">
        {/* Subtitle badge */}
        {subtitle && (
          <div className="mb-6 flex items-center gap-2 text-xs sm:text-sm font-medium tracking-[2.5px] uppercase animate-fade-slide-up">
            <span
              className="h-1.5 w-1.5 rounded-full flex-shrink-0"
              style={{ background: "var(--color-brand-primary, #22c55e)" }}
            />
            <span className="font-sans" style={{ color: "var(--color-text-light, #ffffff)" }}>
              {subtitle}
            </span>
          </div>
        )}

        {/* Main Heading */}
        <h1
          className="animate-fade-slide-up animation-delay-200 text-4xl sm:text-6xl lg:text-[70px] leading-[1.15] mb-10 max-w-4xl font-serif"
          style={{ color: "var(--color-text-light, #ffffff)" }}
        >
          {title}
        </h1>

        {/* CTA Button */}
        <div className="flex flex-wrap gap-4 mt-6 animate-fade-slide-up animation-delay-300">
          {cta ? (
            <Link
              href={cta.href}
              className="inline-flex items-center justify-center px-8 py-3 rounded-full border border-[#b6ef00] text-white font-sans uppercase tracking-[2px] text-[13px] hover:bg-[#b6ef00] hover:text-black transition-colors"
            >
              {cta.text}
            </Link>
          ) : (
            <span className="inline-flex items-center justify-center px-8 py-3 rounded-full border border-[#b6ef00] text-white font-sans uppercase tracking-[2px] text-[13px] hover:bg-[#b6ef00] hover:text-black transition-colors cursor-pointer">
              DIGITALE LÖSUNGEN
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
