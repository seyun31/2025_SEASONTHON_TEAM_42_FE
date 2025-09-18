import { cookies } from 'next/headers';
import * as Sentry from '@sentry/nextjs';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function DELETE(request: Request): Promise<Response> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    console.log('DELETE API 호출 시작 - accessToken 존재:', !!accessToken);

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

    const url = new URL(request.url);
    const educationId = url.searchParams.get('educationId');

    if (!educationId) {
      return Response.json(
        {
          result: 'ERROR',
          data: null,
          error: {
            code: 'BAD_REQUEST',
            message: 'educationId가 필요합니다.',
          },
        },
        { status: 400 }
      );
    }

    const backendUrl = new URL(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/bookmark/job`
    );
    backendUrl.searchParams.append('educationId', educationId);

    const response = await fetch(backendUrl.toString(), {
      method: 'DELETE',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log('백엔드 DELETE 응답 상태:', response.status);

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
              message: '북마크 삭제를 처리할 수 없습니다.',
            },
          },
          { status: response.status }
        );
      }
    }

    const responseData = await response.json();
    return Response.json(responseData);
  } catch (error) {
    console.error('Job bookmark delete error:', error);

    // Sentry에 에러 전송
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    Sentry.captureException(error, {
      tags: {
        api: 'heart-lists/job/delete',
        method: 'DELETE',
      },
      extra: {
        backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL,
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
