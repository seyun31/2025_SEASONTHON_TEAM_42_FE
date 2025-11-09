import axios, {
  AxiosError,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from 'axios';

interface CustomRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// refresh 중복 방지용 Promise
let refreshPromise: Promise<void> | null = null;

// axios 인스턴스 (Next.js API routes 사용)
export const axiosInstance = axios.create({
  baseURL: '', // 빈 문자열 (전체 경로 사용)
  withCredentials: true,
});

// 401 감지 → refresh → 원래 요청 재시도
axiosInstance.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomRequestConfig;

    if (!error.response) return Promise.reject(error);

    // accessToken 만료 (401)
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      console.log('[Axios] 401 감지 → refresh 시도');

      // refresh 도중이면 기존 promise 재사용
      if (!refreshPromise) {
        refreshPromise = fetch('/api/auth/refresh-tokens', {
          method: 'POST',
          credentials: 'include',
        })
          .then((res) => {
            if (!res.ok) {
              throw new Error('Token refresh failed');
            }
            console.log('[Axios] refresh 성공');
          })
          .catch((err) => {
            console.log('[Axios] refresh 실패 → logout');
            if (typeof window !== 'undefined') {
              // ai-chat 페이지에서는 리다이렉트하지 않고 에러 컴포넌트 표시
              const currentPath = window.location.pathname;
              if (!currentPath.startsWith('/ai-chat/')) {
                window.location.href = '/';
              }
            }
            throw err;
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      // refresh 종료 기다림
      await refreshPromise;

      // 원래 요청 재시도
      return axiosInstance(originalRequest);
    }

    return Promise.reject(error);
  }
);

// 편의를 위한 래퍼 함수들
export const api = {
  get: <T = unknown>(url: string, config?: AxiosRequestConfig) =>
    axiosInstance.get<T>(url, config),
  post: <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ) => axiosInstance.post<T>(url, data, config),
  put: <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ) => axiosInstance.put<T>(url, data, config),
  delete: <T = unknown>(url: string, config?: AxiosRequestConfig) =>
    axiosInstance.delete<T>(url, config),
  patch: <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ) => axiosInstance.patch<T>(url, data, config),
};

// 백엔드 직접 호출을 위한 axios 인스턴스
export const backendApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true,
});

// backendApi에 401 에러 처리 인터셉터 추가
backendApi.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomRequestConfig;

    if (!error.response) return Promise.reject(error);

    // accessToken 만료 (401)
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      console.log('[BackendApi] 401 감지 → refresh 시도');

      // refresh 도중이면 기존 promise 재사용
      if (!refreshPromise) {
        refreshPromise = fetch('/api/auth/refresh-tokens', {
          method: 'POST',
          credentials: 'include',
        })
          .then((res) => {
            if (!res.ok) {
              throw new Error('Token refresh failed');
            }
            console.log('[BackendApi] refresh 성공');
          })
          .catch((err) => {
            console.log('[BackendApi] refresh 실패 → logout');
            if (typeof window !== 'undefined') {
              // ai-chat 페이지에서는 리다이렉트하지 않고 에러 컴포넌트 표시
              const currentPath = window.location.pathname;
              if (!currentPath.startsWith('/ai-chat/')) {
                window.location.href = '/';
              }
            }
            throw err;
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      // refresh 종료 기다림
      await refreshPromise;

      // 원래 요청 재시도
      return backendApi(originalRequest);
    }

    return Promise.reject(error);
  }
);
