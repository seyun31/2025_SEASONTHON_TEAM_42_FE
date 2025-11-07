import { cookies } from 'next/headers';
import { UserResponse } from '@/types/user';
import * as Sentry from '@sentry/nextjs';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function GET(): Promise<Response> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken) {
      // console.log('[User API] accessToken 없음 - 401 반환');
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

    console.log('[User API] 백엔드 응답 상태:', response.status);

    if (!response.ok) {
      console.log(
        '[User API] 백엔드 응답 실패 - status 그대로 전달:',
        response.status
      );
      try {
        const errorData = await response.json();
        console.error(
          '[User API] 백엔드 에러 상세:',
          JSON.stringify(errorData, null, 2)
        );
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
    console.log('[User API] 사용자 정보 조회 성공');
    return Response.json(userData);
  } catch (error) {
    // Sentry에 에러 전송
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    Sentry.captureException(error, {
      tags: {
        api: 'auth/user',
        method: 'GET',
      },
      extra: {
        backendUrl,
        hasAccessToken: !!accessToken,
      },
    });

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
