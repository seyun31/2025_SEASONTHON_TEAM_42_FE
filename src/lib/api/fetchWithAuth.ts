interface FetchWithAuthOptions extends RequestInit {
  skipRefresh?: boolean; // 토큰 재발급을 건너뛸지 여부
}

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

// 토큰 재발급 함수
async function refreshTokens(): Promise<boolean> {
  try {
    const response = await fetch('/api/auth/refresh-tokens', {
      method: 'POST',
      credentials: 'include', // 쿠키 포함
    });

    if (!response.ok) {
      return false;
    }

    const result = await response.json();
    return result.result === 'SUCCESS';
  } catch (error) {
    console.error('토큰 재발급 실패:', error);
    return false;
  }
}

/**
 * 인증이 필요한 API 요청을 위한 fetch wrapper
 * @param url - 요청 URL
 * @param options - fetch 옵션
 * @returns fetch Response
 */
export async function fetchWithAuth(
  url: string,
  options: FetchWithAuthOptions = {}
): Promise<Response> {
  const { skipRefresh = false, ...fetchOptions } = options;
  const requestOptions: RequestInit = {
    ...fetchOptions,
    credentials: 'include',
  };

  // 첫 번째 요청 시도
  let response = await fetch(url, requestOptions);

  // 401 에러가 아니거나 skipRefresh가 true면 바로 반환
  if (response.status !== 401 || skipRefresh) {
    return response;
  }

  // 이미 토큰 재발급 중이면 대기
  if (isRefreshing && refreshPromise) {
    const success = await refreshPromise;
    if (success) {
      // 재발급 성공 시 요청 재시도
      return fetch(url, requestOptions);
    }
    return response;
  }

  // 토큰 재발급 시작
  isRefreshing = true;
  refreshPromise = refreshTokens();

  try {
    const refreshSuccess = await refreshPromise;

    if (refreshSuccess) {
      // 토큰 재발급 성공 - 원래 요청 재시도
      response = await fetch(url, requestOptions);
    } else {
      // 토큰 재발급 실패 - 메인 페이지로 리다이렉트
      console.warn('토큰 재발급 실패 - 세션이 만료되었습니다.');
      // 클라이언트 사이드에서만 리다이렉트
      if (typeof window !== 'undefined') {
        // ai-chat 페이지에서는 리다이렉트하지 않고 에러 컴포넌트 표시
        const currentPath = window.location.pathname;
        if (!currentPath.startsWith('/ai-chat/')) {
          window.location.href = '/';
        }
      }
    }

    return response;
  } finally {
    isRefreshing = false;
    refreshPromise = null;
  }
}

/**
 * JSON 응답을 자동으로 파싱하는 fetchWithAuth wrapper
 * @param url - 요청 URL
 * @param options - fetch 옵션
 * @returns 파싱된 JSON 데이터
 */
export async function fetchJsonWithAuth<T = unknown>(
  url: string,
  options: FetchWithAuthOptions = {}
): Promise<T> {
  const response = await fetchWithAuth(url, options);

  if (!response.ok) {
    const error = (await response.json().catch(() => ({
      message: 'API 요청 실패',
    }))) as { message?: string };
    throw new Error(error.message || 'API 요청 실패');
  }

  return response.json() as Promise<T>;
}
