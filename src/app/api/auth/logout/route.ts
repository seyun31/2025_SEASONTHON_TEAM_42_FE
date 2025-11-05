import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = await cookies();

    // HttpOnly 쿠키 삭제
    cookieStore.delete('accessToken');
    cookieStore.delete('refreshToken');

    return NextResponse.json({
      result: 'SUCCESS',
      message: '로그아웃되었습니다.',
    });
  } catch (error) {
    console.error('로그아웃 중 오류:', error);
    return NextResponse.json(
      {
        result: 'ERROR',
        error: {
          code: 'LOGOUT_ERROR',
          message: '로그아웃 중 오류가 발생했습니다.',
        },
      },
      { status: 500 }
    );
  }
}
