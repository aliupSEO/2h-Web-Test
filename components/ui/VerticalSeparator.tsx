
/**
 * components/ui/VerticalSeparator.tsx
 *
 * A small vertical green line used as a section separator.
 */
import React from "react";

export default function VerticalSeparator() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-[180px] pb-8 animate-fade-slide-up">
      <div 
        className="w-[1.5px] h-[50px]"
        style={{ background: "var(--color-brand-primary, #b6ef00)" }}
      />
    </div>
  );
}
