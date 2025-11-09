'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
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

  useEffect(() => {
    const handleOAuthSuccess = async () => {
      try {
        // URL에서 access와 refresh 토큰 추출
        const accessToken = searchParams.get('access');
        const refreshToken = searchParams.get('refresh');

        if (!accessToken || !refreshToken) {
          throw new Error('토큰이 없습니다.');
        }

        // 토큰을 httpOnly 쿠키에 저장 (보안)
        const setTokenResponse = await fetch('/api/auth/set-tokens', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ accessToken, refreshToken }),
        });

        if (!setTokenResponse.ok) {
          throw new Error('토큰 저장에 실패했습니다.');
        }

        // 사용자 정보 가져오기 (Next.js API Route를 통해)
        const userInfoResponse = await fetch('/api/auth/user', {
          method: 'GET',
          credentials: 'include', // 쿠키 포함
        });

        if (!userInfoResponse.ok) {
          const errorData = await userInfoResponse.json();
          throw new Error(
            errorData.error?.message || '사용자 정보를 가져오는데 실패했습니다.'
          );
        }

        const result: ApiResponse = await userInfoResponse.json();

        if (result.result === 'SUCCESS') {
          setUserData(result.data);
          // 사용자 정보를 localStorage에도 저장 (선택사항)
          localStorage.setItem('userData', JSON.stringify(result.data));

          // additionalInfo의 birthDate나 gender가 없으면 회원가입 페이지로 이동
          const { additionalInfo } = result.data;
          if (!additionalInfo?.birthDate || !additionalInfo?.gender) {
            router.push('/member/signup');
          } else {
            // 모든 정보가 있으면 메인 페이지로 리다이렉트
            router.push('/');
          }
        } else {
          throw new Error(
            result.error || '사용자 정보를 가져오는데 실패했습니다.'
          );
        }
      } catch (err) {
        console.error('OAuth 처리 중 오류:', err);
        setError(
          err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.'
        );
      } finally {
        setLoading(false);
      }
    };

    handleOAuthSuccess();
  }, [searchParams, router]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-white/60 backdrop-blur-lg z-40 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Image
            src="/assets/Icons/character_running.webp"
            alt="loading"
            width={328}
            height={293}
            className="mb-8 md:mb-16 w-[200px] h-auto md:w-[328px]"
          />
          <p className="text-2xl md:text-3xl font-semibold text-gray-50">
            로그인중
          </p>
        </div>
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
    <div className="fixed inset-0 bg-white/60 backdrop-blur-lg z-40 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Image
          src="/assets/Icons/character_running.webp"
          alt="loading"
          width={328}
          height={293}
          className="mb-8 md:mb-16 w-[200px] h-auto md:w-[328px]"
        />
        <p className="text-2xl md:text-3xl font-semibold text-gray-50">
          로그인중
        </p>
      </div>
      <Footer />
    </div>
  );
}
