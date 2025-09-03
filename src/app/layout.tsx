import type { Metadata } from 'next';
import './globals.css';
import ConditionalHeaderClient from '@/components/layout/ConditionalHeaderClient';

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
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="NextCareer service" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
      </head>
      <body>
        <div className="text-black bg-white flex flex-col items-start justify-start p-4 pt-32">
          <div className="w-full max-w-5xl mx-auto px-8 text-lg font-medium">
            <ConditionalHeaderClient />
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
