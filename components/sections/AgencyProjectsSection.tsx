"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";

interface ProjectItem {
  title: string;
  tags?: string;
  link: string;
  imageUrl: string;
  buttonText?: string;
}

export interface AgencyProjectsSectionProps {
  title?: string;
  subtitle?: string;
  projects: ProjectItem[];
}

export default function AgencyProjectsSection({ title, subtitle, projects }: AgencyProjectsSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <section className="relative w-full pt-12 pb-24 md:pt-16 md:pb-32 overflow-hidden" style={{ background: "var(--color-bg-primary, #ffffff)" }}>
      
      {/* Seamless Fade Transition from Previous Section */}
      <div 
        className="absolute top-0 left-0 w-full h-24 sm:h-32 md:h-48 z-10 pointer-events-none" 
        style={{ 
          background: "linear-gradient(to bottom, var(--color-bg-light, #ffffff) 0%, transparent 100%)" 
        }} 
      />

      {/* Dynamic Floating Rings Background (Supports Light & Dark Themes) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        
        {/* Soft Ambient Corner Glows */}
        <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full opacity-[0.15]" style={{ background: "var(--color-brand-primary, #22c55e)", filter: "blur(100px)", animation: "pulse-slow 10s infinite alternate" }} />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full opacity-[0.1]" style={{ background: "var(--color-brand-accent, #86efac)", filter: "blur(120px)", animation: "pulse-slow 15s infinite alternate-reverse" }} />
        
        {/* Floating Geometric Rings */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full border-[2px] border-[var(--color-brand-primary,#22c55e)] opacity-20"
            style={{
              width: `${(i * 40) + 100}px`,
              height: `${(i * 40) + 100}px`,
              left: `${(i * 15) % 80}%`,
              bottom: `-20%`,
              animation: `float-ring ${15 + (i * 2)}s infinite linear`,
              animationDelay: `${i * -4}s`,
            }}
          />
        ))}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float-ring {
          0% { transform: translateY(0) rotate(0deg) scale(0.8); opacity: 0; }
          15% { opacity: 0.4; }
          85% { opacity: 0.4; }
          100% { transform: translateY(-120vh) rotate(180deg) scale(1.2); opacity: 0; }
        }
        @keyframes pulse-slow {
          0% { transform: scale(1); }
          100% { transform: scale(1.3); }
        }
      `}} />

      <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 z-10">
        
        {/* Section Header */}
        {(title || subtitle) && (
          <ScrollReveal animation="fade-slide-up-blur" className="mb-12">
            {title && (
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center" style={{ color: "var(--color-text-primary, #ffffff)" }}>
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-center mt-4 text-[var(--color-text-secondary,#a1a1aa)] max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </ScrollReveal>
        )}

        {/* Horizontal Accordion / Expanding Vertical Bars */}
        <div className="flex w-full h-[500px] sm:h-[600px] lg:h-[700px] gap-2 sm:gap-4 overflow-hidden rounded-3xl">
          {projects.map((project, index) => {
            const isActive = index === activeIndex;
            
            return (
              <div 
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`relative h-full transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] cursor-pointer overflow-hidden rounded-xl sm:rounded-2xl flex-shrink-0 group ${
                  isActive 
                    ? "flex-[10] sm:flex-[8] min-w-[250px] shadow-[0_0_40px_rgba(0,0,0,0.5)] z-20" 
                    : "flex-[1] min-w-[40px] sm:min-w-[60px] md:min-w-[80px] z-10 hover:flex-[1.5] sm:hover:flex-[1.5] hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:-translate-y-2"
                }`}
              >
                {/* 1. Expanded State: Image Background */}
                <div 
                  className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
                    isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                  }`}
                >
                  {project.imageUrl ? (
                    <Image
                      src={project.imageUrl}
                      alt={project.title}
                      fill
                      className={`object-cover transition-transform duration-[1.5s] ease-out ${isActive ? "scale-100" : "scale-110"}`}
                      sizes="(max-width: 1024px) 100vw, 80vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-zinc-800" />
                  )}
                  
                  {/* Image Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-6 sm:p-8">
                    <h3 className={`text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 transition-all duration-700 delay-300 ${isActive ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
                      {project.title}
                    </h3>
                    {project.tags && (
                      <p className={`text-white/80 mb-4 text-sm sm:text-base max-w-lg transition-all duration-700 delay-[400ms] ${isActive ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
                        {project.tags}
                      </p>
                    )}
                    {project.link && project.link !== "#" && project.link !== "" && project.buttonText && (
                      <Link 
                        href={project.link} 
                        className={`inline-block px-6 py-3 rounded-full text-sm font-semibold w-max transition-all duration-700 delay-[500ms] hover:scale-105 ${isActive ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`} 
                        style={{ backgroundColor: "var(--color-brand-primary, #22c55e)", color: "#000" }}
                      >
                        {project.buttonText}
                      </Link>
                    )}
                  </div>
                </div>

                {/* 2. Collapsed State: Vertical Green Bar */}
                <div 
                  className={`absolute inset-0 w-full h-full flex flex-col items-center justify-end py-8 transition-all duration-500 hover:bg-opacity-80 ${
                    isActive ? "opacity-0 z-0 pointer-events-none" : "opacity-100 z-10"
                  }`}
                  style={{ backgroundColor: "var(--color-brand-primary, #22c55e)" }}
                >
                  {/* Vertical Text with Entrance & Hover Animations */}
                  <div className="w-full flex-1 flex items-center justify-center overflow-hidden">
                    <div 
                      className="animate-fade-slide-up"
                      style={{ 
                        animationDelay: `${index * 100}ms`,
                        animationFillMode: "both"
                      }}
                    >
                      <span 
                        className="block text-black font-bold text-sm sm:text-base md:text-lg uppercase tracking-[0.2em] whitespace-nowrap overflow-hidden text-ellipsis transition-all duration-500 group-hover:tracking-[0.3em] group-hover:-translate-y-4"
                        style={{ 
                          writingMode: "vertical-rl", 
                          transform: "rotate(180deg)"
                        }}
                      >
                        {project.title}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
