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
import ScrollReveal from "@/components/ui/ScrollReveal";
import { Federo } from 'next/font/google';

const federo = Federo({ weight: '400', subsets: ['latin'] });

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
  /** Whether this is the home page, applies special typography */
  isHomePage?: boolean;
}

export default function HeroSection({
  title,
  subtitle,
  backgroundImage,
  cta,
  description,
  align = "left",
  bulletPoints,
  isHomePage = false,
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
            Set your endpoint in <code className="bg-[#ffffff]/10 px-1 rounded text-xs">.env.local</code> and
            ensure a page with slug <code className="bg-[#ffffff]/10 px-1 rounded text-xs">home</code> exists.
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
            quality={100}
            unoptimized={true}
            sizes="100vw"
            className="object-cover object-center grayscale"
            suppressHydrationWarning
          />
          <div className="absolute inset-0 bg-[#000000]/45" />
        </div>
      )}

      {/* Content */}
      <div className={`relative z-10 max-w-7xl mx-auto w-full px-6 sm:px-10 md:px-16 mt-24 ${align === "center" ? "flex flex-col items-center text-center" : ""}`}>
        {/* Subtitle badge */}
        {subtitle && (
          <ScrollReveal delay={100} className={`mb-4 flex items-center gap-2 uppercase ${align === "center" ? "justify-center" : ""} ${isHomePage ? "" : "text-sm sm:text-[14px] font-medium tracking-[2.5px]"}`}>
            <span
              className="h-1.5 w-1.5 rounded-full flex-shrink-0"
              style={{ background: "var(--color-brand-primary, #b6ef00)" }}
            />
            <span 
              className={isHomePage ? `font-[family-name:var(--font-family-primary,'Federo',sans-serif)] text-[14px] md:text-[17px] leading-[29.8px] tracking-[1.4px] text-[var(--color-text-light,#ffffff)] uppercase` : "font-sans uppercase"} 
              style={isHomePage ? undefined : { color: "var(--color-text-light, #ffffff)" }} 
              suppressHydrationWarning
            >
              {subtitle}
            </span>
          </ScrollReveal>
        )}

        {/* Main Heading */}
        <ScrollReveal delay={200}>
          <h1
            className={isHomePage 
              ? `font-[family-name:var(--font-family-primary,'Federo',sans-serif)] text-[40px] md:text-[76px] leading-[1.2] md:leading-[98.8px] tracking-[4px] md:tracking-[7.8px] font-normal uppercase text-[var(--color-text-light,#ffffff)] ${description ? "mb-4" : "mb-10"} max-w-[900px] ${align === "center" ? "mx-auto text-center" : "text-left"}`
              : `text-[40px] md:text-[55px] leading-[1.2] md:leading-[66px] font-normal uppercase font-sans tracking-wide ${description ? "mb-4" : "mb-10"} max-w-[900px] ${align === "center" ? "mx-auto text-center" : "text-left"}`
            }
            style={isHomePage ? undefined : { color: "var(--color-text-light, #ffffff)" }}
            suppressHydrationWarning
            dangerouslySetInnerHTML={{ __html: title || "" }}
          />
        </ScrollReveal>

        {/* Description */}
        {description && (
          <ScrollReveal delay={300}>
            <p
              className={`text-[18px] md:text-[22px] leading-[1.5] md:leading-[30.8px] font-normal font-sans mb-8 max-w-[800px] whitespace-pre-line ${align === "center" ? "mx-auto text-center" : "text-left"}`}
              style={{ color: "var(--color-text-light, #ffffff)" }}
              suppressHydrationWarning
            >
              {description}
            </p>
          </ScrollReveal>
        )}

        {/* CTA Button */}
        <ScrollReveal delay={400} className={`flex flex-wrap gap-4 mt-8 ${align === "center" ? "justify-center" : ""}`}>
          {cta ? (
            <Link
              href={cta.href}
              className={isHomePage 
                ? `inline-flex items-center justify-center px-12 md:px-[60px] py-4 md:py-[22px] rounded-full border border-[var(--color-brand-primary,#b6ef00)] bg-[#000000]/30 font-[family-name:var(--font-family-primary,'Federo',sans-serif)] font-normal text-[15px] leading-[15px] uppercase tracking-[0px] text-[var(--color-text-light,#ffffff)] hover:bg-[var(--color-brand-primary,#b6ef00)] hover:text-[var(--color-brand-secondary,#101010)] transition-colors duration-300`
                : "inline-flex items-center justify-center px-12 md:px-[60px] py-4 md:py-[22px] rounded-full border border-[var(--color-brand-primary,#b6ef00)] bg-[#000000]/30 text-[var(--color-text-light,#ffffff)] font-sans font-normal text-[15px] leading-[15px] uppercase tracking-wide hover:bg-[var(--color-brand-primary,#b6ef00)] hover:text-[var(--color-brand-secondary,#101010)] transition-colors duration-300"
              }
              style={{ WebkitBackdropFilter: "blur(12px)", backdropFilter: "blur(12px)" }}
              suppressHydrationWarning
            >
              {cta.text}
            </Link>
          ) : (
            <span 
              className={isHomePage
                ? `inline-flex items-center justify-center px-12 md:px-[60px] py-4 md:py-[22px] rounded-full border border-[var(--color-brand-primary,#b6ef00)] bg-[#000000]/30 font-[family-name:var(--font-family-primary,'Federo',sans-serif)] font-normal text-[15px] leading-[15px] uppercase tracking-[0px] text-[var(--color-text-light,#ffffff)] hover:bg-[var(--color-brand-primary,#b6ef00)] hover:text-[var(--color-brand-secondary,#101010)] transition-colors duration-300 cursor-pointer`
                : "inline-flex items-center justify-center px-12 md:px-[60px] py-4 md:py-[22px] rounded-full border border-[var(--color-brand-primary,#b6ef00)] bg-[#000000]/30 text-[var(--color-text-light,#ffffff)] font-sans font-normal text-[15px] leading-[15px] uppercase tracking-wide hover:bg-[var(--color-brand-primary,#b6ef00)] hover:text-[var(--color-brand-secondary,#101010)] transition-colors duration-300 cursor-pointer"
              }
              style={{ WebkitBackdropFilter: "blur(12px)", backdropFilter: "blur(12px)" }}
              suppressHydrationWarning
            >
              DIGITALE LÖSUNGEN
            </span>
          )}
        </ScrollReveal>

        {/* Bullet Points */}
        {bulletPoints && bulletPoints.length > 0 && (
          <ScrollReveal delay={500} className={`mt-6 flex flex-wrap items-center gap-6 ${align === "center" ? "justify-center" : ""}`}>
            {bulletPoints.map((point, i) => (
              <div key={i} className="flex items-center gap-2">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                  <path d="M10 3L4.5 8.5L2 6" stroke="var(--color-brand-primary, #b6ef00)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-[17px] leading-[29.8px] font-serif font-normal" style={{ color: "#D3D3D3" }} suppressHydrationWarning>
                  {point}
                </span>
              </div>
            ))}
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}
