import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { hashPassword, verifyPassword, signSessionToken, SESSION_COOKIE_NAME, type AuthUser } from '@/lib/auth';
import { UserRole } from '@/lib/permissions';
import { handleApiError, apiSuccess } from '@/lib/api-response';
import {
  checkRateLimit,
  getClientIp,
  RATE_LIMIT_PRESETS,
  rateLimitExceededResponse,
} from '@/lib/rate-limit';

const LoginSchema = z.object({
  email: z.string().trim().email('ایمیل وارد شده نامعتبر است'),
  password: z.string().min(6, 'رمز عبور باید حداقل ۶ کاراکتر باشد'),
});

export async function POST(request: Request) {
  try {
    // Brute-force protection: 5 attempts per 15 minutes per IP
    const clientIp = getClientIp(request);
    const rateLimit = await checkRateLimit(`login:${clientIp}`, RATE_LIMIT_PRESETS.AUTH_LOGIN);
    if (!rateLimit.success) {
      return rateLimitExceededResponse(
        rateLimit,
        'تعداد تلاش‌های ناموفق ورود بیش از حد مجاز است. به دلایل امنیتی، ورود به مدت ۱۵ دقیقه مسدود موقت شد.'
      );
    }

    const body = await request.json();
    const { email, password } = LoginSchema.parse(body);

    const normalizedEmail = email.toLowerCase().trim();

    // Check total users in database
    const totalUsers = await prisma.user.count();

    let user;

    // First-run bootstrap: If zero users exist in the DB, create the initial Super Admin (role: 255)
    if (totalUsers === 0) {
      const passwordHash = await hashPassword(password);
      user = await prisma.user.create({
        data: {
          email: normalizedEmail,
          passwordHash,
          name: 'مدیر کل انبار',
          role: UserRole.ADMIN, // 255 (Full bitmask access)
        },
      });
    } else {
      user = await prisma.user.findUnique({
        where: { email: normalizedEmail },
      });

      if (!user) {
        return NextResponse.json(
          {
            success: false,
            code: 'INVALID_CREDENTIALS',
            message: 'ایمیل یا رمز عبور اشتباه است',
          },
          { status: 401 }
        );
      }

      const isValid = await verifyPassword(password, user.passwordHash);
      if (!isValid) {
        return NextResponse.json(
          {
            success: false,
            code: 'INVALID_CREDENTIALS',
            message: 'ایمیل یا رمز عبور اشتباه است',
          },
          { status: 401 }
        );
      }
    }

    const authPayload: AuthUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    const token = await signSessionToken(authPayload);

    const response = apiSuccess({
      user: authPayload,
      message: totalUsers === 0 ? 'حساب کاربری مدیر ارشد با موفقیت ساخته شد' : 'ورود موفقیت‌آمیز بود',
    });

    // Set secure HTTP-Only session cookie
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    return handleApiError(error);
  }
}
