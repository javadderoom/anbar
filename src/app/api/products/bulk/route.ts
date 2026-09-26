import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { items } = await request.json();

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'No items provided for bulk import' },
        { status: 400 }
      );
    }

    const createdOrUpdated = [];

    for (const item of items) {
      if (!item.sku || !item.name) continue;

      const p = await prisma.product.upsert({
        where: { sku: item.sku.toString().trim() },
        update: {
          name: item.name.toString().trim(),
          category: item.category?.toString().trim() || 'دسته‌بندی نشده',
          unit: item.unit?.toString().trim() || 'عدد',
          unitPrice: Number(item.unitPrice) || 0,
          stockQuantity: parseInt(item.stockQuantity) || 0,
          minStockAlert: parseInt(item.minStockAlert) || 5,
          isActive: true,
        },
        create: {
          sku: item.sku.toString().trim(),
          name: item.name.toString().trim(),
          category: item.category?.toString().trim() || 'دسته‌بندی نشده',
          unit: item.unit?.toString().trim() || 'عدد',
          unitPrice: Number(item.unitPrice) || 0,
          stockQuantity: parseInt(item.stockQuantity) || 0,
          minStockAlert: parseInt(item.minStockAlert) || 5,
          isActive: true,
        },
      });

      createdOrUpdated.push(p);
    }

    return NextResponse.json({
      count: createdOrUpdated.length,
      message: `تعداد ${createdOrUpdated.length} کالا با موفقیت در دیتابیس ثبت/بروزرسانی شد`,
    });
  } catch (error) {
    console.error('Bulk import error:', error);
    return NextResponse.json(
      { error: 'Failed to process bulk import in database' },
      { status: 500 }
    );
  }
}
