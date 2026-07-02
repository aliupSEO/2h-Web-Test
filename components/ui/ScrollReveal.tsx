"use client";

import { useEffect, useRef, useState, ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  animation?: "fade-slide-up" | "fade-in";
  delay?: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 1000;
  className?: string;
  threshold?: number;
}

export default function ScrollReveal({
  children,
  animation = "fade-slide-up",
  delay,
  className = "",
  threshold = 0.1,
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (domRef.current) {
              observer.unobserve(domRef.current);
            }
          }
        });
      },
      { threshold }
    );
    
    if (domRef.current) {
      observer.observe(domRef.current);
    }
    
    return () => {
      const current = domRef.current;
      if (current) {
        observer.unobserve(current);
      }
    };
  }, [threshold]);

  const animationClass = animation === "fade-slide-up" ? "animate-fade-slide-up" : "animate-fade-in";
  const delayClass = delay ? `animation-delay-${delay}` : "";

  return (
    <div
      ref={domRef}
      className={`${isVisible ? `${animationClass} ${delayClass}` : "opacity-0"} ${className}`}
    >
      {children}
    </div>
  );
}
