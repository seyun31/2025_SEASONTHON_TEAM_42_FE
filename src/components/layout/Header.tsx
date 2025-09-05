'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { getUserData, clearAuthData } from '@/lib/auth';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userData, setUserData] = useState<{
    userId: number;
    name: string;
    socialProvider: string;
    socialId: string;
    email: string;
    profileImage: string;
  } | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const user = getUserData();
    if (user) {
      setUserData(user);
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [pathname]); // pathname이 변경될 때마다 사용자 상태 확인

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActive = (path: string) => {
    if (path === '/ai-chat?chapter=job') {
      return pathname === '/ai-chat' && searchParams.get('chapter') === 'job';
    }
    return pathname === path;
  };

  const handleLogout = () => {
    clearAuthData();
    setUserData(null);
    setIsLoggedIn(false);
    router.push('/');
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
            width={148}
            height={80}
            className="h-10 w-auto"
          />
        </Link>

        {/* 데스크톱 네비게이션 */}
        <nav className="hidden md:flex flex-1 justify-center gap-8">
          <div
            onClick={() => router.push('/job-postings')}
            className={`cursor-pointer transition-colors duration-200 px-4 py-2 text-center text-title-small font-medium ${
              isActive('/job-postings')
                ? 'text-green-600'
                : 'text-gray-700 hover:!text-green-600'
            }`}
          >
            채용 공고
          </div>
          <div
            onClick={() => router.push('/education-programs')}
            className={`cursor-pointer transition-colors duration-200 px-4 py-2 text-center text-title-small font-medium ${
              isActive('/education-programs')
                ? 'text-green-600'
                : 'text-gray-700 hover:!text-green-600'
            }`}
          >
            교육 공고
          </div>
          <div
            onClick={() => router.push('/ai-chat?chapter=job')}
            className={`cursor-pointer transition-colors duration-200 px-4 py-2 text-center text-title-small font-medium ${
              isActive('/ai-chat?chapter=job')
                ? 'text-green-600'
                : 'text-gray-700 hover:!text-green-600'
            }`}
          >
            AI 직업 추천
          </div>
          <div
            onClick={() => router.push('/career-roadmap')}
            className={`cursor-pointer transition-colors duration-200 px-4 py-2 text-center text-title-small font-medium ${
              isActive('/career-roadmap')
                ? 'text-green-600'
                : 'text-gray-700 hover:!text-green-600'
            }`}
          >
            커리어 로드맵
          </div>
        </nav>

        {/* 데스크톱 로그인 버튼 */}
        <div className="hidden md:flex justify-center items-center w-32 gap-3 relative">
          {isLoggedIn ? (
            <>
              <div
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                {/* 사용자 프로필 이미지 */}
                <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center">
                  {userData?.profileImage ? (
                    <Image
                      src={userData.profileImage}
                      alt="프로필 이미지"
                      width={32}
                      height={32}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/default-profile.png';
                      }}
                    />
                  ) : (
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
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-m font-medium text-gray-800">
                    {userData?.name || '사용자'}
                  </span>
                </div>
                {isDropdownOpen ? (
                  <BsChevronUp className="w-4 h-4 text-black" />
                ) : (
                  <BsChevronDown className="w-4 h-4 text-black" />
                )}
              </div>

              {/* 로그인 상태 드롭박스 모달 */}
              {isDropdownOpen && (
                <div
                  className="absolute top-full right-0 mt-2 w-[180px] bg-white rounded-[12px]"
                  style={{
                    boxShadow: '0px 10px 20px 0px #11111126',
                    aspectRatio: '180/192',
                  }}
                >
                  <div className="p-4 h-full flex flex-col">
                    <div className="flex-1 flex flex-col justify-center">
                      <button
                        onClick={() => {
                          router.push('/my');
                          setIsDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-base font-medium text-black cursor-pointer flex items-center gap-2"
                      >
                        <Image
                          src="/assets/Icons/drop-user.svg"
                          alt="마이페이지"
                          width={16}
                          height={16}
                          className="w-4 h-4"
                        />
                        마이페이지
                      </button>
                      <button
                        onClick={() => {
                          router.push('/edit');
                          setIsDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-base font-medium cursor-pointer flex items-center gap-2"
                      >
                        <Image
                          src="/assets/Icons/drop-edit.svg"
                          alt="개인정보 수정"
                          width={16}
                          height={16}
                          className="w-4 h-4"
                        />
                        개인정보 수정
                      </button>
                      <button
                        onClick={() => {
                          router.push('/heart-lists');
                          setIsDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-base font-medium text-black cursor-pointer flex items-center gap-2"
                      >
                        <Image
                          src="/assets/Icons/drop-star.svg"
                          alt="관심 목록"
                          width={16}
                          height={16}
                          className="w-4 h-4"
                        />
                        관심 목록
                      </button>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-base font-medium text-black cursor-pointer flex items-center gap-2"
                      >
                        <Image
                          src="/assets/Icons/drop-sign-out.svg"
                          alt="로그아웃"
                          width={16}
                          height={16}
                          className="w-4 h-4"
                        />
                        로그아웃
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <button
              onClick={() => router.push('/member/login')}
              className="relative h-11 w-18 shrink-0 rounded-[12px] bg-primary-90 text-white text-s font-normal cursor-pointer"
            >
              로그인
            </button>
          )}
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
              router.push('/ai-chat?chapter=job');
              setIsMobileMenuOpen(false);
            }}
            className={`block px-4 py-3 text-base font-semibold cursor-pointer rounded-lg transition-all duration-200 border-l-4 ${
              isActive('/ai-chat?chapter=job')
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

          {/* 모바일 로그인/로그아웃 버튼 */}
          {isLoggedIn ? (
            <div className="px-4 py-3">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center">
                  {userData?.profileImage ? (
                    <Image
                      src={userData.profileImage}
                      alt="프로필 이미지"
                      width={32}
                      height={32}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/default-profile.png';
                      }}
                    />
                  ) : (
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
                  )}
                </div>
                <span className="text-base font-semibold text-gray-800">
                  {userData?.name || '사용자'}
                </span>
              </div>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left text-sm text-gray-500 hover:text-red-600 transition-colors duration-200"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <Link
              href="/member/login"
              className="block px-4 py-3 text-base font-semibold text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-lg transition-all duration-200 border-l-4 border-transparent hover:border-green-600"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              로그인
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
