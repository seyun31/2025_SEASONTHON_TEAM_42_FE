import type { Metadata } from 'next';
import './globals.css';
import ConditionalHeaderClient from '@/components/layout/ConditionalHeaderClient';
import QueryProvider from '@/components/providers/QueryProvider';
import ToastProvider from '@/components/providers/ToastProvider';

export const metadata: Metadata = {
  title: 'NextCareer',
  description:
    'NextCareer - 제 2의 직업을 찾고자 하는 중장년층을 위한 맞춤형 길잡이 구직 서비스',
  manifest: '/manifest.json',
  icons: {
    apple: '/icons/apple-touch-icon.png',
    icon: '/icon.svg',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#ffffff',
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
                `,
              }}
            />
          </>
        )}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="NextCareer service" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        {/* 중요 이미지 preload */}
        <link
          rel="preload"
          href="/assets/Icons/character_hi.webp"
          as="image"
          type="image/webp"
        />
      </head>
      <body suppressHydrationWarning={true}>
        <QueryProvider>
          <ToastProvider />
          <div className="text-black bg-white flex flex-col items-start justify-start pt-24">
            <div className="w-full mx-auto px-4 md:px-8 text-lg font-medium">
              <ConditionalHeaderClient />
              {children}
            </div>
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
