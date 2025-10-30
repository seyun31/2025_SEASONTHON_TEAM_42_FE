'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onFinish();
      }, 1000); // 페이드 아웃 애니메이션 시간
    }, 5000); // 2.5초 동안 스플래시 화면 표시

    return () => clearTimeout(timer);
  }, [onFinish]);

  if (!isVisible) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center transition-opacity duration-500 opacity-0">
        {/* 페이드 아웃 중 */}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center animate-fade-in">
      {/* 상단 여백 */}
      <div className="flex-1"></div>

      {/* 메인 콘텐츠 */}
      <div className="flex flex-col items-center justify-center flex-1">
        {/* 메인 문구 */}
        <div className="text-center mb-12 animate-slide-up">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            알뜰하게 지출관리하기
          </h1>
        </div>

        {/* 로고 */}
        <div className="animate-bounce-slow">
          <Image
            src="/icons/logo.svg"
            alt="Rzi Logo"
            width={200}
            height={80}
            priority
            className="drop-shadow-lg"
          />
        </div>
      </div>

      {/* 하단 여백 */}
      <div className="flex-1"></div>

      {/* 하단 로딩 인디케이터 */}
      <div className="pb-20">
        <div className="flex space-x-2">
          <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
          <div
            className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"
            style={{ animationDelay: '0.2s' }}
          ></div>
          <div
            className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"
            style={{ animationDelay: '0.4s' }}
          ></div>
        </div>
      </div>
    </div>
  );
}
