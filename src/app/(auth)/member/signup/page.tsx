export default function Signup() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {/* 사용자 정보 박스 */}
      <div className="relative w-[30.5vw] h-[57.6vh] border-4 border-primary-90 rounded-[32px] flex flex-col items-center justify-center">
        {/* 박스 배경 오버레이 */}
        <div className="absolute inset-0 rounded-[32px] bg-primary-20 opacity-50 pointer-events-none" />
      </div>

      {/* 시작하기 버튼 */}
      <div className="relative">
        {/* 버튼 배경 오버레이 */}
        <div className="absolute inset-0 rounded-[16px] bg-primary-20 opacity-50 pointer-events-none" />
        <button className="relative z-10 w-[30.5vw] py-4 rounded-[16px] border-2 border-primary-90 font-semibold">
          넥스트 커리어 시작하기
        </button>
      </div>
    </div>
  );
}
