import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { UpdateProductSchema } from '@/lib/validations';
import { handleApiError, apiSuccess } from '@/lib/api-response';
import { getCurrentUser } from '@/lib/auth';
import { hasPermission, Permission } from '@/lib/permissions';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || !hasPermission(user.role, Permission.EDIT_STOCK)) {
      return NextResponse.json(
        { success: false, code: 'FORBIDDEN', message: 'شما دسترسی ویرایش اطلاعات کالا را ندارید' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const validated = UpdateProductSchema.parse(body);

    const updated = await prisma.product.update({
      where: { id },
      data: {
        ...(validated.name && { name: validated.name }),
        ...(validated.sku && { sku: validated.sku }),
        ...(validated.category !== undefined && { category: validated.category }),
        ...(validated.unit && { unit: validated.unit }),
        ...(validated.unitPrice !== undefined && { unitPrice: validated.unitPrice }),
        ...(validated.stockQuantity !== undefined && { stockQuantity: validated.stockQuantity }),
        ...(validated.minStockAlert !== undefined && { minStockAlert: validated.minStockAlert }),
        ...(validated.description !== undefined && { description: validated.description }),
        ...(validated.specifications !== undefined && { specifications: validated.specifications ?? undefined }),
        ...(validated.isActive !== undefined && { isActive: validated.isActive }),
      },
    });

    return apiSuccess({
      ...updated,
      unitPrice: Number(updated.unitPrice),
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || !hasPermission(user.role, Permission.DELETE_PRODUCT)) {
      return NextResponse.json(
        { success: false, code: 'FORBIDDEN', message: 'شما دسترسی حذف کالا از انبار را ندارید' },
        { status: 403 }
      );
    }

    const { id } = await params;

    // Soft delete product so historical invoice relations remain intact
    await prisma.product.update({
      where: { id },
      data: { isActive: false },
    });

    return apiSuccess({ success: true, message: 'کالا با موفقیت حذف گردید' });
  } catch (error) {
    return handleApiError(error);
  }
}
