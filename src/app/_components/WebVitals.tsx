'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';

export function WebVitals() {
  useEffect(() => {
    // 클라이언트 사이드에서만 실행
    if (typeof window === 'undefined') return;

    const reportWebVitals = async () => {
      try {
        const { onCLS, onFCP, onLCP, onTTFB, onINP } = await import(
          'web-vitals'
        );

        const handleMetric = (metric: {
          name: string;
          value: number;
          rating: string;
          delta: number;
          id: string;
        }) => {
          const { name, value, rating, delta, id } = metric;

          // Sentry에 커스텀 측정값으로 전송
          try {
            Sentry.setMeasurement(name, value, 'millisecond');

            // 추가 컨텍스트 설정
            Sentry.setContext('web-vitals', {
              metric: name,
              value,
              rating,
              delta,
              id,
            });
          } catch (error) {
            console.error('Failed to send web vitals to Sentry:', error);
          }

          // 콘솔에도 출력 (개발 모드에서 확인용)
          if (process.env.NODE_ENV === 'development') {
            console.log(`[Web Vitals] ${name}:`, {
              value,
              rating,
              delta,
              id,
            });
          }
        };

        onCLS(handleMetric);
        onFCP(handleMetric);
        onLCP(handleMetric);
        onTTFB(handleMetric);
        onINP(handleMetric);
      } catch (error) {
        console.error('Failed to load web-vitals:', error);
      }
    };

    reportWebVitals();
  }, []);

  return null;
}
