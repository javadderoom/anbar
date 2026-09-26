import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { ConvertOrderRequestSchema } from '@/lib/validations';
import { handleApiError, apiSuccess } from '@/lib/api-response';
import { getCurrentUser } from '@/lib/auth';
import { hasPermission, Permission } from '@/lib/permissions';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || !hasPermission(user.role, Permission.CONVERT_ORDERS)) {
      return NextResponse.json(
        {
          success: false,
          code: 'FORBIDDEN',
          message: 'شما مجوز دسترسی برای تبدیل سفارش به فاکتور را ندارید',
        },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const validated = ConvertOrderRequestSchema.parse(body);

    // Run transaction: fetch order, deduct stock conditionally, create invoice, update order status
    const result = await prisma.$transaction(async (tx) => {
      const order = await tx.orderRequest.findUnique({
        where: { id },
        include: { items: true, client: true },
      });

      if (!order) {
        throw new Error('درخواست مورد نظر یافت نشد');
      }

      if (order.status === 'CONVERTED') {
        throw new Error('این درخواست قبلاً به فاکتور تبدیل شده است');
      }

      // Guarded atomic stock decrement (prevents race conditions & negative stock)
      if (validated.deductStock) {
        for (const item of order.items) {
          const updateResult = await tx.product.updateMany({
            where: {
              id: item.productId,
              stockQuantity: { gte: item.quantity },
            },
            data: {
              stockQuantity: {
                decrement: item.quantity,
              },
            },
          });

          if (updateResult.count === 0) {
            throw new Error(
              `موجودی کالای «${item.productName}» در انبار برای تحویل این تعداد کافی نمی‌باشد`
            );
          }
        }
      }

      // Generate sequential invoice number
      const invoiceCount = await tx.invoice.count();
      const invoiceNumber = `INV-${new Date().getFullYear()}-${1001 + invoiceCount}`;

      const subtotal = order.items.reduce(
        (sum, it) => sum + Number(it.unitPrice) * it.quantity,
        0
      );

      const invoice = await tx.invoice.create({
        data: {
          invoiceNumber,
          type: validated.invoiceType === 'PROFORMA' ? 'PROFORMA' : 'SALES',
          status: 'ISSUED',
          orderRequestId: order.id,
          clientId: order.clientId,
          subtotal,
          discount: 0,
          tax: 0,
          total: subtotal,
          notes: order.notes,
          items: {
            create: order.items.map((it) => ({
              productId: it.productId,
              description: it.productName,
              quantity: it.quantity,
              unit: it.unit,
              unitPrice: it.unitPrice,
              totalPrice: Number(it.unitPrice) * it.quantity,
            })),
          },
        },
        include: {
          items: true,
          client: true,
        },
      });

      // Update order status to CONVERTED
      const updatedOrder = await tx.orderRequest.update({
        where: { id },
        data: { status: 'CONVERTED' },
        include: { items: true },
      });

      return { invoice, updatedOrder };
    });

    return apiSuccess(result);
  } catch (error) {
    return handleApiError(error);
  }
}
