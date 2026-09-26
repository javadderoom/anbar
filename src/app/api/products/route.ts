import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/products - list all active products
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';

    const where: any = { isActive: true };

    if (category && category !== 'all') {
      where.category = category;
    }

    if (search.trim()) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    // Format Decimal to number for JSON responses
    const serialized = products.map((p) => ({
      ...p,
      unitPrice: Number(p.unitPrice),
      specifications: (p.specifications as Record<string, string | number>) || undefined,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    }));

    return NextResponse.json(serialized);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products from database' },
      { status: 500 }
    );
  }
}

// POST /api/products - create a new product
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      sku,
      name,
      category,
      unit,
      unitPrice,
      stockQuantity,
      minStockAlert,
      specifications,
      description,
    } = body;

    if (!sku?.trim() || !name?.trim()) {
      return NextResponse.json(
        { error: 'SKU and product name are required' },
        { status: 400 }
      );
    }

    // Check SKU uniqueness
    const existing = await prisma.product.findUnique({
      where: { sku: sku.trim() },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'کالایی با این کد فنی (SKU) از قبل وجود دارد' },
        { status: 409 }
      );
    }

    const created = await prisma.product.create({
      data: {
        sku: sku.trim(),
        name: name.trim(),
        category: category?.trim() || 'دسته‌بندی نشده',
        unit: unit?.trim() || 'عدد',
        unitPrice: Number(unitPrice) || 0,
        stockQuantity: parseInt(stockQuantity) || 0,
        minStockAlert: parseInt(minStockAlert) || 5,
        description: description?.trim() || null,
        specifications: specifications || null,
        isActive: true,
      },
    });

    return NextResponse.json(
      {
        ...created,
        unitPrice: Number(created.unitPrice),
        createdAt: created.createdAt.toISOString(),
        updatedAt: created.updatedAt.toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product in database' },
      { status: 500 }
    );
  }
}
