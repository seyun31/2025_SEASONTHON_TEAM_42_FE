// 인증 관련 유틸리티 함수들 (HttpOnly 쿠키 사용)

export interface UserData {
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

// 액세스 토큰 접근
export function getAccessToken(): string | null {
  console.warn(
    'getAccessToken is deprecated: 토큰이 HttpOnly 쿠키로 저장되어 클라이언트에서 접근할 수 없습니다. fetchWithAuth를 사용하세요.'
  );
  return null;
}

// 리프레시 토큰 접근
export function getRefreshToken(): string | null {
  console.warn(
    'getRefreshToken is deprecated: 토큰이 HttpOnly 쿠키로 저장되어 클라이언트에서 접근할 수 없습니다.'
  );
  return null;
}

// 로컬 스토리지에서 사용자 데이터 접근
export function getUserData(): UserData | null {
  if (typeof window === 'undefined') return null;

  try {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error reading userData from localStorage:', error);
    return null;
  }
}

// 인증 데이터 삭제 (로그아웃 시 사용) -> 즉시 로컬 데이터 삭제, 서버 호출은 백그라운드에서
export function clearAuthData(): void {
  if (typeof window === 'undefined') return;

  // localStorage에서 사용자 데이터 즉시 삭제
  localStorage.removeItem('userData');

  // 서버의 HttpOnly 쿠키 삭제를 위한 API 호출 (백그라운드에서 실행)
  fetch('/api/auth/logout', {
    method: 'POST',
    credentials: 'include',
  }).catch((error) => {
    console.error('로그아웃 API 호출 실패:', error);
  });
}

// API 호출을 통해 사용자 정보 가져오기
export async function fetchUserData(): Promise<UserData | null> {
  try {
    const response = await fetch('/api/auth/user', {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('사용자 정보를 가져오는데 실패했습니다.');
    }

    const result = await response.json();

    if (result.result === 'SUCCESS') {
      // localStorage에 저장
      if (typeof window !== 'undefined') {
        localStorage.setItem('userData', JSON.stringify(result.data));
      }
      return result.data;
    }

    return null;
  } catch (error) {
    console.error('사용자 정보 가져오기 실패:', error);
    return null;
  }
}
