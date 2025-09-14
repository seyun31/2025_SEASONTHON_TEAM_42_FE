import { cookies } from 'next/headers';
import { UserResponse } from '@/types/user';
import * as Sentry from '@sentry/nextjs';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function GET(): Promise<Response> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken) {
      return Response.json(
        {
          result: 'ERROR',
          data: null,
          error: { code: 'UNAUTHORIZED', message: '인증 토큰이 필요합니다.' },
        },
        { status: 401 } // 인증 토큰이 없거나 만료
      );
    }

    const response = await fetch(`${backendUrl}/v1/user`, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      try {
        const errorData = await response.json();
        return Response.json(errorData, { status: response.status });
      } catch {
        return Response.json(
          {
            result: 'ERROR',
            data: null,
            error: {
              code: 'FETCH_ERROR',
              message: '사용자 정보를 가져올 수 없습니다.',
            },
          },
          { status: response.status }
        );
      }
    }

    const userData: UserResponse = await response.json();
    return Response.json(userData);
  } catch (error) {
    console.error('User profile fetch error:', error);

    // Sentry에 에러 전송
    Sentry.captureException(error, {
      tags: {
        api: 'auth/user',
        method: 'GET',
      },
      extra: {
        backendUrl,
        hasAccessToken: !!cookies().get('accessToken')?.value,
      },
    });

    // 백엔드 API 에러 응답인 경우 그대로 전달
    if (error instanceof Error && error.message.includes('response')) {
      try {
        const errorResponse = JSON.parse(error.message);
        return Response.json(errorResponse, { status: 500 });
      } catch {}
    }

    return Response.json(
      {
        result: 'ERROR',
        data: null,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: '알 수 없는 내부 오류입니다.',
        },
      },
      { status: 500 }
    );
  }
}
