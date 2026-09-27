import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { handleApiError, apiSuccess } from '@/lib/api-response';
import { getCurrentUser } from '@/lib/auth';
import { hasPermission, Permission } from '@/lib/permissions';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || !hasPermission(user.role, Permission.VIEW_INVENTORY)) {
      return NextResponse.json(
        { success: false, code: 'FORBIDDEN', message: 'شما دسترسی مشاهده تاریخچه انبارداری را ندارید' },
        { status: 403 }
      );
    }

    const { id } = await params;

    const movements = await prisma.stockMovement.findMany({
      where: { productId: id },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    const serialized = movements.map((m) => ({
      ...m,
      createdAt: m.createdAt.toISOString(),
    }));

    return apiSuccess(serialized);
  } catch (error) {
    return handleApiError(error);
  }
}
