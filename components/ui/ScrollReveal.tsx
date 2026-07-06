"use client";

import { useEffect, useRef, useState, ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  animation?: "fade-slide-up" | "fade-in" | "pop-up" | "fade-slide-left-blur" | string;
  delay?: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 1000;
  className?: string;
  threshold?: number;
  style?: React.CSSProperties;
}

export default function ScrollReveal({
  children,
  animation = "fade-in",
  delay,
  className = "",
  threshold = 0.1,
  style,
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

  const animationClass = `animate-${animation}`;
  const delayClass = delay ? `animation-delay-${delay}` : "";

  return (
    <div
      ref={domRef}
      className={`${isVisible ? `${animationClass} ${delayClass}` : "opacity-0"} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}
