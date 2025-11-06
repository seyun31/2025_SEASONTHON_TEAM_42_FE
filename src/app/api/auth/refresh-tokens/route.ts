import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
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

    console.log('[Refresh Token API] 요청 시작');
    console.log('[Refresh Token API] refreshToken 존재:', !!refreshToken);
    console.log('[Refresh Token API] backendUrl:', backendUrl);

    if (!refreshToken) {
      console.log('[Refresh Token API] refreshToken 없음');
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
      console.log('[Refresh Token API] backendUrl 없음');
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
      console.log(
        '[Refresh Token API] 백엔드 호출 시작:',
        `${backendUrl}/v1/auth/recreate`
      );
      response = await fetch(`${backendUrl}/v1/auth/recreate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
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
          console.log('[Refresh Token API] 401 에러로 인한 쿠키 삭제 완료');
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
    console.log('[Refresh Token API] 토큰 데이터 수신:', tokenData.result);

    if (tokenData.result === 'SUCCESS' && tokenData.data) {
      console.log('[Refresh Token API] 토큰 갱신 성공');
      // 새로운 토큰을 쿠키에 저장
      const nextResponse = NextResponse.json(tokenData);

      nextResponse.cookies.set('accessToken', tokenData.data.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60, // 7일
        path: '/',
      });

      nextResponse.cookies.set('refreshToken', tokenData.data.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60, // 30일
        path: '/',
      });

      return nextResponse;
    }

    console.log('[Refresh Token API] 토큰 데이터 반환');
    return Response.json(tokenData);
  } catch (error) {
    console.error('[Refresh Token API] 예외 발생:', error);
    console.error(
      '[Refresh Token API] 에러 스택:',
      error instanceof Error ? error.stack : 'No stack'
    );

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
