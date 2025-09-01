import Image from 'next/image';

export default function Login() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      {/* 박스 */}
      <div className="relative w-[30.5vw] h-[57.6vh] border-4 border-primary-90 rounded-[32px] flex flex-col items-center justify-center">
        {/* 박스 배경 오버레이 */}
        <div className="absolute inset-0 rounded-[32px] bg-primary-20 opacity-50 pointer-events-none" />

        {/* 로고 이미지 */}
        <div className="relative z-10">
          <Image
            src="/assets/logos/name-logo.svg"
            alt="nextcareer 메인 로고"
            width={100}
            height={41}
          />
        </div>

        {/* 카카오 로그인 버튼 */}
        <div className="relative z-10">
          <Image
            src="/assets/Icons/kakao-login-large-wide.svg"
            alt="카카오 로그인 버튼"
            width={234}
            height={41}
          />
        </div>

        {/* 비회원 멘트 */}
        <div className="relative z-10 text-[0.94vw]">
          아직 회원이 아니신가요?
        </div>

        {/* 카카오로 시작하기 */}
        <div className="relative z-10">
          <Image
            src="/assets/Icons/kakao-login-medium-narrow.svg"
            alt="카카오 시작하기 버튼"
            width={98}
            height={28}
          />
        </div>
      </div>
    </div>
  );
}
