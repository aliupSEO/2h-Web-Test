"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import SectionBadge from "@/components/ui/SectionBadge";
import SectionTitle from "@/components/ui/SectionTitle";
import { ProjectsSectionData } from "@/lib/graphql";
import ScrollReveal from "@/components/ui/ScrollReveal";

interface ProjectsSectionProps {
  data: ProjectsSectionData | null;
  startIndex?: number;
}

export default function ProjectsSection({ data, startIndex }: ProjectsSectionProps) {
  const baseIndex = data?.projects ? (startIndex !== undefined ? startIndex : 0) : 0;
  const actualStartIndex = (data?.projects && data.projects.length < 5) 
    ? baseIndex + data.projects.length 
    : baseIndex;

  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true, 
    align: 'center',
    skipSnaps: false,
    startIndex: actualStartIndex
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  if (!data || !data.projects || data.projects.length === 0) return null;

  // Embla requires enough slides to loop seamlessly. If we have < 5 projects,
  // we duplicate them so the infinite loop track always has enough length.
  const displayProjects = data.projects.length < 5 
    ? [...data.projects, ...data.projects, ...data.projects] 
    : data.projects;

  return (
    <section className="py-24 bg-[var(--color-bg-light,#ffffff)]" id="projects">
      <ScrollReveal className="flex flex-col items-center text-center mb-16 px-6 md:px-12 lg:px-24">
        <SectionBadge label={data.subtitle} variant="light" />
        <SectionTitle text={data.title} variant="light" as="h2" />
      </ScrollReveal>

      {/* Embla Carousel Viewport */}
      <div className="overflow-hidden cursor-grab active:cursor-grabbing w-full" ref={emblaRef}>
        <div className="flex touch-pan-y -ml-4 md:-ml-8 items-center">
          {displayProjects.map((project, index) => {
            const isActive = index === selectedIndex;
            
            return (
              <ScrollReveal 
                key={index} 
                delay={((index % 3) + 1) * 100 as any}
                className="px-4 md:px-0 md:pl-8 flex-[0_0_100vw] md:flex-[0_0_700px] lg:flex-[0_0_900px] xl:flex-[0_0_1000px] min-w-0"
              >
                <div 
                  className={`group relative rounded-[32px] overflow-hidden bg-zinc-900 h-[350px] md:h-[600px] lg:h-[700px] w-full`}
                >
                  {/* Background Image */}
                  <Image
                    src={project.imageUrl}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 800px"
                    suppressHydrationWarning
                  />
                  
                  {/* We render the active elements on EVERY slide, but hide them with CSS 
                      when inactive so they smoothly fade out as the slide moves away. */}
                  
                  {/* Hover Carousel Arrows (Left & Right) */}
                  <button 
                    onClick={(e) => { e.stopPropagation(); scrollPrev(); }}
                    className={`absolute left-4 md:left-6 top-1/2 -translate-y-1/2 w-[48px] h-[48px] md:w-[56px] md:h-[56px] rounded-full flex items-center justify-center transition-all duration-500 z-40 hover:scale-110 shadow-xl group/arrow ${isActive ? 'opacity-0 group-hover:opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                    style={{ backgroundColor: "var(--color-brand-primary, #b6ef00)" }}
                    aria-label="Previous project"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover/arrow:-translate-x-1">
                      <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                  </button>

                  <button 
                    onClick={(e) => { e.stopPropagation(); scrollNext(); }}
                    className={`absolute right-4 md:right-6 top-1/2 -translate-y-1/2 w-[48px] h-[48px] md:w-[56px] md:h-[56px] rounded-full flex items-center justify-center transition-all duration-500 z-40 hover:scale-110 shadow-xl group/arrow ${isActive ? 'opacity-0 group-hover:opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                    style={{ backgroundColor: "var(--color-brand-primary, #b6ef00)" }}
                    aria-label="Next project"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover/arrow:translate-x-1">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </button>

                  {/* Folder Tab */}
                  <div className={`absolute bottom-4 md:bottom-6 left-4 md:left-8 z-30 flex flex-col items-start drop-shadow-2xl transition-opacity duration-700 delay-75 ${isActive ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                    {/* Top Tab (Tags) */}
                    <div className="bg-[#cfd1d2] pl-3 md:pl-4 pr-3 md:pr-4 py-1.5 rounded-tl-[12px] rounded-tr-[12px] flex items-center gap-1.5 relative self-start">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#a4d600" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                        <polyline points="2 17 12 22 22 17"></polyline>
                        <polyline points="2 12 12 17 22 12"></polyline>
                      </svg>
                      <span className="text-[10px] md:text-[11px] text-zinc-800 font-medium tracking-wide" suppressHydrationWarning>
                        {project.tags || "Automation, SEA, Webdesign & UX"}
                      </span>
                      
                      {/* Inverse Curve */}
                      <svg className="absolute bottom-0 right-[-12px] w-[12px] h-[12px] text-[#cfd1d2] pointer-events-none" viewBox="0 0 100 100" fill="currentColor" preserveAspectRatio="none">
                        <path d="M0 100 V0 C0 55.23 44.77 100 100 100 H0 Z" />
                      </svg>
                    </div>

                    {/* Bottom Box (Title) */}
                    <div className="bg-[#cfd1d2]/90 backdrop-blur-sm pl-3 md:pl-4 pr-6 md:pr-10 py-2.5 md:py-3 rounded-bl-[12px] rounded-tr-[12px] rounded-br-[12px] min-w-[200px] max-w-[340px]">
                      <h3 
                        className="text-[16px] md:text-[20px] font-sans uppercase text-zinc-900 tracking-[2px] md:tracking-[3px] leading-[1.1]"
                        suppressHydrationWarning
                      >
                        {project.title}
                      </h3>
                    </div>
                  </div>

                  {/* White Cutout & Button (Bottom Right) */}
                  <div className={`absolute bottom-0 right-0 w-[88px] h-[88px] bg-[var(--color-bg-light,#ffffff)] rounded-tl-[32px] z-30 flex items-center justify-center transition-opacity duration-700 delay-100 ${isActive ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                        {/* Inverse Corner - Top */}
                        <svg className="absolute bottom-full right-0 w-[24px] h-[24px] text-[var(--color-text-light,#ffffff)] pointer-events-none" viewBox="0 0 100 100" fill="currentColor" preserveAspectRatio="none">
                          <path d="M100 100 V0 C100 55.23 55.23 100 0 100 H100 Z" />
                        </svg>
                        
                        {/* Inverse Corner - Left */}
                        <svg className="absolute bottom-0 right-full w-[24px] h-[24px] text-[var(--color-text-light,#ffffff)] pointer-events-none" viewBox="0 0 100 100" fill="currentColor" preserveAspectRatio="none">
                          <path d="M100 100 V0 C100 55.23 55.23 100 0 100 H100 Z" />
                        </svg>

                        <Link 
                          href={project.link} 
                          className="relative w-[64px] h-[64px] rounded-full flex items-center justify-center overflow-hidden hover:scale-110 transition-transform"
                          aria-label={`Projekt ansehen: ${project.title}`}
                        >
                          <div className="absolute inset-0 transition-opacity duration-300 bg-[var(--color-brand-secondary,#111111)] hover:bg-[#222222]"></div>
                          
                          {/* White Arrow */}
                          <div className="relative z-10">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="7" y1="17" x2="17" y2="7"></line>
                              <polyline points="7 7 17 7 17 17"></polyline>
                            </svg>
                          </div>
                        </Link>
                      </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
