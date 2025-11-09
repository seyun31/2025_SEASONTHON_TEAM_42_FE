import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN: string =
  process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN || '';

Sentry.init({
  dsn: SENTRY_DSN || 'https://examplePublicKey@o0.ingest.sentry.io/0',
  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
  // ...
  // Note: if you want to override the automatic release value, do not set a
  // `release` value here - use the environment variable `SENTRY_RELEASE`, so
  // that it will also get attached to your source maps
});

// Web Vitals 측정 및 전송
if (typeof window !== 'undefined') {
  import('web-vitals')
    .then(({ onCLS, onFCP, onLCP, onTTFB, onINP }) => {
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
    })
    .catch((error) => {
      console.error('Failed to load web-vitals:', error);
    });
}
