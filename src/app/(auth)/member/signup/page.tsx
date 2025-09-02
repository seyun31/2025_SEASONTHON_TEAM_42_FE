import Image from 'next/image';

export default function Signup() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* 사용자 정보 박스 */}
        <div className="relative w-[30.5vw] h-[57.6vh] border-4 border-primary-90 rounded-[32px] flex items-center justify-center">
          <div className="absolute inset-0 rounded-[32px] bg-primary-20 opacity-50 pointer-events-none" />
        </div>

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

        {/* 시작하기 버튼 */}
        <div className="relative">
          <div className="absolute inset-0 rounded-[16px] bg-primary-20 opacity-50 pointer-events-none" />
          <button className="relative z-10 w-[30.5vw] h-[11.1vh] rounded-[24px] border-4 border-primary-90 text-title-medium">
            넥스트 커리어 시작하기
          </button>
        </div>
      </div>
    </div>
  );
}
