"use client";

import React, { useEffect, useState, useRef } from "react";

interface Square {
  id: number;
  x: number;
  y: number;
  opacity: number;
}

export default function AnimatedGridBackground() {
  const [squares, setSquares] = useState<Square[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const GRID_SIZE = 50;

  useEffect(() => {
    if (!containerRef.current) return;
    
    const width = containerRef.current.offsetWidth;
    const height = containerRef.current.offsetHeight;
    
    const cols = Math.floor(width / GRID_SIZE);
    const rows = Math.floor(height / GRID_SIZE);
    
    // Create 15 random active squares for a fuller effect
    const initialSquares: Square[] = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: Math.floor(Math.random() * cols),
      y: Math.floor(Math.random() * rows),
      opacity: Math.random() * 0.3 + 0.1, // 0.1 to 0.4 opacity
    }));
    
    setSquares(initialSquares);
    
    const interval = setInterval(() => {
      setSquares(prev => {
        const newSquares = [...prev];
        
        // Move 6 random squares per tick to keep it highly dynamic
        for (let i = 0; i < 6; i++) {
          const squareToMove = Math.floor(Math.random() * prev.length);
          const sq = { ...newSquares[squareToMove] };
          
          // Move 1 to 3 spaces at once for longer, sweeping glides
          const distance = Math.floor(Math.random() * 3) + 1;
          
          // Random direction: 0=up, 1=right, 2=down, 3=left
          const dir = Math.floor(Math.random() * 4);
          if (dir === 0) sq.y = Math.max(0, sq.y - distance);
          else if (dir === 1) sq.x = Math.min(cols - 1, sq.x + distance);
          else if (dir === 2) sq.y = Math.min(rows - 1, sq.y + distance);
          else if (dir === 3) sq.x = Math.max(0, sq.x - distance);
          
          // Pulse the opacity as it moves
          sq.opacity = Math.random() * 0.35 + 0.05;
          
          newSquares[squareToMove] = sq;
        }
        
        return newSquares;
      });
    }, 2000); // Trigger new move every 2s, but animation lasts 3s for smooth overlapping
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden z-0"
    >
      {/* CSS Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
          backgroundImage: `
            linear-gradient(to right, var(--color-brand-border, #e5e7eb) 1px, transparent 1px),
            linear-gradient(to bottom, var(--color-brand-border, #e5e7eb) 1px, transparent 1px)
          `,
          maskImage: "radial-gradient(ellipse at center, black 50%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 50%, transparent 100%)"
        }}
      />
      
      {/* Animated Squares */}
      <div className="absolute inset-0" style={{
        maskImage: "radial-gradient(ellipse at center, black 50%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(ellipse at center, black 50%, transparent 100%)"
      }}>
        {squares.map(sq => (
          <div
            key={sq.id}
            className="absolute transition-all duration-[3000ms]"
            style={{
              width: GRID_SIZE - 1,
              height: GRID_SIZE - 1,
              transform: `translate(${sq.x * GRID_SIZE + 1}px, ${sq.y * GRID_SIZE + 1}px)`,
              opacity: sq.opacity,
              backgroundColor: "var(--color-brand-primary, #22c55e)",
              transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
              boxShadow: sq.opacity > 0.25 ? "0 0 20px rgba(34, 197, 94, 0.4)" : "none"
            }}
          />
        ))}
      </div>
    </div>
  );
}
