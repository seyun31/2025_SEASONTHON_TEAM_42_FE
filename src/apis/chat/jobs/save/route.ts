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

    const { sequence, answer } = await request.json();
    console.log('요청 데이터:', { sequence, answer, backendUrl });

    if (!sequence || answer === undefined || answer === null) {
      return Response.json(
        {
          result: 'ERROR',
          data: null,
          error: {
            code: 'BAD_REQUEST',
            message: 'sequence와 answer가 필요합니다.',
          },
        },
        { status: 400 }
      );
    }

    const url = new URL(`${backendUrl}/job/chat/${sequence}`);
    url.searchParams.append('answer', answer);

    console.log('백엔드 URL:', url.toString());

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log('백엔드 응답 상태:', response.status);

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

    const responseData = await response.json();
    return Response.json(responseData);
  } catch (error) {
    console.error('Job chat save error:', error);

    // Sentry에 에러 전송
    Sentry.captureException(error, {
      tags: {
        api: 'chat/jobs/save',
        method: 'POST',
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
