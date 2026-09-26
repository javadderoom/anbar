import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { apiSuccess } from '@/lib/api-response';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { success: false, code: 'UNAUTHORIZED', message: 'احراز هویت انجام نشده است' },
      { status: 401 }
    );
  }

  return apiSuccess({ user });
}
