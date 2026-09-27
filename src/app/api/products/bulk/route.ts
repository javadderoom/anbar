import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { BulkImportSchema } from '@/lib/validations';
import { handleApiError, apiSuccess } from '@/lib/api-response';
import { getCurrentUser } from '@/lib/auth';
import { hasPermission, Permission } from '@/lib/permissions';

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || !hasPermission(user.role, Permission.ADD_PRODUCT)) {
      return NextResponse.json(
        { success: false, code: 'FORBIDDEN', message: 'شما دسترسی ورود اطلاعات از اکسل را ندارید' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validated = BulkImportSchema.parse(body);

    const createdOrUpdated = [];

    for (const item of validated.items) {
      const p = await prisma.product.upsert({
        where: { sku: item.sku },
        update: {
          name: item.name,
          category: item.category,
          unit: item.unit,
          unitPrice: item.unitPrice,
          stockQuantity: item.stockQuantity,
          minStockAlert: item.minStockAlert,
          isCustom: item.isCustom ?? false,
          leadTimeText: item.leadTimeText ?? null,
          isActive: true,
        },
        create: {
          sku: item.sku,
          name: item.name,
          category: item.category,
          unit: item.unit,
          unitPrice: item.unitPrice,
          stockQuantity: item.stockQuantity,
          minStockAlert: item.minStockAlert,
          isCustom: item.isCustom ?? false,
          leadTimeText: item.leadTimeText ?? null,
          isActive: true,
        },
      });

      createdOrUpdated.push(p);
    }

    return apiSuccess({
      count: createdOrUpdated.length,
      message: `تعداد ${createdOrUpdated.length} کالا با موفقیت در پایگاه داده ذخیره و بروزرسانی شد`,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
