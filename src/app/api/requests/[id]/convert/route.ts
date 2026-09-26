import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const { deductStock = true, invoiceType = 'SALES' } = body;

    // Run transaction: fetch order, deduct stock, create invoice, update order status
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

      // Deduct stock if requested
      if (deductStock) {
        for (const item of order.items) {
          const product = await tx.product.findUnique({
            where: { id: item.productId },
          });

          if (product) {
            await tx.product.update({
              where: { id: item.productId },
              data: {
                stockQuantity: {
                  decrement: item.quantity,
                },
              },
            });
          }
        }
      }

      // Generate invoice number
      const invoiceCount = await tx.invoice.count();
      const invoiceNumber = `INV-${new Date().getFullYear()}-${1001 + invoiceCount}`;

      const subtotal = order.items.reduce(
        (sum, it) => sum + Number(it.unitPrice) * it.quantity,
        0
      );

      const invoice = await tx.invoice.create({
        data: {
          invoiceNumber,
          type: invoiceType === 'PROFORMA' ? 'PROFORMA' : 'SALES',
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

      // Update order status
      const updatedOrder = await tx.orderRequest.update({
        where: { id },
        data: { status: 'CONVERTED' },
        include: { items: true },
      });

      return { invoice, updatedOrder };
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error converting order to invoice:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to convert order to invoice' },
      { status: 500 }
    );
  }
}
