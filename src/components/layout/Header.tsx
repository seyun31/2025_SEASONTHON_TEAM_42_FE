'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <header className="fixed inset-x-0 top-0 flex flex-col items-center justify-center h-[80px] text--black bg-white z-50 py-[24px]">
      <div className="mx-auto flex h-20 w-full items-center justify-around px-4 md:px-8 lg:w-[70%]">
        {/* 로고 */}
        <Link
          href="/"
          className="flex justify-center items-center relative h-12 w-28 shrink-0"
        >
          <Image
            src="/assets/logos/logo.svg"
            alt="nextcareer 로고"
            width={120}
            height={40}
            className="h-8 w-auto"
          />
        </Link>

        {/* 데스크톱 네비게이션 */}
        <nav className="hidden md:flex flex-1 justify-center gap-8">
          <div
            onClick={() => router.push('/job-postings')}
            className={`cursor-pointer transition-colors duration-200 px-4 py-2 text-center text-title-xsmall font-medium ${
              isActive('/job-postings')
                ? 'text-green-600'
                : 'text-gray-700 hover:!text-green-600'
            }`}
          >
            채용 공고
          </div>
          <div
            onClick={() => router.push('/education-programs')}
            className={`cursor-pointer transition-colors duration-200 px-4 py-2 text-center text-title-xsmall font-medium ${
              isActive('/education-programs')
                ? 'text-green-600'
                : 'text-gray-700 hover:!text-green-600'
            }`}
          >
            교육 공고
          </div>
          <div
            onClick={() => router.push('/ai-chat')}
            className={`cursor-pointer transition-colors duration-200 px-4 py-2 text-center text-title-xsmall font-medium ${
              isActive('/education-programs')
                ? 'text-green-600'
                : 'text-gray-700 hover:!text-green-600'
            }`}
          >
            AI 직업 추천
          </div>
          <div
            onClick={() => router.push('/career-roadmap')}
            className={`cursor-pointer transition-colors duration-200 px-4 py-2 text-center text-title-xsmall font-medium ${
              isActive('/career-roadmap')
                ? 'text-green-600'
                : 'text-gray-700 hover:!text-green-600'
            }`}
          >
            커리어 로드맵
          </div>
          <div
            onClick={() => router.push('/heart-list')}
            className={`cursor-pointer transition-colors duration-200 px-4 py-2 text-center text-title-xsmall font-medium ${
              isActive('/heart-list')
                ? 'text-green-600'
                : 'text-gray-700 hover:!text-green-600'
            }`}
          >
            관심목록
          </div>
        </nav>

        {/* 데스크톱 로그인 버튼 */}
        <div className="hidden md:flex justify-center items-center w-32 gap-3">
          {/* 사용자 프로필 아이콘 */}
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <svg
              className="w-5 h-5 text-gray-600"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <Link
            href="/member/login"
            className="text-gray-600 hover:!text-green-600 px-4 py-2 text-sm font-medium transition-colors duration-200"
          >
            로그인
          </Link>
        </div>

        {/* 모바일 메뉴 버튼 */}
        <div className="md:hidden flex-1 flex justify-end">
          <button
            onClick={toggleMobileMenu}
            className="text-gray-700 hover:text-green-600 p-2 rounded-md transition-colors duration-200"
            aria-label="메뉴 열기"
          >
            <svg
              className={`w-6 h-6 transform transition-transform duration-200 ${
                isMobileMenuOpen ? 'rotate-90' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* 모바일 네비게이션 메뉴 */}
      <div
        className={`md:hidden w-full transition-all duration-300 ease-in-out gap-4 ${
          isMobileMenuOpen
            ? 'max-h-[500px] opacity-100'
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <div className="px-4 pt-4 pb-12 space-y-2 border-t border-gray-200 bg-white shadow-md rounded-b-2xl">
          <div
            onClick={() => {
              router.push('/job-postings');
              setIsMobileMenuOpen(false);
            }}
            className={`block px-4 py-3 text-base font-semibold cursor-pointer rounded-lg transition-all duration-200 border-l-4 ${
              isActive('/job-postings')
                ? 'text-green-600 bg-green-50 border-green-600'
                : 'text-gray-700 hover:text-green-600 hover:bg-gray-50 border-transparent hover:border-green-600'
            }`}
          >
            채용 공고
          </div>
          <div
            onClick={() => {
              router.push('/education-programs');
              setIsMobileMenuOpen(false);
            }}
            className={`block px-4 py-3 text-base font-semibold cursor-pointer rounded-lg transition-all duration-200 border-l-4 ${
              isActive('/education-programs')
                ? 'text-green-600 bg-green-50 border-green-600'
                : 'text-gray-700 hover:text-green-600 hover:bg-gray-50 border-transparent hover:border-green-600'
            }`}
          >
            교육 공고
          </div>
          <div
            onClick={() => {
              router.push('/ai-chat');
              setIsMobileMenuOpen(false);
            }}
            className={`block px-4 py-3 text-base font-semibold cursor-pointer rounded-lg transition-all duration-200 border-l-4 ${
              isActive('/ai-chat')
                ? 'text-green-600 bg-green-50 border-green-600'
                : 'text-gray-700 hover:text-green-600 hover:bg-gray-50 border-transparent hover:border-green-600'
            }`}
          >
            AI 직업 추천
          </div>
          <div
            onClick={() => {
              router.push('/career-roadmap');
              setIsMobileMenuOpen(false);
            }}
            className={`block px-4 py-3 text-base font-semibold cursor-pointer rounded-lg transition-all duration-200 border-l-4 ${
              isActive('/career-roadmap')
                ? 'text-green-600 bg-green-50 border-green-600'
                : 'text-gray-700 hover:text-green-600 hover:bg-gray-50 border-transparent hover:border-green-600'
            }`}
          >
            커리어 로드맵
          </div>
          <div
            onClick={() => router.push('/heart-list')}
            className={`cursor-pointer transition-colors duration-200 px-4 py-2 text-center text-title-xsmall font-medium ${
              isActive('/heart-list')
                ? 'text-green-600'
                : 'text-gray-700 hover:!text-green-600'
            }`}
          >
            관심목록
          </div>

          {/* 모바일 로그인 버튼 */}
          <Link
            href="/member/login"
            className="block px-4 py-3 text-base font-semibold text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-lg transition-all duration-200 border-l-4 border-transparent hover:border-green-600"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            로그인
          </Link>
        </div>
      </div>
    </header>
  );
}
