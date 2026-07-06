"use client";

import { useEffect, useState, useRef } from "react";

interface AnimatedCounterProps {
  value: string;
  className?: string;
}

export default function AnimatedCounter({ value, className }: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  // Extract prefix, number, suffix (e.g. "$1200+" -> "$", "1200", "+")
  const match = value.match(/^(\D*)(\d+)(\D*)$/);
  const prefix = match ? match[1] : "";
  const numStr = match ? match[2] : value;
  const suffix = match ? match[3] : "";
  const targetNumber = parseInt(numStr, 10);
  const paddingLength = numStr.length; // for "018" -> 3

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible || isNaN(targetNumber)) return;

    const end = targetNumber;
    const duration = 800; // 0.8 seconds
    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // easeOutExpo for a nice slow down at the end
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      setCount(Math.floor(easeProgress * end));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [isVisible, targetNumber]);

  // If there's no number found, just render the string as is
  if (isNaN(targetNumber)) {
    return <span className={className}>{value}</span>;
  }

  // Format count to match original padding if it starts with 0 (e.g. "018")
  const displayNum = numStr.startsWith("0") ? String(count).padStart(paddingLength, "0") : count;

  return (
    <span ref={ref} className={className}>
      {prefix}{displayNum}{suffix}
    </span>
  );
}
