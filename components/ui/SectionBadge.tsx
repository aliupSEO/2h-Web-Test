/**
 * components/ui/SectionBadge.tsx
 *
 * Reusable section subtitle badge with green dot indicator.
 * Used at the top of most page sections.
 *
 * Usage:
 *   <SectionBadge label="Our Services" />
 *   <SectionBadge label="Kundenstimmen" variant="light" />
 */

interface SectionBadgeProps {
  /** Badge label text (from WordPress) */
  label: string;
  /** Color variant — "dark" for dark backgrounds, "light" for white backgrounds */
  variant?: "dark" | "light";
}

export default function SectionBadge({ label, variant = "dark" }: SectionBadgeProps) {
  const textColor = variant === "dark" ? "text-white" : "text-[rgb(16,16,16)]";

  return (
    <div className="flex items-center gap-2 mb-2">
      <span className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: "var(--color-brand-primary, #b6ef00)" }} />
      <span
        className={`${textColor} text-[17px] leading-[30px] uppercase tracking-[2.5px] font-normal font-serif`}
      >
        {label}
      </span>
    </div>
  );
}
