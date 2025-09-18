import { cookies } from 'next/headers';
import * as Sentry from '@sentry/nextjs';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function GET(request: Request): Promise<Response> {
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

    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get('keyword') || '';
    const startYmd = searchParams.get('startYmd') || '';
    const endYmd = searchParams.get('endYmd') || '';

    const url = new URL(`${backendUrl}/education/all/anonymous`);
    if (keyword) url.searchParams.append('keyword', keyword);
    if (startYmd) url.searchParams.append('startYmd', startYmd);
    if (endYmd) url.searchParams.append('endYmd', endYmd);

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
              message: '교육 정보를 가져올 수 없습니다.',
            },
          },
          { status: response.status }
        );
      }
    }

    const educationData = await response.json();
    return Response.json(educationData);
  } catch (error) {
    console.error('Education fetch error:', error);

    // Sentry에 에러 전송
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    Sentry.captureException(error, {
      tags: {
        api: 'education/anonymous',
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
