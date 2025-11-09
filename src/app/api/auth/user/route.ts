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

    // 401 에러 - accessToken 만료 가능성, refresh 시도
    if (response.status === 401) {
      console.log(`[User API] ${response.status} 감지 - refresh 시도`);

      const refreshToken = cookieStore.get('refreshToken')?.value;

      if (!refreshToken) {
        console.log('[User API] refreshToken 없음 - 401 반환');
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
          console.log('[User API] refresh 실패 - 401 반환');
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
          console.log('[User API] refresh 응답에 토큰 없음 - 401 반환');
          return Response.json(
            {
              result: 'ERROR',
              data: null,
              error: { code: 'UNAUTHORIZED', message: '토큰 갱신 실패' },
            },
            { status: 401 }
          );
        }

        console.log('[User API] refresh 성공 - 새 토큰으로 재시도');

        // 새 accessToken으로 다시 시도
        const retryResponse = await fetch(`${backendUrl}/v1/user`, {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${newAccessToken}`,
          },
        });

        if (!retryResponse.ok) {
          console.log('[User API] 재시도 실패:', retryResponse.status);
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
                  message: '사용자 정보를 가져올 수 없습니다.',
                },
              },
              { status: retryResponse.status }
            );
          }
        }

        const userData: UserResponse = await retryResponse.json();
        console.log('[User API] 재시도 성공');

        // 새 토큰을 쿠키에 저장
        const response = new Response(JSON.stringify(userData), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        });

        // 새 토큰을 쿠키에 저장
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

        return response;
      } catch (refreshError) {
        console.error('[User API] refresh 중 예외:', refreshError);
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
