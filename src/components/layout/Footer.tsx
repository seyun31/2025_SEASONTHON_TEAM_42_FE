import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#1E293B] text-white">
      <div className="mx-auto w-full max-w-screen-xl p-12">
        <div className="grid gap-10 md:grid-cols-[2fr_1fr_1fr_1fr]">
          {/* 서비스 소개 */}
          <div>
            <h2 className="mb-2 text-lg font-bold">NextCareer</h2>
            <p className="text-sm leading-relaxed">
              중장년층을 위한 맞춤형 구직 서비스로,
              <br />
              AI 기반 커리어 상담부터 교육 프로그램까지
              <br />
              제2의 직업을 찾는 모든 과정을 지원합니다.
            </p>
          </div>

          {/* 주요 서비스 */}
          <div>
            <h2 className="mb-2 text-lg font-bold">주요 서비스</h2>
            <nav className="flex flex-col space-y-1 text-sm">
              <Link href="/ai-chat" className="hover:underline">
                AI 커리어 상담
              </Link>
              <Link href="/career-roadmap" className="hover:underline">
                커리어 로드맵
              </Link>
              <Link href="/education-programs" className="hover:underline">
                교육 프로그램
              </Link>
              <Link href="/job-postings" className="hover:underline">
                채용 공고
              </Link>
            </nav>
          </div>

          {/* 고객 지원 */}
          <div>
            <h2 className="mb-2 text-lg font-bold">고객 지원</h2>
            <nav className="flex flex-col space-y-1 text-sm">
              <Link href="/my" className="hover:underline">
                마이페이지
              </Link>
              <Link href="/heart-lists" className="hover:underline">
                관심 목록
              </Link>
              <Link href="/edit" className="hover:underline">
                프로필 수정
              </Link>
              <a href="#" className="hover:underline">
                고객센터
              </a>
            </nav>
          </div>

          {/* 회사 정보 */}
          <div>
            <h2 className="mb-2 text-lg font-bold">회사 정보</h2>
            <nav className="flex flex-col space-y-1 text-sm">
              <a href="#" className="hover:underline">
                서비스 소개
              </a>
              <a href="#" className="hover:underline">
                이용약관
              </a>
              <a href="#" className="hover:underline">
                개인정보처리방침
              </a>
              <a href="#" className="hover:underline">
                제휴 문의
              </a>
            </nav>
          </div>
        </div>

        {/* 구분선 */}
        <div className="my-10 h-px w-full bg-white" />

        {/* 하단 정보 */}
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="flex flex-col items-center space-y-1 text-xs">
            <p>
              <strong>이메일:</strong> support@nextcareer.com
            </p>
            <p>
              <strong>고객센터:</strong> 1588-0000 (평일 09:00-18:00)
            </p>
          </div>
          <p className="text-xs text-gray-300">
            © 2025 NextCareer. 중장년층의 새로운 시작을 응원합니다.
          </p>
        </div>
      </div>
    </footer>
  );
}
