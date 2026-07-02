"use client";

import React from "react";

interface TickerSectionProps {
  /** Array of phrases to display in the ticker */
  items?: string[];
  /** Full string of items separated by spaces (fallback if array is not used) */
  text?: string;
}

export default function TickerSection({ items, text }: TickerSectionProps) {
  // If we receive a raw string, split it by newlines or double spaces
  const parsedItems = items || (text ? text.split(/\n+|\s{2,}/).map(s => s.trim()).filter(Boolean) : []);

  if (!parsedItems.length) return null;

  // Duplicate items array a few times to ensure it's long enough to fill the screen seamlessly
  const tickerItems = [...parsedItems, ...parsedItems, ...parsedItems, ...parsedItems, ...parsedItems];

  return (
    <section className="relative w-full overflow-hidden py-8" style={{ background: "var(--color-ticker-bg, #f4f4f5)" }}>
      {/* Inline styles for the marquee animation */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes ticker-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker {
          display: flex;
          width: max-content;
          animation: ticker-marquee 60s linear infinite;
        }
      `}} />
      
      <div className="flex animate-ticker items-center">
        {tickerItems.map((item, index) => (
          <React.Fragment key={index}>
            <span 
              className="mx-8 text-[24px] leading-[28.8px] font-sans tracking-[2px] uppercase whitespace-nowrap"
              style={{ color: "var(--color-ticker-text, #101010)" }}
            >
              {item}
            </span>
            {/* The asterisk icon from the screenshot */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
              <path d="M12 2L12 22M2 12L22 12M4.92893 4.92893L19.0711 19.0711M4.92893 19.0711L19.0711 4.92893" stroke="var(--color-brand-primary, #b6ef00)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}
