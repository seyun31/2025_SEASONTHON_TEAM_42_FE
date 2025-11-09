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

    const url = new URL(`${backendUrl}/job/occupation/bookmarks`);

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log('[Job Card API] 백엔드 응답 상태:', response.status);

    // 401 또는 500 에러 - accessToken 만료 가능성, refresh 시도
    if (response.status === 401 || response.status === 500) {
      console.log(`[Job Card API] ${response.status} 감지 - refresh 시도`);

      const refreshToken = cookieStore.get('refreshToken')?.value;

      if (!refreshToken) {
        console.log('[Job Card API] refreshToken 없음 - 401 반환');
        return Response.json(
          {
            result: 'ERROR',
            data: null,
            error: { code: 'UNAUTHORIZED', message: '인증이 필요합니다.' },
          },
          { status: 401 }
        );
      }

      // refresh token으로 새 토큰 발급
      try {
        const refreshResponse = await fetch(
          `${backendUrl}/v1/auth/refresh-token`,
          {
            method: 'POST',
            headers: {
              accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken }),
          }
        );

        if (!refreshResponse.ok) {
          console.log('[Job Card API] refresh 실패 - 401 반환');
          return Response.json(
            {
              result: 'ERROR',
              data: null,
              error: {
                code: 'UNAUTHORIZED',
                message: '인증이 만료되었습니다.',
              },
            },
            { status: 401 }
          );
        }

        const refreshData = await refreshResponse.json();
        const newAccessToken = refreshData.data?.accessToken;
        const newRefreshToken = refreshData.data?.refreshToken;

        if (!newAccessToken || !newRefreshToken) {
          console.log('[Job Card API] refresh 응답에 토큰 없음 - 401 반환');
          return Response.json(
            {
              result: 'ERROR',
              data: null,
              error: { code: 'UNAUTHORIZED', message: '토큰 갱신 실패' },
            },
            { status: 401 }
          );
        }

        console.log('[Job Card API] refresh 성공 - 새 토큰으로 재시도');

        // 새 accessToken으로 다시 시도
        const retryResponse = await fetch(url.toString(), {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${newAccessToken}`,
          },
        });

        if (!retryResponse.ok) {
          console.log('[Job Card API] 재시도 실패:', retryResponse.status);
          try {
            const errorData = await retryResponse.json();
            return Response.json(errorData, { status: retryResponse.status });
          } catch {
            return Response.json(
              {
                result: 'ERROR',
                data: null,
                error: {
                  code: 'FETCH_ERROR',
                  message: '관심목록을 불러올 수 없습니다.',
                },
              },
              { status: retryResponse.status }
            );
          }
        }

        const historyData = await retryResponse.json();
        console.log('[Job Card API] 재시도 성공');

        // 새 토큰을 쿠키에 저장
        const responseWithCookies = new Response(JSON.stringify(historyData), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        });

        // 쿠키 설정
        const cookieStore = await cookies();
        cookieStore.set('accessToken', newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 3600, // 1시간
        });
        cookieStore.set('refreshToken', newRefreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 604800, // 7일
        });

        return responseWithCookies;
      } catch (refreshError) {
        console.error('[Job Card API] refresh 중 예외:', refreshError);
        return Response.json(
          {
            result: 'ERROR',
            data: null,
            error: {
              code: 'REFRESH_ERROR',
              message: '토큰 갱신 중 오류가 발생했습니다.',
            },
          },
          { status: 401 }
        );
      }
    }

    // 다른 에러 처리
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
              message: '관심목록을 불러올 수 없습니다.',
            },
          },
          { status: response.status }
        );
      }
    }

    const historyData = await response.json();
    console.log('[Job Card API] 성공');
    return Response.json(historyData);
  } catch (error) {
    console.error('AI chat history fetch error:', error);

    // Sentry에 에러 전송
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    Sentry.captureException(error, {
      tags: {
        api: 'chat/jobs/history/job-card',
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
