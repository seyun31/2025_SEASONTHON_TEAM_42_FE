'use client';

import Image from 'next/image';

export default function Login() {
  const handleKakaoLogin = () => {
    window.location.href =
      'https://api.ilhaeng.cloud/oauth2/authorization/kakao';
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      {/* 박스 */}
      <div className="relative w-[30.5vw] h-[57.6vh] border-4 border-primary-90 rounded-[32px] flex flex-col items-center justify-center">
        {/* 박스 배경 오버레이 */}
        <div className="absolute inset-0 rounded-[32px] bg-primary-20 opacity-50 pointer-events-none" />

        {/* 로고 이미지 */}
        <div className="absolute top-[11%] left-1/2 transform -translate-x-1/2 z-10">
          <Image
            src="/assets/logos/name-logo.svg"
            alt="nextcareer 메인 로고"
            width={0}
            height={0}
            className="w-[9.7vw] h-auto"
          />
        </div>

        {/* 카카오 로그인 버튼 */}
        <button
          onClick={handleKakaoLogin}
          className="absolute top-[49%] left-1/2 transform -translate-x-1/2 z-10 cursor-pointer hover:opacity-80 transition-opacity duration-200"
        >
          <Image
            src="/assets/Icons/kakao-login-large-wide.svg"
            alt="카카오 로그인 버튼"
            width={0}
            height={0}
            className="w-[22.8vw] h-auto"
          />
        </button>

        {/* 비회원 멘트 */}
        <div className="absolute z-10 bottom-[21%] left-1/2 transform -translate-x-1/2 text-[0.94vw]">
          아직 회원이 아니신가요?
        </div>

        {/* 카카오로 시작하기 */}
        <button
          onClick={handleKakaoLogin}
          className="absolute bottom-[8%] left-1/2 transform -translate-x-1/2 z-10 cursor-pointer hover:opacity-80 transition-opacity duration-200"
        >
          <Image
            src="/assets/Icons/kakao-login-medium-narrow.svg"
            alt="카카오 시작하기 버튼"
            width={0}
            height={0}
            className="w-[9.5vw] h-auto"
          />
        </button>
      </div>
    </div>
  );
}
