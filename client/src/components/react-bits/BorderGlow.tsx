import React, { useRef, useState } from 'react';

interface BorderGlowProps {
  children: React.ReactNode;
  className?: string;
  borderRadius?: string;
}

export const BorderGlow: React.FC<BorderGlowProps> = ({
  children,
  className = '',
  borderRadius = 'rounded-3xl',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative p-[1.5px] ${borderRadius} transition-all duration-300 group overflow-hidden ${className}`}
    >
      {/* Animated Glowing Conic Border Gradient Beam */}
      <div
        className="absolute inset-[-150%] animate-[spin_6s_linear_infinite] opacity-60 group-hover:opacity-100 transition-opacity pointer-events-none"
        style={{
          background: `conic-gradient(from 0deg, transparent 0deg, #7cffd4 70deg, transparent 140deg, #38bdf8 240deg, transparent 320deg)`,
        }}
      />

      {/* Mouse Tracking Beam Glow Overlay */}
      {isHovered && (
        <div
          className="absolute inset-0 transition-opacity duration-300 pointer-events-none z-10"
          style={{
            background: `radial-gradient(350px circle at ${mousePos.x}% ${mousePos.y}%, rgba(124, 255, 212, 0.35), transparent 75%)`,
          }}
        />
      )}

      {/* Card Content Body */}
      <div className={`relative z-20 w-full h-full bg-[oklch(0.2795_0.0368_260.0310)] ${borderRadius} overflow-hidden`}>
        {children}
      </div>
    </div>
  );
};
