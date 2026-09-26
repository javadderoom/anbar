import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updated = await prisma.product.update({
      where: { id },
      data: {
        ...(body.name && { name: body.name.trim() }),
        ...(body.sku && { sku: body.sku.trim() }),
        ...(body.category !== undefined && { category: body.category.trim() }),
        ...(body.unit && { unit: body.unit.trim() }),
        ...(body.unitPrice !== undefined && { unitPrice: Number(body.unitPrice) }),
        ...(body.stockQuantity !== undefined && { stockQuantity: parseInt(body.stockQuantity) }),
        ...(body.minStockAlert !== undefined && { minStockAlert: parseInt(body.minStockAlert) }),
        ...(body.isActive !== undefined && { isActive: Boolean(body.isActive) }),
      },
    });

    return NextResponse.json({
      ...updated,
      unitPrice: Number(updated.unitPrice),
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product in database' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Soft delete product so historical invoice relations remain intact
    await prisma.product.update({
      where: { id },
      data: { isActive: false },
    });

    return NextResponse.json({ success: true, message: 'کالا با موفقیت حذف گردید' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product in database' },
      { status: 500 }
    );
  }
}
