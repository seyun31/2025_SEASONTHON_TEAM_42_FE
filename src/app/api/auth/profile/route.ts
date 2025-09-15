import { cookies } from 'next/headers';
import * as Sentry from '@sentry/nextjs';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

interface ProfileUpdateRequest {
  name: string;
  birthDate: string;
  gender: string;
  city?: string;
  street?: string;
}

export async function POST(request: Request): Promise<Response> {
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
        { status: 401 }
      );
    }

    const body: ProfileUpdateRequest = await request.json();

    const response = await fetch(`${backendUrl}/v1/user/profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
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
              message: '프로필 업데이트에 실패했습니다.',
            },
          },
          { status: response.status }
        );
      }
    }

    const result = await response.json();
    return Response.json(result);
  } catch (error) {
    console.error('Profile update error:', error);

    // Sentry에 에러 전송
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    Sentry.captureException(error, {
      tags: {
        api: 'auth/profile',
        method: 'POST',
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
