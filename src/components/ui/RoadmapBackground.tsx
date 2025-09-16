'use client';

import { ReactNode } from 'react';

interface RoadmapBackgroundProps {
  children: ReactNode;
  className?: string;
  showOverlay?: boolean;
  overlayBlur?: boolean;
}

export default function RoadmapBackground({
  children,
  className = '',
  showOverlay = true,
  overlayBlur = false,
}: RoadmapBackgroundProps) {
  return (
    <div
      className={`relative rounded-2xl p-8 text-white overflow-hidden ${className}`}
      style={{
        backgroundImage: 'url(/assets/Icons/roadmap_bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
      }}
    >
      {showOverlay && (
        <div
          className="absolute inset-0 bg-black/20 rounded-2xl"
          style={{
            backdropFilter: overlayBlur ? 'blur(10px)' : 'none',
          }}
        />
      )}
      <div className="relative z-10 h-full flex flex-col">{children}</div>
    </div>
  );
}
