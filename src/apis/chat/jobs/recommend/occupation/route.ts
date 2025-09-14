import { cookies } from 'next/headers';
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
        { status: 401 }
      );
    }

    const url = new URL(`${backendUrl}/job/recommend/occupation`);

    const response = await fetch(url.toString(), {
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
              message: '맞춤형 직업 추천을 가져올 수 없습니다.',
            },
          },
          { status: response.status }
        );
      }
    }

    const recommendationData = await response.json();
    return Response.json(recommendationData);
  } catch (error) {
    console.error('Job recommendation fetch error:', error);

    // Sentry에 에러 전송
    Sentry.captureException(error, {
      tags: {
        api: 'chat/jobs/recommend/occupation',
        method: 'GET',
      },
      extra: {
        backendUrl,
        hasAccessToken: !!cookies().get('accessToken')?.value,
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
