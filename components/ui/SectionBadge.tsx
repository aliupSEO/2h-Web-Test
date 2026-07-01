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

import React from "react";

interface SectionBadgeProps {
  /** Badge label text (from WordPress) */
  label: string;
  /** Color variant — "dark" for dark backgrounds, "light" for white backgrounds */
  variant?: "dark" | "light";
  /** Optional override classes */
  className?: string;
}

export default function SectionBadge({ label, variant = "dark", className = "" }: SectionBadgeProps) {
  const dotColor = "var(--color-brand-primary, #b6ef00)";
  const textColor = variant === "dark" 
    ? "var(--color-text-light, #ffffff)" 
    : "var(--color-text-primary, #101010)";

  return (
    <div className={`flex items-center gap-2 mb-4 animate-fade-slide-up ${className}`}>
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ background: dotColor }}
      ></span>
      <span 
        className="text-[12px] uppercase tracking-[3px] font-sans font-medium"
        style={{ color: textColor }}
        suppressHydrationWarning
      >
        {label}
      </span>
    </div>
  );
}
