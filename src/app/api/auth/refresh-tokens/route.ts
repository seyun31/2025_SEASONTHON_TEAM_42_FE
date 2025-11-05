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
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
    } catch (error) {
      clearTimeout(timeoutId);
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
      try {
        const errorData = await response.json();
        // refreshToken도 만료된 경우 쿠키 삭제
        if (response.status === 401) {
          const cookieStore = await cookies();
          cookieStore.delete('accessToken');
          cookieStore.delete('refreshToken');
        }
        return Response.json(errorData, { status: response.status });
      } catch {
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
      // 새로운 토큰을 쿠키에 저장
      const nextResponse = NextResponse.json(tokenData);

      nextResponse.cookies.set('accessToken', tokenData.data.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60, // 7일
        path: '/',
      });

      nextResponse.cookies.set('refreshToken', tokenData.data.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60, // 30일
        path: '/',
      });

      return nextResponse;
    }

    return Response.json(tokenData);
  } catch (error) {
    console.error('refresh token fetch error:', error);

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
