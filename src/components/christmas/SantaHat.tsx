"use client";

import { motion } from "motion/react";

export function SantaHat({ className = "" }: { className?: string }) {
  return (
    <motion.div
      className={`absolute pointer-events-none ${className}`}
      initial={{ rotate: -2 }}
      animate={{ rotate: [-2, 2, -2] }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      style={{ zIndex: 20 }}
    >
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-lg filter"
      >
        {/* Hat Body (Red) - Flopped over style */}
        <path
          d="M20,90 C20,90 45,10 80,20 C95,25 100,45 95,55"
          fill="#D42426"
          stroke="#B01C1E"
          strokeWidth="2"
        />
        
        {/* White Brim - Fluffy */}
        <path
          d="M15,90 
             C15,90 25,85 35,90 
             C35,90 45,95 55,90
             C55,90 65,85 75,90
             C75,90 85,95 95,90
             C95,90 95,105 95,105
             L15,105
             C15,105 15,90 15,90Z"
          fill="white"
          filter="url(#fluffy)"
        />
        
        {/* Pom Pom */}
        <circle cx="95" cy="55" r="10" fill="white" filter="url(#fluffy)" />
        
        <defs>
          <filter id="fluffy">
            <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
          </filter>
        </defs>
      </svg>
    </motion.div>
  );
}
