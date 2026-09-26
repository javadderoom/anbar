import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export interface ApiErrorResponse {
  success: false;
  code: string;
  message: string;
  errors?: { field: string; message: string }[];
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

export function handleApiError(error: unknown) {
  if (error instanceof ZodError) {
    const formattedErrors = error.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));

    return NextResponse.json<ApiErrorResponse>(
      {
        success: false,
        code: 'VALIDATION_ERROR',
        message: formattedErrors[0]?.message || 'اطلاعات ارسالی معتبر نمی‌باشد',
        errors: formattedErrors,
      },
      { status: 422 }
    );
  }

  console.error('API Error:', error);
  const message = error instanceof Error ? error.message : 'خطای غیرمنتظره در سرور';

  return NextResponse.json<ApiErrorResponse>(
    {
      success: false,
      code: 'INTERNAL_ERROR',
      message,
    },
    { status: 500 }
  );
}

export function apiSuccess<T>(data: T, status = 200, message?: string) {
  return NextResponse.json(data, { status });
}
