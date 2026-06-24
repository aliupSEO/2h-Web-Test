/**
 * components/ui/SectionTitle.tsx
 *
 * Reusable section heading component.
 * Renders large uppercase titles consistent with the brand style.
 *
 * Usage:
 *   <SectionTitle text="Our Services" />
 *   <SectionTitle text="Ausgewählte Projekte" variant="light" />
 */

interface SectionTitleProps {
  /** Heading text (from WordPress) */
  text: string;
  /** Color variant — "dark" for dark backgrounds, "light" for white backgrounds */
  variant?: "dark" | "light";
  /** HTML tag to render (default: h2) */
  as?: "h1" | "h2" | "h3";
}

export default function SectionTitle({
  text,
  variant = "light",
  as: Tag = "h2",
}: SectionTitleProps) {
  const textColor = variant === "dark" ? "text-white" : "text-[rgb(16,16,16)]";

  return (
    <Tag
      className={`text-3xl sm:text-[40px] lg:text-[45px] font-serif font-normal uppercase tracking-[1.5px] leading-[1.1] lg:leading-[54px] ${textColor} mb-4`}
    >
      {text}
    </Tag>
  );
}
