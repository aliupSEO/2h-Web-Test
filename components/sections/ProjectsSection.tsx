"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import SectionBadge from "@/components/ui/SectionBadge";
import SectionTitle from "@/components/ui/SectionTitle";
import { ProjectsSectionData } from "@/lib/graphql";

interface ProjectsSectionProps {
  data: ProjectsSectionData | null;
}

export default function ProjectsSection({ data }: ProjectsSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!data || !data.projects || data.projects.length === 0) return null;

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = window.innerWidth > 768 ? 700 : window.innerWidth * 0.85;
      scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="py-24 bg-white" id="projects">
      <div className="flex flex-col items-center text-center mb-16 animate-fade-slide-up px-6 md:px-12 lg:px-24">
        <SectionBadge label={data.subtitle} variant="light" />
        <SectionTitle text={data.title} variant="light" as="h2" />
      </div>

      {/* CSS Scroll Snap Carousel */}
      <div ref={scrollRef} className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none gap-6 px-6 md:px-12 lg:px-24 pb-12 scroll-smooth">
        {data.projects.map((project, index) => (
          <div 
            key={index}
            className="group relative rounded-[32px] overflow-hidden bg-zinc-900 h-[450px] md:h-[500px] min-w-[85vw] md:min-w-[600px] lg:min-w-[700px] snap-center shrink-0 animate-fade-slide-up"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            {/* Background Image */}
            <Image
              src={project.imageUrl}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 800px"
            />
            
            {/* Default Overlay */}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500"></div>

            {/* Default Title (shown when not hovered) */}
            <div className="absolute inset-0 flex flex-col justify-end p-10 group-hover:opacity-0 transition-opacity duration-500 z-10 pointer-events-none">
              <h3 className="text-4xl md:text-5xl font-serif text-white uppercase drop-shadow-xl font-bold">
                {project.title}
              </h3>
            </div>

            {/* Hover State Container (to ensure they slide together smoothly) */}
            <div className="absolute inset-x-0 bottom-0 top-0 pointer-events-none z-20">
              
              {/* Hover Carousel Arrows (Left & Right) */}
              <button 
                onClick={(e) => { e.preventDefault(); scroll('left'); }}
                className="absolute left-6 top-1/2 -translate-y-1/2 w-[48px] h-[48px] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-40 hover:scale-110 pointer-events-none group-hover:pointer-events-auto"
                style={{ backgroundColor: "var(--color-brand-primary, #b6ef00)" }}
                aria-label="Previous project"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>

              <button 
                onClick={(e) => { e.preventDefault(); scroll('right'); }}
                className="absolute right-6 top-1/2 -translate-y-1/2 w-[48px] h-[48px] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-40 hover:scale-110 pointer-events-none group-hover:pointer-events-auto"
                style={{ backgroundColor: "var(--color-brand-primary, #b6ef00)" }}
                aria-label="Next project"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>

              {/* Hover State: Dark Grey Banner */}
              <div className="absolute bottom-0 left-0 right-0 h-[104px] bg-[#32373c] translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 pointer-events-auto">
                <div className="flex items-center justify-center h-full">
                  <span className="text-white font-bold uppercase tracking-widest text-sm md:text-[15px]">
                    WARUM {project.title}?
                  </span>
                </div>
              </div>

              {/* Hover State: Light Grey Box (Bottom Left, sits ABOVE the banner) */}
              <div className="absolute bottom-[104px] left-0 w-[70%] max-w-[320px] bg-[#f4f5f5] p-5 md:p-6 rounded-tr-[32px] translate-y-[200%] group-hover:translate-y-0 transition-transform duration-500 delay-75 pointer-events-auto">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--color-brand-primary, #b6ef00)" }}></span>
                  <span className="text-[10px] md:text-xs uppercase text-zinc-500 font-bold tracking-widest">
                    {project.tags || "SEA, SEO"}
                  </span>
                </div>
                <h3 className="text-xl md:text-[26px] font-serif uppercase text-zinc-900 tracking-wider leading-[1.2]">
                  {project.title}
                </h3>
              </div>

              {/* Hover State: White Cutout & Button (Bottom Right, sits INSIDE the banner) */}
              <div className="absolute bottom-0 right-0 w-[80px] h-[80px] bg-white rounded-tl-[32px] translate-y-[200%] group-hover:translate-y-0 transition-transform duration-500 delay-100 flex items-end justify-end p-3 pointer-events-auto">
                
                {/* Inverse Corner - Top */}
                <div className="absolute top-[-24px] right-0 w-[24px] h-[24px]">
                  <div className="absolute inset-0 bg-white"></div>
                  <div className="absolute inset-0 bg-[#32373c] rounded-br-[24px]"></div>
                </div>
                
                {/* Inverse Corner - Left */}
                <div className="absolute bottom-0 left-[-24px] w-[24px] h-[24px]">
                  <div className="absolute inset-0 bg-white"></div>
                  <div className="absolute inset-0 bg-[#32373c] rounded-br-[24px]"></div>
                </div>

                {/* The Button (Black by default, Neon Green on Hover) */}
                <Link 
                  href={project.link} 
                  className="relative z-10 w-[56px] h-[56px] rounded-full flex items-center justify-center overflow-hidden hover:scale-110 transition-transform pointer-events-auto"
                  aria-label={`Projekt ansehen: ${project.title}`}
                >
                  {/* Default Background */}
                  <div className="absolute inset-0 transition-opacity duration-300 opacity-100 group-hover:opacity-0 bg-[#111111]"></div>
                  
                  {/* Hover Background */}
                  <div className="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100" style={{ backgroundColor: "var(--color-brand-primary, #b6ef00)" }}></div>

                  {/* Default White Arrow */}
                  <div className="relative z-10 block group-hover:hidden">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="7" y1="17" x2="17" y2="7"></line>
                      <polyline points="7 7 17 7 17 17"></polyline>
                    </svg>
                  </div>
                  
                  {/* Hover Black Arrow */}
                  <div className="relative z-10 hidden group-hover:block">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="7" y1="17" x2="17" y2="7"></line>
                      <polyline points="7 7 17 7 17 17"></polyline>
                    </svg>
                  </div>
                </Link>
              </div>

            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
