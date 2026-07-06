"use client";

import Image from "next/image";
import { useState } from "react";
import { PortfolioPageData } from "@/lib/graphql";

export default function PortfolioPageSection({ data }: { data: PortfolioPageData }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(data.items.length / itemsPerPage);
  
  const currentItems = data.items.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      <section className="relative w-full min-h-screen flex items-center bg-brand-card">
        {/* Hero Background */}
        <div 
          className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: data.imageUrl ? `url(${data.imageUrl})` : 'none' }}
        >
          {/* Hardcode black overlay so it always stays dark regardless of WP theme */}
          <div className="absolute inset-0 bg-[#000000]/60 backdrop-grayscale"></div>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 w-full px-6 md:px-12 lg:px-24 pt-32 pb-24">
          <div className="max-w-7xl mx-auto">
            <div className="animate-fade-slide-up max-w-4xl">
              <div className="mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-none" style={{ background: "var(--color-brand-primary, #b6ef00)" }}></span>
                <span className="text-[15px] md:text-[17px] leading-[30px] tracking-[1.4px] uppercase font-sans font-normal text-[var(--color-brand-accent,#ffffff)]">
                  {data.subtitle}
                </span>
              </div>
              <h1 className="text-[40px] md:text-[76px] leading-[1.2] md:leading-[99px] md:tracking-[7.8px] font-sans font-normal text-[var(--color-brand-accent,#ffffff)] uppercase mb-10">
                {data.title}
              </h1>
              
              <a 
                href="/contact"
                className="inline-flex items-center justify-center px-6 md:px-8 py-4 md:py-5 rounded-full border border-[var(--color-brand-primary,#b6ef00)] bg-[#000000]/30 hover:bg-[var(--color-brand-primary,#b6ef00)] hover:text-[var(--color-brand-secondary,#101010)] transition-colors duration-300 font-sans font-normal uppercase text-[17px] md:text-[18px] leading-normal text-[#f0f0f0]"
                style={{ WebkitBackdropFilter: "blur(12px)", backdropFilter: "blur(12px)", borderColor: "var(--color-brand-primary,#b6ef00)" }}
              >
                Kostenloses Erstgespräch buchen
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Grid Section after the hero */}
      <section 
        className="text-text-primary py-24 md:py-32 px-6 md:px-12 lg:px-24 relative z-10"
        style={{ background: "var(--color-bg-primary, #F8FAFC)" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {currentItems.map((item, idx) => (
              <div 
                key={`${currentPage}-${idx}`} 
                className="group relative w-full aspect-[4/3] md:aspect-[16/11] lg:aspect-[3/2] bg-zinc-900 rounded-[32px] overflow-hidden animate-fade-slide-up shadow-xl flex flex-col justify-end"
                style={{ animationDelay: `${(idx % 4) * 100}ms` }}
              >
                {/* Background Image */}
                <Image 
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                
                {/* Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none z-10"></div>

                <div className="relative z-20 p-6 md:p-8 flex flex-col justify-end h-full w-[calc(100%-80px)] pointer-events-none">
                   <h3 className="text-[var(--color-text-light,#ffffff)] text-[18px] md:text-[22px] tracking-widest uppercase font-sans drop-shadow-lg">
                     {item.title}
                   </h3>
                </div>

                {(() => {
                  const lowerTitle = item.title.toLowerCase();
                  let targetLink = item.link;
                  
                  const isMozarthaus = lowerTitle.includes("mozarthaus");
                  const isJumpinPrater = lowerTitle.includes("jumpin prater");
                  const isPanamatura = lowerTitle.includes("panamatura");
                  
                  const hasProjectPage = isMozarthaus || isJumpinPrater || isPanamatura;

                  // The user wants the arrow ONLY on the 3 specific cards (which have project pages)
                  // and NOT on any other cards (like Diskont Depot, Jumpin Warrior, or Shimale Peleg)
                  return hasProjectPage && (
                    <div 
                      className="absolute bottom-0 right-0 rounded-tl-[32px] w-[80px] h-[80px] md:w-[88px] md:h-[88px] z-30 flex items-center justify-center"
                      style={{ background: "var(--color-bg-primary, #F8FAFC)" }}
                    >
                    {/* Inverse Corner - Top */}
                    <svg className="absolute bottom-full right-0 w-[24px] h-[24px] pointer-events-none" viewBox="0 0 100 100" fill="currentColor" preserveAspectRatio="none" style={{ color: "var(--color-bg-primary, #F8FAFC)" }}>
                      <path d="M100 100 V0 C100 55.23 55.23 100 0 100 H100 Z" />
                    </svg>
                    {/* Inverse Corner - Left */}
                    <svg className="absolute bottom-0 right-full w-[24px] h-[24px] pointer-events-none" viewBox="0 0 100 100" fill="currentColor" preserveAspectRatio="none" style={{ color: "var(--color-bg-primary, #F8FAFC)" }}>
                      <path d="M100 100 V0 C100 55.23 55.23 100 0 100 H100 Z" />
                    </svg>
                    
                    {targetLink ? (
                      <a href={targetLink} className="relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-[var(--color-brand-secondary,#111111)] overflow-hidden group/btn shadow-md">
                         {/* Hover Background (Green) */}
                         <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: "var(--color-brand-primary, #b6ef00)" }}></div>
                         
                         {/* Green Arrow (Default) */}
                         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute z-10 transition-all duration-300 group-hover:opacity-0 group-hover/btn:-translate-y-1 group-hover/btn:translate-x-1" style={{ color: "var(--color-brand-primary, #b6ef00)" }}>
                            <line x1="7" y1="17" x2="17" y2="7"></line>
                            <polyline points="7 7 17 7 17 17"></polyline>
                         </svg>

                         {/* Black Arrow (On Hover) */}
                         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute z-10 transition-all duration-300 opacity-0 group-hover:opacity-100 group-hover/btn:-translate-y-1 group-hover/btn:translate-x-1">
                            <line x1="7" y1="17" x2="17" y2="7"></line>
                            <polyline points="7 7 17 7 17 17"></polyline>
                         </svg>
                      </a>
                    ) : (
                      <div className="relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-[var(--color-brand-secondary,#111111)] overflow-hidden group/btn cursor-pointer shadow-md">
                         {/* Hover Background (Green) */}
                         <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: "var(--color-brand-primary, #b6ef00)" }}></div>
                         
                         {/* Green Arrow (Default) */}
                         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute z-10 transition-all duration-300 group-hover:opacity-0 group-hover/btn:-translate-y-1 group-hover/btn:translate-x-1" style={{ color: "var(--color-brand-primary, #b6ef00)" }}>
                            <line x1="7" y1="17" x2="17" y2="7"></line>
                            <polyline points="7 7 17 7 17 17"></polyline>
                         </svg>

                         {/* Black Arrow (On Hover) */}
                         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute z-10 transition-all duration-300 opacity-0 group-hover:opacity-100 group-hover/btn:-translate-y-1 group-hover/btn:translate-x-1">
                            <line x1="7" y1="17" x2="17" y2="7"></line>
                            <polyline points="7 7 17 7 17 17"></polyline>
                         </svg>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-16 md:mt-24 animate-fade-slide-up">
              {/* Prev Button */}
              {currentPage > 1 && (
                <button 
                  onClick={() => {
                    setCurrentPage(prev => prev - 1);
                    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
                  }}
                  className="w-12 h-12 rounded-full flex items-center justify-center font-medium text-[15px] transition-colors bg-zinc-100 text-zinc-900 hover:bg-zinc-200 cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}

              {/* Page Numbers */}
              {Array.from({ length: totalPages }).map((_, i) => (
                <button 
                  key={i}
                  onClick={() => {
                    setCurrentPage(i + 1);
                    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
                  }}
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-medium text-[15px] transition-colors ${
                    currentPage === i + 1 
                      ? 'cursor-default' 
                      : 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200 cursor-pointer'
                  }`}
                  style={currentPage === i + 1 ? { background: "var(--color-brand-primary, #b6ef00)", color: "#111" } : {}}
                >
                  {i + 1}
                </button>
              ))}

              {/* Next Button */}
              {currentPage < totalPages && (
                <button 
                  onClick={() => {
                    setCurrentPage(prev => prev + 1);
                    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
                  }}
                  className="w-12 h-12 rounded-full flex items-center justify-center font-medium text-[15px] transition-colors bg-zinc-100 text-zinc-900 hover:bg-zinc-200 cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>
          )}

          {/* Vertical brand line separator */}
          <div className="flex justify-center mt-16 md:mt-24 -mb-[128px]">
            <div 
              className="w-[1px] h-[50px] md:h-[60px]" 
              style={{ background: "var(--color-brand-primary, #b6ef00)" }}
            ></div>
          </div>

        </div>
      </section>
    </>
  );
}
