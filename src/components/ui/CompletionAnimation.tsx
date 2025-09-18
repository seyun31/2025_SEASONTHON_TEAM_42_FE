'use client';

import React, { useEffect, useState } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

interface CompletionAnimationProps {
  isVisible: boolean;
  onComplete?: () => void;
  duration?: number;
}

const CompletionAnimation: React.FC<CompletionAnimationProps> = ({
  isVisible,
  onComplete,
  duration = 2000,
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
          src="https://lottiefiles.com/free-animation/confetti-3ofTs67sBx"
          loop={false}
          autoplay={true}
          style={{
            width: '100vw',
            height: '100vh',
          }}
        />
      </div>
    </div>
  );
};

export default CompletionAnimation;
