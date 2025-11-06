'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Footer from '@/components/layout/Footer';

interface UserData {
  userId: number;
  name: string;
  socialProvider: string;
  socialId: string;
  email: string;
  profileImage: string;
  additionalInfo?: {
    birthDate: string | null;
    gender: string | null;
    address: string | null;
  };
}

interface ApiResponse {
  result: string;
  data: UserData;
  error: null | string;
}

export default function OAuth2SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasProcessed = useRef(false); // 중복 실행 방지

  // 토큰 값을 메모이제이션하여 의존성으로 사용
  const accessToken = useMemo(() => searchParams.get('access'), [searchParams]);
  const refreshToken = useMemo(
    () => searchParams.get('refresh'),
    [searchParams]
  );

  useEffect(() => {
    // 이미 처리 중이거나 완료된 경우 중복 실행 방지
    if (hasProcessed.current) {
      return;
    }

    // 토큰이 없으면 에러 처리
    if (!accessToken || !refreshToken) {
      setError('토큰이 없습니다.');
      setLoading(false);
      return;
    }

    const handleOAuthSuccess = async () => {
      // 처리 시작 표시
      hasProcessed.current = true;

      try {
        // 토큰을 쿠키에 저장
        document.cookie = `accessToken=${accessToken}; path=/; max-age=${7 * 24 * 60 * 60}; samesite=strict`;
        document.cookie = `refreshToken=${refreshToken}; path=/; max-age=${30 * 24 * 60 * 60}; samesite=strict`;

        // 사용자 정보 가져오기 (직접 백엔드로 요청)
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

        if (!backendUrl) {
          throw new Error('백엔드 URL이 설정되지 않았습니다.');
        }

        // URL 끝에 슬래시가 있으면 제거
        const cleanBackendUrl = backendUrl.replace(/\/$/, '');

        console.log(
          'Making request to backend with token:',
          accessToken.substring(0, 20) + '...'
        );
        console.log('Backend URL:', cleanBackendUrl);

        const response = await fetch(`${cleanBackendUrl}/v1/user`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        console.log('API response status:', response.status);

        if (!response.ok) {
          const errorData = await response.json();
          console.log('API error response:', errorData);
          throw new Error(
            `사용자 정보를 가져오는데 실패했습니다. ${errorData.details || ''}`
          );
        }

        const result: ApiResponse = await response.json();

        if (result.result === 'SUCCESS') {
          setUserData(result.data);
          // 사용자 정보를 localStorage에도 저장
          localStorage.setItem('userData', JSON.stringify(result.data));

          // additionalInfo의 birthDate나 gender가 없으면 회원가입 페이지로 이동
          const { additionalInfo } = result.data;
          if (!additionalInfo?.birthDate || !additionalInfo?.gender) {
            // 로딩 상태를 유지한 채로 리다이렉트
            router.push('/member/signup');
          } else {
            // 모든 정보가 있으면 메인 페이지로 리다이렉트
            // 로딩 상태를 유지한 채로 리다이렉트하여 중복 로딩 방지
            router.push('/');
          }
          // 리다이렉트 후에는 컴포넌트가 언마운트되므로 setLoading(false) 호출 불필요
          return;
        } else {
          throw new Error(
            result.error || '사용자 정보를 가져오는데 실패했습니다.'
          );
        }
      } catch (err) {
        console.error('OAuth 처리 중 오류:', err);
        hasProcessed.current = false; // 에러 발생 시 재시도 가능하도록
        setError(
          err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.'
        );
        setLoading(false);
      }
    };

    handleOAuthSuccess();
  }, [accessToken, refreshToken, router]); // 토큰 값이 변경될 때만 실행

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        {/* <p className="mt-4 text-gray-600 text-lg font-medium">로그인 중...</p> */}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-red-500 text-center">
          <h2 className="text-xl font-bold mb-2">로그인 실패</h2>
          <p className="mb-4">{error}</p>
          <button
            onClick={() => router.push('/member/login')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            다시 로그인하기
          </button>
        </div>
      </div>
    );
  }

  // 성공 시에는 바로 리다이렉트되므로 이 화면은 표시되지 않음
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p className="mt-4 text-gray-600 text-lg font-medium">
        {/* 메인 페이지로 이동 중... */}
      </p>
      <Footer />
    </div>
  );
}
