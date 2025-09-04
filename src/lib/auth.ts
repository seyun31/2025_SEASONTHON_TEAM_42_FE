// 쿠키에서 토큰을 가져오는 유틸리티 함수들

export function getAccessToken(): string | null {
  if (typeof document === 'undefined') return null;

  const cookies = document.cookie.split(';');
  const accessTokenCookie = cookies.find((cookie) =>
    cookie.trim().startsWith('accessToken=')
  );

  return accessTokenCookie ? accessTokenCookie.split('=')[1] : null;
}

export function getRefreshToken(): string | null {
  if (typeof document === 'undefined') return null;

  const cookies = document.cookie.split(';');
  const refreshTokenCookie = cookies.find((cookie) =>
    cookie.trim().startsWith('refreshToken=')
  );

  return refreshTokenCookie ? refreshTokenCookie.split('=')[1] : null;
}

export function getUserData(): {
  userId: number;
  name: string;
  socialProvider: string;
  socialId: string;
  email: string;
  profileImage: string;
} | null {
  if (typeof window === 'undefined') return null;

  const userData = localStorage.getItem('userData');
  return userData ? JSON.parse(userData) : null;
}

export function clearAuthData(): void {
  if (typeof document === 'undefined' || typeof window === 'undefined') return;

  // 쿠키 삭제
  document.cookie =
    'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  document.cookie =
    'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

  // localStorage에서 사용자 데이터 삭제
  localStorage.removeItem('userData');
}

export async function fetchUserData(): Promise<{
  userId: number;
  name: string;
  socialProvider: string;
  socialId: string;
  email: string;
  profileImage: string;
} | null> {
  const accessToken = getAccessToken();
  if (!accessToken) return null;

  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    if (!backendUrl) {
      throw new Error('백엔드 URL이 설정되지 않았습니다.');
    }

    // URL 끝에 슬래시가 있으면 제거
    const cleanBackendUrl = backendUrl.replace(/\/$/, '');

    const response = await fetch(`${cleanBackendUrl}/v1/user`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('사용자 정보를 가져오는데 실패했습니다.');
    }

    const result = await response.json();

    if (result.result === 'SUCCESS') {
      localStorage.setItem('userData', JSON.stringify(result.data));
      return result.data;
    }

    return null;
  } catch (error) {
    console.error('사용자 정보 가져오기 실패:', error);
    return null;
  }
}
