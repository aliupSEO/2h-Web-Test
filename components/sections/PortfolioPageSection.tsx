"use client";

import Image from "next/image";
import { useState } from "react";
import { PortfolioPageData } from "@/lib/graphql";

export default function PortfolioPageSection({ data }: { data: PortfolioPageData }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;
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
          {/* Grayscale and dark overlay to match design */}
          <div className="absolute inset-0 bg-brand-dark/60 backdrop-grayscale"></div>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 w-full px-6 md:px-12 lg:px-24 pt-32 pb-24">
          <div className="max-w-7xl mx-auto">
            <div className="animate-fade-slide-up max-w-4xl">
              <div className="mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-none" style={{ background: "var(--color-brand-primary, #b6ef00)" }}></span>
                <span className="text-[14px] md:text-[15px] font-sans font-bold tracking-widest uppercase text-text-secondary">
                  {data.subtitle}
                </span>
              </div>
              <h1 className="text-[40px] md:text-[70px] lg:text-[80px] leading-[1.1] font-serif font-medium text-text-light uppercase mb-10">
                {data.title}
              </h1>
              
              <a 
                href="/contact" 
                className="btn-outline"
                style={{ borderColor: "var(--color-brand-primary, #b6ef00)", color: "inherit" }}
              >
                Kostenloses Erstgespräch buchen
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Grid Section after the hero */}
      <section className="bg-white text-text-primary py-24 md:py-32 px-6 md:px-12 lg:px-24 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {currentItems.map((item, idx) => (
              <div 
                key={`${currentPage}-${idx}`} 
                className="group relative w-full aspect-[16/10] animate-fade-slide-up"
                style={{ animationDelay: `${(idx % 4) * 100}ms` }}
              >
                {/* Image Container */}
                <div className="relative w-full h-full overflow-hidden rounded-[32px]">
                  <Image 
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                  
                  {/* Title */}
                  <div className="absolute bottom-8 left-8 md:bottom-10 md:left-10 pr-24">
                    <h4 className="text-text-light text-[20px] md:text-[24px] font-serif uppercase tracking-widest font-medium">
                      {item.title}
                    </h4>
                  </div>
                  
                  {/* The true gooey cutout for the button */}
                  {item.link && (
                    <div className="absolute bottom-0 right-0 bg-white rounded-tl-[32px] pl-3 pt-3 pb-0 pr-0">
                      {/* Top connector curve */}
                      <div 
                        className="absolute -top-[24px] right-0 w-[24px] h-[24px] pointer-events-none"
                        style={{ background: 'radial-gradient(circle at 0 0, transparent 24px, white 24px)' }}
                      ></div>
                      
                      {/* Left connector curve */}
                      <div 
                        className="absolute bottom-0 -left-[24px] w-[24px] h-[24px] pointer-events-none"
                        style={{ background: 'radial-gradient(circle at 0 0, transparent 24px, white 24px)' }}
                      ></div>

                      <a 
                        href={item.link}
                        className="w-[64px] h-[64px] bg-brand-card hover:bg-brand-dark rounded-full flex items-center justify-center transition-all duration-300 transform group-hover:-translate-y-1 group-hover:-translate-x-1"
                      >
                        <svg className="w-6 h-6 text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
                        </svg>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-16 md:mt-24 animate-fade-slide-up">
              {/* Prev Button */}
              <button 
                disabled={currentPage === 1}
                onClick={() => {
                  if (currentPage > 1) {
                    setCurrentPage(prev => prev - 1);
                    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
                  }
                }}
                className={`w-12 h-12 rounded-full flex items-center justify-center font-medium text-[15px] transition-colors ${
                  currentPage === 1 
                    ? 'bg-brand-card text-text-secondary cursor-default' 
                    : 'bg-brand-card text-text-secondary hover:bg-zinc-200 cursor-pointer'
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

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
                      ? 'hover:brightness-110 cursor-default' 
                      : 'bg-brand-card text-text-secondary hover:bg-zinc-200 cursor-pointer'
                  }`}
                  style={currentPage === i + 1 ? { background: "var(--color-brand-primary, #b6ef00)", color: "#111" } : {}}
                >
                  {i + 1}
                </button>
              ))}

              {/* Next Button */}
              <button 
                disabled={currentPage === totalPages}
                onClick={() => {
                  if (currentPage < totalPages) {
                    setCurrentPage(prev => prev + 1);
                    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
                  }
                }}
                className={`w-12 h-12 rounded-full flex items-center justify-center font-medium text-[15px] transition-colors ${
                  currentPage === totalPages 
                    ? 'bg-brand-card text-text-secondary cursor-default' 
                    : 'bg-brand-card text-text-secondary hover:bg-zinc-200 cursor-pointer'
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}

        </div>
      </section>
    </>
  );
}
