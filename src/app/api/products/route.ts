import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { CreateProductSchema } from '@/lib/validations';
import { handleApiError, apiSuccess } from '@/lib/api-response';
import { getCurrentUser } from '@/lib/auth';
import { hasPermission, Permission } from '@/lib/permissions';

// GET /api/products - list active products with optional cursor pagination and filters
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const stockStatus = searchParams.get('stockStatus') || 'all';
    const cursor = searchParams.get('cursor');
    const isPaginated = searchParams.get('paginate') === 'true' || searchParams.has('cursor');
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '40', 10)));

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

    if (stockStatus === 'out_of_stock') {
      where.stockQuantity = 0;
    } else if (stockStatus === 'in_stock') {
      where.stockQuantity = { gt: 0 };
    }

    if (isPaginated) {
      const products = await prisma.product.findMany({
        where,
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        skip: cursor ? 1 : 0,
        orderBy: { createdAt: 'desc' },
      });

      const hasMore = products.length > limit;
      const pageProducts = hasMore ? products.slice(0, limit) : products;
      const nextCursor = hasMore && pageProducts.length > 0 ? pageProducts[pageProducts.length - 1].id : null;

      const serialized = pageProducts.map((p) => ({
        ...p,
        unitPrice: Number(p.unitPrice),
        specifications: (p.specifications as Record<string, string | number>) || undefined,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
      }));

      return apiSuccess({
        items: serialized,
        nextCursor,
        hasMore,
      });
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

    return apiSuccess(serialized);
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/products - create a new product with Zod validation
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || !hasPermission(user.role, Permission.ADD_PRODUCT)) {
      return NextResponse.json(
        { success: false, code: 'FORBIDDEN', message: 'شما دسترسی ثبت کالای جدید را ندارید' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validated = CreateProductSchema.parse(body);

    // Check SKU uniqueness
    const existing = await prisma.product.findUnique({
      where: { sku: validated.sku },
    });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          code: 'DUPLICATE_SKU',
          message: `کالایی با کد فنی (SKU) «${validated.sku}» قبلاً ثبت شده است`,
        },
        { status: 409 }
      );
    }

    const created = await prisma.product.create({
      data: {
        sku: validated.sku,
        name: validated.name,
        category: validated.category,
        unit: validated.unit,
        unitPrice: validated.unitPrice,
        stockQuantity: validated.stockQuantity,
        minStockAlert: validated.minStockAlert,
        description: validated.description ?? null,
        specifications: validated.specifications ? (validated.specifications as any) : undefined,
        isActive: true,
      },
    });

    return apiSuccess(
      {
        ...created,
        unitPrice: Number(created.unitPrice),
        createdAt: created.createdAt.toISOString(),
        updatedAt: created.updatedAt.toISOString(),
      },
      201
    );
  } catch (error) {
    return handleApiError(error);
  }
}
