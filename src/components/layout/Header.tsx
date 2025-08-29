'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="fixed inset-x-0 top-0 flex flex-col items-center justify-center h-auto text--black bg-white z-50">
      <div className="mx-auto flex h-16 w-full items-center justify-around px-4 md:px-8 lg:w-[70%]">
        {/* 로고 */}
        <Link
          href="/"
          className="flex justify-center items-center relative h-12 w-28 shrink-0"
        >
          <Image
            src="/assets/logo.svg"
            alt="nextcareer 로고"
            width={120}
            height={40}
            className="h-8 w-auto"
          />
        </Link>

        {/* 데스크톱 네비게이션 */}
        <nav className="hidden md:flex flex-1 justify-center gap-8">
          <Link
            href="/job-postings"
            className="text-gray-700 hover:!text-green-600 transition-colors duration-200 px-4 py-2 text-center text-title-small font-medium"
          >
            채용공고
          </Link>
          <Link
            href="/education-programs"
            className="text-gray-700 hover:!text-green-600 transition-colors duration-200 px-4 py-2 text-center text-title-small font-medium"
          >
            교육 프로그램 공고
          </Link>
          <Link
            href="/ai-job-test"
            className="text-gray-700 hover:!text-green-600 transition-colors duration-200 px-4 py-2 text-center text-title-small font-medium"
          >
            AI 직업 적합도 검사
          </Link>
          <Link
            href="/career-roadmap"
            className="text-gray-700 hover:!text-green-600 transition-colors duration-200 px-4 py-2 text-center text-title-small font-medium"
          >
            커리어 로드맵
          </Link>
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
            href="/login"
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
          <Link
            href="/job-postings"
            className="block px-4 py-3 text-base font-semibold text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-lg transition-all duration-200 border-l-4 border-transparent hover:border-green-600"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            채용공고
          </Link>
          <Link
            href="/education-programs"
            className="block px-4 py-3 text-base font-semibold text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-lg transition-all duration-200 border-l-4 border-transparent hover:border-green-600"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            교육 프로그램 공고
          </Link>
          <Link
            href="/ai-job-test"
            className="block px-4 py-3 text-base font-semibold text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-lg transition-all duration-200 border-l-4 border-transparent hover:border-green-600"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            AI 직업 적합도 검사
          </Link>
          <Link
            href="/career-roadmap"
            className="block px-4 py-3 text-base font-semibold text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-lg transition-all duration-200 border-l-4 border-transparent hover:border-green-600"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            커리어 로드맵
          </Link>

          {/* 모바일 로그인 버튼 */}
          <Link
            href="/login"
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
