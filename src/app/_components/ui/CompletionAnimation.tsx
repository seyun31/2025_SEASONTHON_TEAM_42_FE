'use client';

import React, { useEffect, useState } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

interface CompletionAnimationProps {
  isVisible: boolean;
  onComplete?: () => void;
  duration?: number;
  lottieUrl?: string;
  width?: string;
  height?: string;
}

const CompletionAnimation: React.FC<CompletionAnimationProps> = ({
  isVisible,
  onComplete,
  duration = 2000,
  lottieUrl = 'https://lottiefiles.com/free-animation/confetti-3ofTs67sBx',
  width = '100vw',
  height = '100vh',
}) => {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
        onComplete?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onComplete]);

  if (!shouldRender) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="relative">
        <DotLottieReact
          src={lottieUrl}
          loop={false}
          autoplay={true}
          style={{
            width: width,
            height: height,
          }}
        />
      </div>
    </div>
  );
};

export default CompletionAnimation;
