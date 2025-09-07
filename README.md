# ✨ NextCareer

NextCareer은 중장년층을 위한 맞춤형 구직 서비스로,
AI 기반 맞춤형 직업 추천과 일자리 매칭, 실행 로드맵 제공까지
제 2의 직업을 찾는 모든 과정을 지원합니다.

<img width="1920" height="1080" alt="KakaoTalk_Photo_2025-09-07-07-43-22" src="https://github.com/user-attachments/assets/1985385d-edbc-4cfd-a730-66e3630b49a8" />

## 🚀 주요 특징

- **Pretendard Variable 폰트**: 한국어에 최적화된 폰트 시스템
- **Typography 시스템**: 재사용 가능한 Text 컴포넌트
- **깔끔한 구조**: 불필요한 파일들 제거 및 정리
- **Tailwind CSS**: 유틸리티 퍼스트 CSS 프레임워크
- **TypeScript**: 타입 안정성
- **Zustand**: 서버 상태 관리
- **PWA 지원**: Progressive Web App

## 🛠️ 기술 스택

- Next.js 15.5.0
- React 19.1.0
- TypeScript
- Tailwind CSS 4
- React Query (TanStack Query)
- Zustand
- React Hook Form
- Pretendard Variable 폰트

## 📦 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 프로덕션 실행
npm start

# 린트 검사
npm run lint

# 코드 포맷팅
npm run format
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🎨 Typography 시스템

Text 컴포넌트를 사용하여 일관된 타이포그래피를 적용할 수 있습니다:

```tsx
import { Text } from '../components/ui/Text';

// 사용 예시
<Text variant="header-large">대제목</Text>
<Text variant="title-medium">중간 제목</Text>
<Text variant="body-medium-regular">본문 텍스트</Text>
<Text variant="caption-small">작은 캡션</Text>
```

### 사용 가능한 Typography Variants

- Header: `header-large`, `header-medium`, `header-small`
- Title: `title-xlarge`, `title-large`, `title-medium`, `title-small`, `title-xsmall`
- Body: `body-large-medium`, `body-large-regular`, `body-medium-medium`, `body-medium-regular`, `body-small-medium`, `body-small-regular`
- Caption: `caption-large`, `caption-small`

## 📁 프로젝트 구조

```
src/
├── app/                     # Next.js App Router
│   ├── (auth)/              # 인증 관련 라우트 그룹
│   │   └── member/          # 회원가입, 로그인
│   ├── ai-chat/             # AI 채팅 페이지
│   │   ├── job/             # 직업 추천 채팅
│   │   └── roadmap/         # 로드맵 생성 채팅
│   ├── api/                 # API 라우트
│   │   ├── auth/            # 인증 API
│   │   └── chat/            # 채팅 관련 API
│   ├── career-roadmap/      # 커리어 로드맵
│   ├── education-programs/  # 교육 프로그램
│   ├── job-postings/        # 채용 공고
│   ├── heart-lists/         # 관심 목록
│   ├── my/                  # 마이 페이지
│   ├── main/                # 메인 페이지
│   ├── globals.css          # 글로벌 스타일
│   ├── layout.tsx           # 루트 레이아웃
│   └── page.tsx             # 홈페이지
├── components/              # React 컴포넌트
│   ├── card-component/      # 카드 컴포넌트
│   ├── layout/              # 레이아웃 컴포넌트
│   ├── roadmap/             # 로드맵 컴포넌트
│   ├── sections/            # 섹션 컴포넌트
│   ├── ui/                  # 재사용 UI 컴포넌트
│   └── providers/           # Context Provider
├── contexts/                # React Context
├── stores/                  # Zustand 상태 관리
├── apis/                    # API 클라이언트
├── data/                    # 정적 데이터
├── lib/                     # 유틸리티 라이브러리
│   ├── types/               # TypeScript 타입 정의
│   └── utils/               # 유틸리티 함수
├── mock/                    # 목 데이터
└── types/                   # 추가 타입 정의
```

## 🎯 개발 가이드

1. **컴포넌트 생성**: `src/components/ui/` 디렉토리에 재사용 가능한 컴포넌트를 생성
2. **페이지 추가**: `src/app/` 디렉토리에 새로운 페이지 생성
3. **스타일링**: Tailwind CSS 클래스와 Typography 시스템 활용
4. **상태 관리**: React Query (서버 상태) + Zustand (클라이언트 상태)

## 📝 라이선스

MIT License

