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
          src="/assets/lottie/completion-animation.lottie"
          loop={false}
          autoplay={true}
          style={{
            width: '300px',
            height: '300px',
          }}
        />
      </div>
    </div>
  );
};

export default CompletionAnimation;
