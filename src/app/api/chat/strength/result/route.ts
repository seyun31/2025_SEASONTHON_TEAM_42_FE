import { cookies } from 'next/headers';
import * as Sentry from '@sentry/nextjs';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function POST(request: Request): Promise<Response> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    console.log('API 호출 시작 - accessToken 존재:', !!accessToken);

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

    // 클라이언트에서 보낸 occupation 파싱
    const body = await request.json().catch(() => null);

    if (!body || !body.occupation) {
      return Response.json(
        {
          result: 'ERROR',
          data: null,
          error: { code: 'BAD_REQUEST', message: 'occupation은 필수입니다.' },
        },
        { status: 400 }
      );
    }

    const { occupation } = body;

    // 백엔드로 request body 전달
    const response = await fetch(`${backendUrl}/reports/strength`, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        occupation,
      }),
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
              message: '강점 분석 결과를 가져올 수 없습니다.',
            },
          },
          { status: response.status }
        );
      }
    }

    const responseData = await response.json();
    return Response.json(responseData);
  } catch (error) {
    console.error('Strength result error:', error);

    // Sentry에 에러 전송
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    Sentry.captureException(error, {
      tags: {
        api: 'chat/strength/result',
        method: 'POST',
      },
      extra: {
        backendUrl,
        hasAccessToken: !!accessToken,
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
