import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { BulkImportSchema } from '@/lib/validations';
import { handleApiError, apiSuccess } from '@/lib/api-response';

export async function POST(request: Request) {
  try {
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
