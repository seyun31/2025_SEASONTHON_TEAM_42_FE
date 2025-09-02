# NextCareer

깔끔하고 개발하기 편한 Next.js 프로젝트입니다.

## 🚀 주요 특징

- **Pretendard Variable 폰트**: 한국어에 최적화된 폰트 시스템
- **Typography 시스템**: 재사용 가능한 Text 컴포넌트
- **깔끔한 구조**: 불필요한 파일들 제거 및 정리
- **Tailwind CSS**: 유틸리티 퍼스트 CSS 프레임워크
- **TypeScript**: 타입 안정성
- **React Query**: 서버 상태 관리
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
├── app/                   # Next.js App Router
│   ├── globals.css        # 글로벌 스타일 및 Typography 클래스
│   ├── layout.tsx         # 루트 레이아웃
│   └── page.tsx           # 홈페이지
├── components/
│   ├── ui/                # 재사용 가능한 UI 컴포넌트
│   │   ├── Text.tsx       # Typography 컴포넌트
│   │   └── index.ts       # Export 파일
│   └── providers.tsx      # React Query Provider
├── lib/
│   └── utils/
│       └── cn.ts          # 클래스 네임 유틸리티
└── hooks/                 # 커스텀 훅
```

## 🎯 개발 가이드

1. **컴포넌트 생성**: `src/components/ui/` 디렉토리에 재사용 가능한 컴포넌트를 생성
2. **페이지 추가**: `src/app/` 디렉토리에 새로운 페이지 생성
3. **스타일링**: Tailwind CSS 클래스와 Typography 시스템 활용
4. **상태 관리**: React Query (서버 상태) + Zustand (클라이언트 상태)

## 📄 네이밍 컨벤션

### 페이지 파일 (src/app/)

- **kebab-case**: 모든 페이지 디렉토리
  - `ai-job-recommendation/page.tsx`
  - `ai-job-posting-recommendation/page.tsx`
  - `ai-education-recommendation/page.tsx`
  - `home/page.tsx`
  - `test/page.tsx`

### 컴포넌트 파일 (src/components/)

- **PascalCase**: 모든 React 컴포넌트
  - `Header.tsx`
  - `Text.tsx`
  - `SplashScreen.tsx`

### 유틸리티/라이브러리 파일 (src/lib/)

- **camelCase**: 유틸리티 함수
  - `cn.ts`

### 설정 파일 (루트)

- **kebab-case**: 설정 관련 파일
  - `next.config.ts`
  - `next-env.d.ts`

### 이미지/에셋 파일 저장 위치

**정적 이미지 파일**

- **저장 위치**: `public/assets/images/`
- **네이밍**: kebab-case 사용
- **구조**:
  ```
  public/assets/
  ├── images/
  │   ├── icons/          # 아이콘 파일들
  │   ├── logos/          # 로고 파일들
  │   ├── illustrations/  # 일러스트
  │   └── backgrounds/    # 배경 이미지들
  └── fonts/              # 폰트 파일들
  ```

**동적/개발용 이미지 파일**

- **저장 위치**: `src/assets/images/`
- **사용 목적**: 개발 과정에서 사용되는 임시 이미지, 컴포넌트와 함께 번들되는 이미지

**예시**:

```
public/assets/images/icons/menu-icon.svg
public/assets/images/logos/company-logo.png
src/assets/images/placeholder-image.jpg
```

## 🔀 Git 워크플로우

### 커밋 컨벤션

```
<type>(<scope>): <subject>

예시:
feat(auth): 로그인 기능 구현
docs(readme): 설치 가이드 업데이트
```

**Type:**

- `feat`: 새로운 기능
- `fix`: 버그 수정
- `docs`: 문서 변경
- `style`: 코드 포맷팅 (로직 변경 없음)
- `refactor`: 코드 리팩토링
- `test`: 테스트 코드
- `chore`: 빌드, 설정 변경

### 브랜치 네이밍

```
<type>/<issue-number>-<description>

예시:
feat/123-login-feature
fix/456-mobile-menu-bug
docs/789-update-readme
```

### Pull Request 규칙

- **제목**: `[Type] 간단한 설명 (#issue-number)`
- **본문**: 변경사항과 테스트 방법 명시
- **연결**: 관련 이슈 번호 연결
- **리뷰**: 최소 1명 승인 후 머지 권장
- **머지**: Squash and merge 권장

## 📝 라이선스

MIT License
