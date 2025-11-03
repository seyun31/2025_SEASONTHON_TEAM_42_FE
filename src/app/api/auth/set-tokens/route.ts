import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { accessToken, refreshToken } = body;

    if (!accessToken || !refreshToken) {
      return NextResponse.json(
        { error: '토큰이 필요합니다.' },
        { status: 400 }
      );
    }

    // 응답 생성
    const response = NextResponse.json({ success: true });

    // 쿠키 설정
    response.cookies.set('accessToken', accessToken, {
      httpOnly: true, // JavaScript에서 접근 불가 - XSS 공격 방지
      secure: process.env.NODE_ENV === 'development', // HTTPS일 때만
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7일
      path: '/',
    });

    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true, // JavaScript에서 접근 불가 - XSS 공격 방지
      secure: process.env.NODE_ENV === 'development', // HTTPS일 때만
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60, // 30일
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('토큰 저장 중 오류:', error);
    return NextResponse.json(
      { error: '토큰 저장에 실패했습니다.' },
      { status: 500 }
    );
  }
}
