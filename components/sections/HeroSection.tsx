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
            <span style={{ color: "var(--color-text-light, #ffffff)" }}>
              {subtitle}
            </span>
          </div>
        )}

        {/* Main Heading */}
        <h1
          className="animate-fade-slide-up animation-delay-200 text-5xl sm:text-7xl lg:text-[76px] uppercase tracking-[4px] sm:tracking-[7.8px] leading-[1.3] mb-10 drop-shadow-lg max-w-4xl font-bold"
          style={{ color: "var(--color-text-light, #ffffff)" }}
        >
          {title}
        </h1>

        {/* CTA Button */}
        <div className="flex flex-wrap gap-4 mt-6 animate-fade-slide-up animation-delay-300">
          {cta ? (
            <Link
              href={cta.href}
              className="group inline-flex items-center gap-3 shadow-xl hover:gap-5 hover:shadow-lg active:scale-95 btn-primary"
            >
              {cta.text}
              {/* Arrow */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-[18px] h-[18px] flex-shrink-0 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.2}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          ) : (
            <span
              className="inline-block px-10 py-4 border text-[13px] font-semibold uppercase tracking-[1.5px] rounded-full italic"
              style={{
                borderColor: "var(--input-border-color, #1f2937)",
                color: "var(--color-brand-muted, #6b7280)",
              }}
            >
              CTA Button — Set in WordPress
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
