'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

interface QueryProviderProps {
  children: ReactNode;
}

export default function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5분간 fresh
            gcTime: 30 * 60 * 1000, // 30분간 캐시 유지
            refetchOnWindowFocus: false, // 창 포커스 시 재요청 비활성화
            refetchOnMount: false, // 마운트 시 재요청 비활성화
            refetchOnReconnect: false, // 재연결 시 재요청 비활성화
            retry: 1, // 실패 시 1번만 재시도
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
