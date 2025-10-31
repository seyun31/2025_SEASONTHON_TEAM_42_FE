import { cookies } from 'next/headers';
import * as Sentry from '@sentry/nextjs';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function POST(): Promise<Response> {
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

    const response = await fetch(`${backendUrl}/reports/strength`, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // console.log('백엔드 응답 상태:', response.status);

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
