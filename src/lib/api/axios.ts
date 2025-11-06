import axios, {
  AxiosError,
  type InternalAxiosRequestConfig,
  type AxiosRequestConfig,
} from 'axios';

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean; // 요청 재시도 여부를 나타내는 플래그
}

// 전역 변수로 refresh 요청의 Promise를 저장해서 중복 요청을 방지
let refreshPromise: Promise<boolean> | null = null;

// 대기 중인 요청을 저장하는 배열
let refreshSubscribers: Array<(success: boolean) => void> = [];

// Refresh Token이 갱신되면 대기 중인 요청들을 재실행
const onRefreshed = (success: boolean) => {
  refreshSubscribers.forEach((callback) => callback(success));
  refreshSubscribers = [];
};

export const axiosInstance = axios.create({
  baseURL: '/api', // Next.js API routes 사용
  withCredentials: true, // 쿠키 자동 포함
});

// 응답 인터셉터: 401 에러 발생 -> refreshToken으로 토큰 갱신 시도
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    // config가 없는 경우 에러 반환
    if (!originalRequest) {
      return Promise.reject(error);
    }

    // 401 에러면서, 아직 재시도 하지 않은 요청인 경우 처리
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      // refresh 엔드포인트에서 401 에러가 발생한 경우, 로그아웃 처리
      if (originalRequest.url?.includes('/auth/refresh-tokens')) {
        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }
        return Promise.reject(error);
      }

      // 재시도 플래그 설정
      originalRequest._retry = true;

      // 이미 refresh 요청을 진행 중이면, 그 Promise를 재사용
      if (!refreshPromise) {
        refreshPromise = (async () => {
          try {
            const response = await fetch('/api/auth/refresh-tokens', {
              method: 'POST',
              credentials: 'include', // 쿠키 포함
            });

            if (!response.ok) {
              // 에러 응답 파싱하여 상세 정보 출력
              let errorDetails = '';
              try {
                const errorData = await response.json();
                errorDetails =
                  errorData.error?.message ||
                  errorData.error?.code ||
                  'Unknown error';
                console.error('[Token Refresh] 실패:', {
                  status: response.status,
                  statusText: response.statusText,
                  error: errorData,
                });
              } catch (parseError) {
                console.error('[Token Refresh] 에러 응답 파싱 실패');
              }
              throw new Error(
                `Token refresh failed (${response.status}): ${errorDetails}`
              );
            }

            const result = await response.json();
            return result.result === 'SUCCESS';
          } catch (error) {
            console.error('토큰 재발급 실패:', error);
            return false;
          } finally {
            refreshPromise = null;
          }
        })();
      }

      // refresh 요청이 끝나면, 대기 중인 요청들을 재실행
      try {
        const success = await refreshPromise;

        if (success) {
          onRefreshed(true);
          // 원래 요청 재시도
          return axiosInstance(originalRequest);
        } else {
          onRefreshed(false);
          // Refresh 실패 시 로그인 페이지로 리다이렉트
          if (typeof window !== 'undefined') {
            window.location.href = '/';
          }
          return Promise.reject(error);
        }
      } catch (refreshError) {
        onRefreshed(false);
        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// 편의를 위한 래퍼 함수들
export const api = {
  get: <T = undefined>(url: string, config?: undefined) =>
    axiosInstance.get<T>(url, config),
  post: <T = undefined>(url: string, data?: undefined, config?: undefined) =>
    axiosInstance.post<T>(url, data, config),
  put: <T = undefined>(url: string, data?: undefined, config?: undefined) =>
    axiosInstance.put<T>(url, data, config),
  delete: <T = undefined>(url: string, config?: undefined) =>
    axiosInstance.delete<T>(url, config),
  patch: <T = undefined>(url: string, data?: undefined, config?: undefined) =>
    axiosInstance.patch<T>(url, data, config),
};

// 백엔드 직접 호출을 위한 axios 인스턴스 (토큰은 쿠키로 자동 전송)
export const backendApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true,
});

// 백엔드 API에도 동일한 401 에러 처리 적용
backendApi.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      if (!refreshPromise) {
        refreshPromise = (async () => {
          try {
            const response = await fetch('/api/auth/refresh-tokens', {
              method: 'POST',
              credentials: 'include',
            });

            if (!response.ok) {
              // 에러 응답 파싱하여 상세 정보 출력
              let errorDetails = '';
              try {
                const errorData = await response.json();
                errorDetails =
                  errorData.error?.message ||
                  errorData.error?.code ||
                  'Unknown error';
                console.error('[Token Refresh] 실패:', {
                  status: response.status,
                  statusText: response.statusText,
                  error: errorData,
                });
              } catch (parseError) {
                console.error('[Token Refresh] 에러 응답 파싱 실패');
              }
              throw new Error(
                `Token refresh failed (${response.status}): ${errorDetails}`
              );
            }

            const result = await response.json();
            return result.result === 'SUCCESS';
          } catch (error) {
            console.error('토큰 재발급 실패:', error);
            return false;
          } finally {
            refreshPromise = null;
          }
        })();
      }

      try {
        const success = await refreshPromise;

        if (success) {
          onRefreshed(true);
          return backendApi(originalRequest);
        } else {
          onRefreshed(false);
          if (typeof window !== 'undefined') {
            window.location.href = '/';
          }
          return Promise.reject(error);
        }
      } catch (refreshError) {
        onRefreshed(false);
        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
