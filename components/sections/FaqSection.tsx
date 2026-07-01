"use client";

import React, { useState } from "react";
import SectionBadge from "@/components/ui/SectionBadge";

export interface FaqItemData {
  question: string;
  answer: string;
}

export interface FaqSectionData {
  subtitle?: string;
  title: string;
  faqs: FaqItemData[];
}

interface FaqSectionProps {
  data: FaqSectionData;
}

export default function FaqSection({ data }: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!data || !data.faqs || data.faqs.length === 0) return null;

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 px-6 md:px-12 lg:px-24 bg-white relative">
      <div className="max-w-[800px] mx-auto">
        <div className="text-center mb-12 animate-fade-slide-up">
          {data.subtitle && <SectionBadge label={data.subtitle} variant="light" className="mx-auto" />}
          
          <h2 
            className="text-4xl md:text-[45px] leading-[1.2] font-serif font-normal mt-6 tracking-wide text-text-primary uppercase mx-auto"
            suppressHydrationWarning
          >
            {data.title}
          </h2>
        </div>

        <div className="flex flex-col gap-4 animate-fade-slide-up animation-delay-200">
          {data.faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            
            return (
              <div 
                key={index}
                className="bg-brand-card rounded-[16px] overflow-hidden transition-all duration-300"
              >
                <button 
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left p-6 md:p-8 flex items-center justify-between gap-4 focus:outline-none cursor-pointer"
                >
                  <h3 className="text-[14px] md:text-[16px] font-sans font-normal uppercase tracking-[1px] text-text-primary">
                    {faq.question}
                  </h3>
                  
                  <div 
                    className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}
                    style={{ backgroundColor: "var(--color-brand-primary, #a3e635)" }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-text-primary" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14"></path>
                      <path d="m12 5 7 7-7 7"></path>
                    </svg>
                  </div>
                </button>
                
                <div 
                  className={`px-6 md:px-8 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100 pb-8' : 'max-h-0 opacity-0 pb-0'}`}
                >
                  <p 
                    className="text-text-secondary text-[16px] leading-[28px] font-normal"
                    dangerouslySetInnerHTML={{ __html: faq.answer }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
