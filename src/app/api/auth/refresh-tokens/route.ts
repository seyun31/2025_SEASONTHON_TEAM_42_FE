import { cookies } from 'next/headers';
import * as Sentry from '@sentry/nextjs';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

interface TokenResponse {
  result: string;
  data: {
    accessToken: string;
    refreshToken: string;
  } | null;
  error?: {
    code: string;
    message: string;
  };
}

export async function POST(): Promise<Response> {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refreshToken')?.value;

    if (!refreshToken) {
      return Response.json(
        {
          result: 'ERROR',
          data: null,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Refresh 토큰이 필요합니다.',
          },
        },
        { status: 401 }
      );
    }

    if (!backendUrl) {
      return Response.json(
        {
          result: 'ERROR',
          data: null,
          error: {
            code: 'CONFIG_ERROR',
            message: 'Backend URL이 설정되지 않았습니다.',
          },
        },
        { status: 500 }
      );
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10초 타임아웃

    let response: Response;
    try {
      response = await fetch(`${backendUrl}/v1/auth/recreate`, {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${refreshToken}`,
        },
        signal: controller.signal,
      });
      console.log('[Refresh Token API] 백엔드 응답 상태:', response.status);
      clearTimeout(timeoutId);
    } catch (error) {
      clearTimeout(timeoutId);
      console.error('[Refresh Token API] 백엔드 호출 에러:', error);
      if (error instanceof Error && error.name === 'AbortError') {
        return Response.json(
          {
            result: 'ERROR',
            data: null,
            error: {
              code: 'TIMEOUT_ERROR',
              message: '백엔드 요청 시간이 초과되었습니다.',
            },
          },
          { status: 504 }
        );
      }
      throw error;
    }

    if (!response.ok) {
      console.log('[Refresh Token API] 백엔드 응답 실패:', response.status);
      try {
        const errorData = await response.json();
        console.log(
          '[Refresh Token API] 에러 데이터 상세:',
          JSON.stringify(errorData, null, 2)
        );

        // refreshToken도 만료된 경우 쿠키 삭제
        if (response.status === 401) {
          const cookieStore = await cookies();
          cookieStore.delete('accessToken');
          cookieStore.delete('refreshToken');
        }

        // 500 에러인 경우 Sentry에 전송
        if (response.status === 500) {
          console.error('[Refresh Token API] 백엔드 500 에러 발생:', {
            url: `${backendUrl}/v1/auth/recreate`,
            errorData,
            timestamp: new Date().toISOString(),
          });
          Sentry.captureException(
            new Error('Backend refresh token 500 error'),
            {
              tags: {
                api: 'auth/recreate',
                method: 'POST',
                statusCode: 500,
              },
              extra: {
                backendUrl,
                errorData,
              },
            }
          );
        }

        return Response.json(errorData, { status: response.status });
      } catch (parseError) {
        console.error('[Refresh Token API] 에러 파싱 실패:', parseError);
        return Response.json(
          {
            result: 'ERROR',
            data: null,
            error: {
              code: 'FETCH_ERROR',
              message: 'refresh token을 가져올 수 없습니다.',
            },
          },
          { status: response.status }
        );
      }
    }

    const tokenData: TokenResponse = await response.json();

    if (tokenData.result === 'SUCCESS' && tokenData.data) {
      // console.log('[Refresh Token API] 토큰 갱신 성공');

      // 쿠키 설정
      const cookieStore = await cookies();
      cookieStore.set('accessToken', tokenData.data.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60, // 7일
        path: '/',
      });

      cookieStore.set('refreshToken', tokenData.data.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60, // 30일
        path: '/',
      });

      // 성공 응답 반환
      return Response.json(tokenData);
    }

    return Response.json(tokenData);
  } catch (error) {
    console.error('[Refresh Token API] 예외 발생:', error);

    // Sentry에 에러 전송
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refreshToken')?.value;

    Sentry.captureException(error, {
      tags: {
        api: 'auth/recreate',
        method: 'POST',
      },
      extra: {
        backendUrl,
        hasRefreshToken: !!refreshToken,
      },
    });

    return Response.json(
      {
        result: 'ERROR',
        data: null,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: '토큰 재발급 중 오류가 발생했습니다.',
        },
      },
      { status: 500 }
    );
  }
}
