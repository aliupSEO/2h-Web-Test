"use client";

import React, { useState } from "react";
import SectionBadge from "@/components/ui/SectionBadge";
import VerticalSeparator from "@/components/ui/VerticalSeparator";
import { ArrowRight, ArrowDown } from "lucide-react";

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
    <section className="pb-24 pt-0 px-6 md:px-12 lg:px-24 bg-white relative">
      <div className="max-w-[800px] mx-auto">
        <div className="text-center mb-12 animate-fade-slide-up">
          <VerticalSeparator />
          {data.subtitle && (
            <div className="flex justify-center items-center gap-2 mb-4">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--color-brand-primary, #b6ef00)" }}></span>
              <span 
                className="text-[17px] leading-[29.8px] font-normal uppercase"
                style={{ fontFamily: "var(--font-federo)", color: "#101010" }}
                suppressHydrationWarning
              >
                {data.subtitle}
              </span>
            </div>
          )}
          
          <h2 
            className="text-[32px] md:text-[46px] leading-[1.1] md:leading-[59.8px] font-normal mt-6 uppercase text-center mx-auto"
            style={{ fontFamily: "var(--font-federo)", color: "#101010" }}
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
                className="rounded-[16px] overflow-hidden transition-all duration-300"
                style={{ background: "#f4f4f5" }}
              >
                <button 
                  onClick={() => toggleFaq(index)}
                  className={`w-full text-left p-6 md:p-8 flex items-center justify-between gap-4 focus:outline-none cursor-pointer transition-colors duration-300 ${isOpen ? 'bg-[#101010]' : 'bg-[#f4f4f5]'}`}
                >
                  <h3 
                    className="text-[17px] font-normal uppercase tracking-[1px] transition-colors duration-300"
                    style={{ 
                      fontFamily: "var(--font-federo)", 
                      color: isOpen ? "#ffffff" : "#101010",
                      lineHeight: isOpen ? "20px" : "29.8px"
                    }}
                  >
                    {faq.question}
                  </h3>
                  
                  <div 
                    className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-transform duration-300`}
                    style={{ backgroundColor: "var(--color-brand-primary, #b6ef00)" }}
                  >
                    {isOpen ? (
                      <ArrowDown size={18} className="text-[#101010]" />
                    ) : (
                      <ArrowRight size={18} className="text-[#101010]" />
                    )}
                  </div>
                </button>
                
                <div 
                  className={`px-6 md:px-8 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100 py-8' : 'max-h-0 opacity-0 py-0'}`}
                >
                  <p 
                    className="text-[17px] leading-[29.8px] font-normal"
                    style={{ fontFamily: "var(--font-barlow)", color: "#727272" }}
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
