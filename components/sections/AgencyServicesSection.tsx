"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { AgencyServiceItem } from "@/lib/graphql";
import ScrollReveal from "@/components/ui/ScrollReveal";

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Navigation, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";

interface AgencyServicesSectionProps {
  services: AgencyServiceItem[];
}

export default function AgencyServicesSection({ services }: AgencyServicesSectionProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!services || services.length === 0) return null;

  return (
    <section className="relative w-full pt-24 pb-12 md:pt-32 md:pb-16 overflow-hidden" style={{ background: "var(--color-bg-light, #ffffff)" }}>
      {/* Seamless Fade Transition from Previous Section */}
      <div 
        className="absolute top-0 left-0 w-full h-24 sm:h-32 md:h-48 z-10 pointer-events-none" 
        style={{ 
          background: "linear-gradient(to bottom, var(--color-bg-primary, #ffffff) 0%, transparent 100%)" 
        }} 
      />

      {/* Ambient Wave Form Background */}
      <div className="absolute z-0 w-full h-full inset-0 overflow-hidden pointer-events-none flex flex-col justify-between">
        <div className="absolute top-[10%] -left-[10%] w-[70vw] h-[20vw] max-w-[1200px] max-h-[300px] rounded-[100%] opacity-20 origin-center rotate-[20deg]" style={{ background: "var(--color-brand-primary, #22c55e)", filter: "blur(120px)" }} />
        <div className="absolute top-[45%] right-[0%] w-[80vw] h-[25vw] max-w-[1400px] max-h-[400px] rounded-[100%] opacity-25 origin-center -rotate-[15deg] translate-x-1/4" style={{ background: "var(--color-brand-primary, #22c55e)", filter: "blur(140px)" }} />
        <div className="absolute top-[80%] -left-[10%] w-[70vw] h-[20vw] max-w-[1200px] max-h-[300px] rounded-[100%] opacity-20 origin-center rotate-[20deg]" style={{ background: "var(--color-brand-accent, #86efac)", filter: "blur(120px)" }} />
      </div>

      <div className="w-full relative z-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-12 sm:mb-16 text-center">
        <ScrollReveal animation="fade-slide-up-blur">
          {services[0]?.category && (
            <h2 
              className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-center w-full"
              style={{ color: "var(--color-text-dark, #0a0a0a)" }}
            >
              {services[0].category}
            </h2>
          )}
        </ScrollReveal>
      </div>

      <div className="w-full relative z-10 px-0">
          {mounted && (
            <Swiper
              effect={"coverflow"}
              grabCursor={true}
              centeredSlides={true}
              slidesPerView={"auto"}
              initialSlide={Math.floor(services.length / 2)}
              slideToClickedSlide={true}
              speed={1000}
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true
              }}
              coverflowEffect={{
                rotate: 25,
                stretch: 0,
                depth: 300,
                modifier: 1.2,
                slideShadows: true,
              }}
              modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
              className="w-full py-16 overflow-visible"
            >
              {services.map((service, index) => {
                const middleIndex = Math.floor(services.length / 2);
                const distance = Math.abs(index - middleIndex);
                const delayMs = distance * 200 + 100;

                return (
                  <SwiperSlide 
                    key={service.id || index} 
                    className="aspect-[4/5] sm:aspect-[3/4] relative transition-all duration-700 ease-out group"
                    style={{ width: "min(400px, 85vw)" }}
                  >
                    <ScrollReveal 
                      animation="fade-slide-up-blur" 
                      style={{ animationDelay: `${delayMs}ms` }}
                      className="w-full h-full"
                    >
                      <div className="w-full h-full relative rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden shadow-2xl transition-all duration-700 ease-out group-hover:-translate-y-3 group-hover:shadow-[0_40px_80px_rgba(0,0,0,0.2)]">
                        {/* Active Border */}
                        <div className="absolute inset-0 z-30 rounded-[1.5rem] sm:rounded-[2rem] border-2 border-transparent transition-colors duration-700 group-[.swiper-slide-active]:border-[var(--color-brand-primary,#22c55e)] pointer-events-none" />

                        {/* Image */}
                        {service.imageUrl ? (
                          <Image
                            src={service.imageUrl}
                            alt={service.title}
                            fill
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                            sizes="(max-width: 768px) 100vw, 600px"
                          />
                        ) : (
                          <div className="w-full h-full bg-zinc-900 transition-transform duration-700 ease-out group-hover:scale-110" />
                        )}

                      {/* Black tint for inactive slides */}
                      <div className="absolute inset-0 bg-black/60 opacity-100 transition-opacity duration-1000 group-[.swiper-slide-active]:opacity-0 z-10" />

                      {/* Active Slide Center Button */}
                      <div className="absolute top-[40%] sm:top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 opacity-0 scale-0 transition-all duration-1000 delay-[400ms] group-[.swiper-slide-active]:opacity-100 group-[.swiper-slide-active]:scale-100 flex items-center justify-center">
                        {/* Continuous Pulse Aura */}
                        <div className="absolute inset-0 rounded-full animate-ping opacity-40" style={{ background: "var(--color-brand-primary, #22c55e)", animationDuration: '2s' }} />
                        <button 
                          className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-black hover:scale-110 transition-transform shadow-[0_0_40px_rgba(34,197,94,0.6)]"
                          style={{ background: "var(--color-brand-primary, #22c55e)" }}
                        >
                          <ArrowUpRight className="w-6 h-6 sm:w-8 sm:h-8" />
                        </button>
                      </div>

                      {/* Floating Glass Card for active slide */}
                      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 w-[85%] bg-white/10 backdrop-blur-xl border border-white/30 rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-[0_30px_60px_rgba(0,0,0,0.4)] z-20 opacity-0 translate-y-12 scale-95 transition-all duration-1000 delay-200 group-[.swiper-slide-active]:opacity-100 group-[.swiper-slide-active]:translate-y-0 group-[.swiper-slide-active]:scale-100 flex flex-col gap-2 overflow-hidden">
                        <h3 
                          className="text-lg sm:text-xl md:text-2xl font-bold text-left leading-tight translate-x-[-20px] opacity-0 transition-all duration-1000 delay-[500ms] group-[.swiper-slide-active]:translate-x-0 group-[.swiper-slide-active]:opacity-100"
                          style={{ color: "var(--color-brand-primary, #22c55e)", textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}
                        >
                          {service.title}
                        </h3>
                        {service.description && (
                          <p className="text-sm sm:text-base text-left text-white/90 leading-relaxed font-medium translate-x-[20px] opacity-0 transition-all duration-1000 delay-[600ms] group-[.swiper-slide-active]:translate-x-0 group-[.swiper-slide-active]:opacity-100">
                            {service.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </ScrollReveal>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .swiper {
          overflow: visible !important;
          clip-path: none !important;
        }
        .swiper-wrapper {
          align-items: center;
        }
      `}} />
    </section>
  );
}
