import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { AdjustStockSchema } from '@/lib/validations';
import { handleApiError, apiSuccess } from '@/lib/api-response';
import { getCurrentUser } from '@/lib/auth';
import { hasPermission, Permission } from '@/lib/permissions';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || !hasPermission(user.role, Permission.EDIT_STOCK)) {
      return NextResponse.json(
        { success: false, code: 'FORBIDDEN', message: 'شما دسترسی ویرایش و اصلاح موجودی کالا را ندارید' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const validated = AdjustStockSchema.parse(body);

    const result = await prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({
        where: { id },
      });

      if (!product) {
        throw new Error('کالای مورد نظر یافت نشد');
      }

      const previousStock = product.stockQuantity;
      const newStock = previousStock + validated.deltaQuantity;

      if (newStock < 0) {
        throw new Error(
          `موجودی انبار نمی‌تواند منفی شود. موجودی فعلی: ${previousStock} ${product.unit}`
        );
      }

      const updatedProduct = await tx.product.update({
        where: { id },
        data: {
          stockQuantity: newStock,
        },
      });

      const movement = await tx.stockMovement.create({
        data: {
          productId: id,
          type: validated.type,
          deltaQuantity: validated.deltaQuantity,
          previousStock,
          newStock,
          reason: validated.reason,
          referenceId: validated.referenceId ?? null,
          userName: user.name || user.email.split('@')[0],
        },
      });

      return {
        product: {
          ...updatedProduct,
          unitPrice: Number(updatedProduct.unitPrice),
          createdAt: updatedProduct.createdAt.toISOString(),
          updatedAt: updatedProduct.updatedAt.toISOString(),
        },
        movement: {
          ...movement,
          createdAt: movement.createdAt.toISOString(),
        },
      };
    });

    return apiSuccess(result);
  } catch (error) {
    return handleApiError(error);
  }
}
