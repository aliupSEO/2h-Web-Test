"use client";

import { useEffect, useRef, useState, useMemo } from "react";

interface StaggeredTextProps {
  text: string;
  delay?: number;
  stagger?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function StaggeredText({ text, delay = 300, stagger = 200, className = "", style }: StaggeredTextProps) {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLParagraphElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [lineDelays, setLineDelays] = useState<number[]>([]);

  const words = useMemo(() => text.split(" "), [text]);

  // Ensure refs array is the right length
  useEffect(() => {
    wordRefs.current = wordRefs.current.slice(0, words.length);
  }, [words]);

  // Calculate true visual lines by measuring offsetTop
  useEffect(() => {
    const calculateLines = () => {
      let currentLine = 0;
      let lastTop = -1;
      
      const newDelays = words.map((_, i) => {
        const el = wordRefs.current[i];
        if (!el) return delay;
        
        const top = el.offsetTop;
        
        // If Y-position changes by more than 5px, it's a new wrapped line
        if (lastTop === -1 || Math.abs(top - lastTop) > 5) {
          lastTop = top;
          currentLine++;
        }
        
        return delay + ((currentLine - 1) * stagger);
      });
      
      setLineDelays(newDelays);
    };

    // Calculate immediately, and again after a tiny timeout to ensure fonts/layout loaded
    calculateLines();
    const timeout = setTimeout(calculateLines, 100);
    
    window.addEventListener("resize", calculateLines);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("resize", calculateLines);
    };
  }, [text, delay, stagger, words]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (domRef.current) observer.unobserve(domRef.current);
          }
        });
      },
      { threshold: 0.1 }
    );
    
    if (domRef.current) {
      observer.observe(domRef.current);
    }
    
    return () => {
      if (domRef.current) {
        observer.unobserve(domRef.current);
      }
    };
  }, []);

  return (
    <p ref={domRef} className={`flex flex-wrap gap-x-[0.25em] ${className}`} style={style}>
      {words.map((word, i) => (
        <span 
          key={i} 
          ref={(el) => { wordRefs.current[i] = el; }}
          className="inline-block overflow-hidden py-1 -my-1"
        >
          <span 
            className={`inline-block ${isVisible ? 'animate-fade-slide-up' : 'opacity-0'}`} 
            style={{ 
              animationDelay: `${lineDelays[i] !== undefined ? lineDelays[i] : delay}ms`,
              animationFillMode: 'both',
              animationDuration: '0.8s'
            }}
          >
            {word}
          </span>
        </span>
      ))}
    </p>
  );
}
