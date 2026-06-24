"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface DinoGameProps {
  title?: string;
}

const GRAVITY = 0.6;
const JUMP_VELOCITY = -9;
const GAME_SPEED = 4;
const DINO_WIDTH = 20;
const DINO_HEIGHT = 22;
const CONTAINER_WIDTH = 350;
const CONTAINER_HEIGHT = 100;

export default function DinoGame({ title = "Lass uns ein Spiel spielen" }: DinoGameProps) {
  const [uiState, setUiState] = useState<"IDLE" | "PLAYING" | "GAMEOVER">("IDLE");
  const [highScore, setHighScore] = useState(0);
  
  const gameState = useRef<"IDLE" | "PLAYING" | "GAMEOVER">("IDLE");
  const dinoRef = useRef<HTMLDivElement>(null);
  const scoreRefElement = useRef<HTMLSpanElement>(null);
  
  const requestRef = useRef<number>(0);
  const dinoYRef = useRef(0);
  const dinoVelocity = useRef(0);
  const scoreRef = useRef(0);
  const obstaclesRef = useRef<{ id: number; x: number; el: HTMLDivElement | null }[]>([]);
  const lastObstacleTime = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("dinoHighScore");
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  const changeState = (newState: "IDLE" | "PLAYING" | "GAMEOVER") => {
    gameState.current = newState;
    setUiState(newState);
    
    if (newState === "IDLE") {
      scoreRef.current = 0;
      dinoYRef.current = 0;
      dinoVelocity.current = 0;
      if (dinoRef.current) dinoRef.current.style.bottom = "2px";
      if (scoreRefElement.current) scoreRefElement.current.innerText = "00000";
      
      obstaclesRef.current.forEach(obs => obs.el?.remove());
      obstaclesRef.current = [];
    } else if (newState === "PLAYING") {
      lastObstacleTime.current = performance.now();
      requestRef.current = requestAnimationFrame(gameLoop);
    }
  };

  const jump = useCallback(() => {
    if (gameState.current === "GAMEOVER") {
      changeState("IDLE");
      return;
    }
    if (gameState.current === "IDLE") {
      changeState("PLAYING");
      // Initial jump
      dinoVelocity.current = JUMP_VELOCITY;
      return;
    }
    if (gameState.current === "PLAYING" && dinoYRef.current === 0) {
      dinoVelocity.current = JUMP_VELOCITY;
    }
  }, []);

  const gameLoop = useCallback((time: number) => {
    if (gameState.current !== "PLAYING") return;

    // Gravity
    dinoVelocity.current += GRAVITY;
    dinoYRef.current -= dinoVelocity.current;

    if (dinoYRef.current <= 0) {
      dinoYRef.current = 0;
      dinoVelocity.current = 0;
    }

    if (dinoRef.current) {
      dinoRef.current.style.bottom = `${dinoYRef.current + 2}px`;
    }

    // Score
    scoreRef.current += 0.1;
    const currentScoreInt = Math.floor(scoreRef.current);
    if (scoreRefElement.current && currentScoreInt % 1 === 0) {
      scoreRefElement.current.innerText = currentScoreInt.toString().padStart(5, '0');
    }

    // Spawn obstacles
    if (time - lastObstacleTime.current > 900 + Math.random() * 1500) {
      const el = document.createElement("div");
      el.className = "flex gap-[2px] items-end absolute z-10";
      el.style.bottom = "2px";
      el.style.left = `${CONTAINER_WIDTH}px`;
      el.innerHTML = `
        <div class="w-[4px] h-[16px] bg-zinc-600 rounded-t-sm"></div>
        <div class="w-[5px] h-[22px] bg-zinc-600 rounded-t-sm"></div>
        <div class="w-[4px] h-[14px] bg-zinc-600 rounded-t-sm"></div>
      `;
      containerRef.current?.appendChild(el);
      
      obstaclesRef.current.push({ id: time, x: CONTAINER_WIDTH, el });
      lastObstacleTime.current = time;
    }

    let isHit = false;
    
    obstaclesRef.current = obstaclesRef.current.filter(obs => {
      obs.x -= GAME_SPEED;
      if (obs.el) {
        obs.el.style.left = `${obs.x}px`;
      }
      
      // Collision AABB
      const obsRect = { left: obs.x, right: obs.x + 13, top: CONTAINER_HEIGHT - 22, bottom: CONTAINER_HEIGHT };
      const dinoRect = { left: 20, right: 20 + DINO_WIDTH, top: CONTAINER_HEIGHT - DINO_HEIGHT - dinoYRef.current, bottom: CONTAINER_HEIGHT - dinoYRef.current };
      
      // Forgiving collision box (inset by 6px)
      if (
        dinoRect.right - 6 > obsRect.left &&
        dinoRect.left + 6 < obsRect.right &&
        dinoRect.bottom > obsRect.top + 6
      ) {
        isHit = true;
      }
      
      if (obs.x < -30) {
        obs.el?.remove();
        return false;
      }
      return true;
    });

    if (isHit) {
      changeState("GAMEOVER");
      const finalScore = Math.floor(scoreRef.current);
      setHighScore(prev => {
        if (finalScore > prev) {
          localStorage.setItem("dinoHighScore", finalScore.toString());
          return finalScore;
        }
        return prev;
      });
      return;
    }

    requestRef.current = requestAnimationFrame(gameLoop);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        jump();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [jump]);

  return (
    <div className="flex flex-col items-start lg:items-center">
      <h4 
        className="text-zinc-500 font-normal text-[40px] leading-[50px] text-center mb-4 w-full max-w-[350px]"
      >
        {title}
      </h4>
      
      <div 
        ref={containerRef}
        className="relative w-full max-w-[350px] h-[100px] border-b border-zinc-600 flex items-end px-2 pb-[2px] cursor-pointer overflow-hidden group"
        onClick={jump}
      >
         {/* Background text */}
         <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-4 z-0">
           <div className="flex justify-end w-full px-2 mb-2">
              <span className="text-zinc-600 text-[10px] font-mono tracking-widest uppercase">
                HI {highScore.toString().padStart(5, '0')} &nbsp; <span ref={scoreRefElement}>00000</span>
              </span>
           </div>
           
           {uiState === "IDLE" && (
             <span className="text-zinc-500 font-mono tracking-[0.1em] text-xs mt-6 transition-opacity group-hover:opacity-70">Tippen zum Start</span>
           )}
           
           {uiState === "PLAYING" && (
             <span className="text-zinc-600 text-[9px] mt-8 tracking-wider uppercase opacity-30">Tippen zum Springen</span>
           )}

           {uiState === "GAMEOVER" && (
             <>
               <span className="text-zinc-500 font-mono tracking-[0.2em] text-xs mt-2 text-center">GAME OVER</span>
               <span className="text-zinc-600 text-[9px] mt-4 tracking-wider uppercase">Tippen für Neustart</span>
             </>
           )}
         </div>
         
         {/* Dino Pixel Art CSS Polygon */}
         <div 
           ref={dinoRef}
           className="w-[20px] h-[22px] absolute z-10 transition-transform" 
           style={{ 
             left: '20px',
             bottom: '2px',
             backgroundColor: 'var(--color-brand-primary, #b6ef00)', 
             clipPath: 'polygon(50% 0%, 100% 0%, 100% 40%, 80% 40%, 80% 60%, 60% 60%, 60% 80%, 40% 80%, 40% 100%, 20% 100%, 20% 80%, 0% 80%, 0% 60%, 20% 60%, 20% 40%, 50% 40%)' 
           }}
         >
         </div>
      </div>
    </div>
  );
}
