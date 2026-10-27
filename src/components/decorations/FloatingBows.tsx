"use client";

import { useMemo } from "react";

export function FloatingBows({ count = 6, className = "" }: { count?: number; className?: string }) {
  const bows = useMemo(() => {
    const colors = ["text-brand-pink-400", "text-brand-purple-400"] as const;
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      top: `${(i * 17 + 5) % 90}%`,
      left: `${(i * 23 + 10) % 95}%`,
      size: 60 + (i % 3) * 40,
      delay: `${(i * 0.8) % 5}s`,
      duration: `${8 + (i % 3) * 2}s`,
      opacity: 0.15 + (i % 3) * 0.1,
      color: colors[i % 2],
    }));
  }, [count]);

  return (
    <div className={`pointer-events-none absolute inset-0 z-0 overflow-hidden ${className}`} aria-hidden="true">
      {bows.map((bow) => (
        <div
          key={bow.id}
          className="absolute animate-float"
          style={{
            top: bow.top,
            left: bow.left,
            width: `${bow.size}px`,
            height: `${bow.size}px`,
            opacity: bow.opacity,
            animationDelay: bow.delay,
            animationDuration: bow.duration,
          }}
        >
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={`h-full w-full drop-shadow-2xl ${bow.color}`}>
            <path d="M32 32 C20 20, 5 15, 8 28 C10 35, 20 38, 32 32 Z" fill="currentColor" />
            <path d="M32 32 C44 20, 59 15, 56 28 C54 35, 44 38, 32 32 Z" fill="currentColor" />
            <path d="M28 32 C25 42, 20 50, 18 55 C22 52, 28 45, 32 38 Z" fill="currentColor" opacity="0.8" />
            <path d="M36 32 C39 42, 44 50, 46 55 C42 52, 36 45, 32 38 Z" fill="currentColor" opacity="0.8" />
            <circle cx="32" cy="32" r="5" fill="currentColor" />
            <ellipse cx="22" cy="26" rx="5" ry="2.5" fill="white" opacity="0.5" />
            <ellipse cx="42" cy="26" rx="5" ry="2.5" fill="white" opacity="0.5" />
            <circle cx="32" cy="30" r="2" fill="white" opacity="0.6" />
          </svg>
        </div>
      ))}
    </div>
  );
}