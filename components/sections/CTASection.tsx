/**
 * components/sections/CTASection.tsx
 *
 * Call-to-action section with background image.
 * Receives ALL data via props — never fetches its own data.
 */

import Image from "next/image";

interface CTASectionProps {
  /** Section badge / subtitle */
  badge?: string;
  /** Main heading */
  title: string;
  /** Description text or HTML */
  description?: string;
  /** Whether description is HTML (use dangerouslySetInnerHTML) */
  descriptionIsHtml?: boolean;
  /** Background image URL */
  backgroundImage?: string;
  /** CTA button */
  cta?: {
    text: string;
    href: string;
    external?: boolean;
  };
  /** Optional perks list below button */
  perks?: string[];
}

export default function CTASection({
  badge,
  title,
  description,
  descriptionIsHtml,
  backgroundImage,
  cta,
  perks,
}: CTASectionProps) {
  return (
    <section className="relative py-32 px-6 md:px-16 lg:px-24 bg-black overflow-hidden border-t border-zinc-900">
      {/* Green separator */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="w-[1.5px] h-12 bg-brand-green" />
      </div>

      {/* Background Image */}
      {backgroundImage && (
        <div className="absolute inset-0 z-0">
          <Image
            src={backgroundImage}
            alt={title}
            fill
            className="object-cover object-center filter grayscale"
          />
          <div className="absolute inset-0 bg-black/45" />
        </div>
      )}

      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
        {badge && (
          <div className="flex items-center gap-2 mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-green flex-shrink-0" />
            <span className="text-brand-green text-xs sm:text-sm uppercase tracking-[2.5px] font-medium">
              {badge}
            </span>
          </div>
        )}

        <h2 className="text-3xl sm:text-[48px] lg:text-[54px] uppercase tracking-[1.5px] leading-[1.1] font-medium text-white mb-8">
          {title}
        </h2>

        {description &&
          (descriptionIsHtml ? (
            <div
              className="text-zinc-200 text-sm sm:text-base lg:text-lg max-w-3xl mb-12 leading-relaxed font-medium"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          ) : (
            <p className="text-zinc-200 text-sm sm:text-base lg:text-lg max-w-3xl mb-12 leading-relaxed font-medium">
              {description}
            </p>
          ))}

        {cta && (
          <a
            href={cta.href}
            target={cta.external ? "_blank" : undefined}
            rel={cta.external ? "noopener noreferrer" : undefined}
            className="inline-block px-10 py-4 bg-transparent border border-brand-green hover:bg-brand-green hover:text-black text-white text-[13px] font-semibold uppercase tracking-[1.5px] rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl bg-black/20 backdrop-blur-sm"
          >
            {cta.text}
          </a>
        )}

        {perks && perks.length > 0 && (
          <div className="mt-12 flex flex-wrap justify-center items-center gap-x-8 gap-y-4 text-zinc-300 text-xs sm:text-sm uppercase tracking-[2px] font-medium">
            {perks.map((perk, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span className="text-brand-green font-bold text-lg leading-none">*</span>
                {perk}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
