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
  /** Optional description text under the title */
  description?: string;
  /** Text alignment */
  align?: "left" | "center";
  /** Optional bullet points below the CTA */
  bulletPoints?: string[];
}

export default function HeroSection({
  title,
  subtitle,
  backgroundImage,
  cta,
  description,
  align = "left",
  bulletPoints,
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
      className="relative min-h-screen flex flex-col justify-center items-center py-20 overflow-hidden"
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
            suppressHydrationWarning
          />
          <div className="absolute inset-0 bg-black/45" />
        </div>
      )}

      {/* Content */}
      <div className={`relative z-10 max-w-7xl mx-auto w-full px-6 sm:px-10 md:px-16 mt-24 ${align === "center" ? "flex flex-col items-center text-center" : ""}`}>
        {/* Subtitle badge */}
        {subtitle && (
          <div className={`mb-4 flex items-center gap-2 text-sm sm:text-[14px] font-medium tracking-[2.5px] uppercase animate-fade-slide-up ${align === "center" ? "justify-center" : ""}`}>
            <span
              className="h-1.5 w-1.5 rounded-full flex-shrink-0"
              style={{ background: "var(--color-brand-primary, #b6ef00)" }}
            />
            <span className="font-sans uppercase" style={{ color: "var(--color-text-light, #ffffff)" }} suppressHydrationWarning>
              {subtitle}
            </span>
          </div>
        )}

        {/* Main Heading */}
        <h1
          className={`animate-fade-slide-up animation-delay-200 text-[40px] md:text-[76px] leading-[1.2] md:leading-[99px] font-normal uppercase font-sans tracking-wide ${description ? "mb-4" : "mb-10"} max-w-[720px] ${align === "center" ? "mx-auto" : ""}`}
          style={{ color: "var(--color-text-light, #ffffff)" }}
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: title || "" }}
        />

        {/* Description */}
        {description && (
          <p
            className={`animate-fade-slide-up animation-delay-300 text-[18px] md:text-[22px] leading-[1.5] md:leading-[31px] font-medium font-sans mb-8 max-w-[640px] whitespace-pre-line ${align === "center" ? "mx-auto" : ""}`}
            style={{ color: "var(--color-text-light, #ffffff)" }}
            suppressHydrationWarning
          >
            {description}
          </p>
        )}

        {/* CTA Button */}
        <div className={`flex flex-wrap gap-4 mt-8 animate-fade-slide-up animation-delay-300 ${align === "center" ? "justify-center" : ""}`}>
          {cta ? (
            <Link
              href={cta.href}
              className="inline-flex items-center justify-center px-12 md:px-[60px] py-4 md:py-[22px] rounded-full border border-[var(--color-brand-primary,#b6ef00)] bg-transparent text-white font-sans font-medium text-[15px] leading-[15px] uppercase tracking-wide hover:bg-[var(--color-brand-primary,#b6ef00)] hover:text-[#101010] transition-colors duration-300"
              suppressHydrationWarning
            >
              {cta.text}
            </Link>
          ) : (
            <span 
              className="inline-flex items-center justify-center px-12 md:px-[60px] py-4 md:py-[22px] rounded-full border border-[var(--color-brand-primary,#b6ef00)] bg-transparent text-white font-sans font-medium text-[15px] leading-[15px] uppercase tracking-wide hover:bg-[var(--color-brand-primary,#b6ef00)] hover:text-[#101010] transition-colors duration-300 cursor-pointer"
              suppressHydrationWarning
            >
              DIGITALE LÖSUNGEN
            </span>
          )}
        </div>

        {/* Bullet Points */}
        {bulletPoints && bulletPoints.length > 0 && (
          <div className={`mt-6 flex flex-wrap items-center gap-6 animate-fade-slide-up animation-delay-[500ms] ${align === "center" ? "justify-center" : ""}`}>
            {bulletPoints.map((point, i) => (
              <div key={i} className="flex items-center gap-2">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                  <path d="M10 3L4.5 8.5L2 6" stroke="var(--color-brand-primary, #b6ef00)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-sm font-sans tracking-wide" style={{ color: "var(--color-text-light, #ffffff)" }} suppressHydrationWarning>
                  {point}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
