import { cookies } from 'next/headers';
import * as Sentry from '@sentry/nextjs';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

interface RouteContext {
  params: Promise<{
    strengthReportId: string;
  }>;
}

// DELETE /api/report/strength/[strengthReportId]
export async function DELETE(
  request: Request,
  context: RouteContext
): Promise<Response> {
  try {
    const { strengthReportId } = await context.params;
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

    const url = `${backendUrl}/reports/strength/${strengthReportId}`;

    const response = await fetch(url, {
      method: 'DELETE',
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
              code: 'DELETE_ERROR',
              message: '강점 리포트를 삭제할 수 없습니다.',
            },
          },
          { status: response.status }
        );
      }
    }

    const resultData = await response.json();
    return Response.json(resultData);
  } catch (error) {
    console.error('Strength report delete error:', error);

    // Sentry에 에러 전송
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    Sentry.captureException(error, {
      tags: {
        api: 'report/strength/delete',
        method: 'DELETE',
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

// PATCH /api/report/strength/[strengthReportId]
export async function PATCH(
  request: Request,
  context: RouteContext
): Promise<Response> {
  try {
    const { strengthReportId } = await context.params;
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

    // Request body 파싱
    let body;
    try {
      body = await request.json();
    } catch {
      return Response.json(
        {
          result: 'ERROR',
          data: null,
          error: {
            code: 'INVALID_REQUEST',
            message: '잘못된 요청 형식입니다.',
          },
        },
        { status: 400 }
      );
    }

    const url = `${backendUrl}/reports/strength/${strengthReportId}`;

    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
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
              code: 'UPDATE_ERROR',
              message: '강점 리포트를 수정할 수 없습니다.',
            },
          },
          { status: response.status }
        );
      }
    }

    const resultData = await response.json();
    return Response.json(resultData);
  } catch (error) {
    console.error('Strength report update error:', error);

    // Sentry에 에러 전송
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    Sentry.captureException(error, {
      tags: {
        api: 'report/strength/update',
        method: 'PATCH',
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
