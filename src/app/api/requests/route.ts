import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { CreateOrderRequestSchema } from '@/lib/validations';
import { handleApiError, apiSuccess } from '@/lib/api-response';

// GET /api/requests - list all incoming requests
export async function GET() {
  try {
    const requests = await prisma.orderRequest.findMany({
      include: {
        client: true,
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = requests.map((r) => {
      const totalEstimate = r.items.reduce(
        (sum, item) => sum + Number(item.unitPrice) * item.quantity,
        0
      );

      return {
        id: r.id,
        orderNumber: r.orderNumber,
        clientName: r.clientName || r.client?.name || 'مشتری گرامی (استعلام مهمان)',
        phone: r.clientPhone || r.client?.phone || '—',
        itemsCount: r.items.length,
        totalEstimate,
        status: r.status,
        date: new Intl.DateTimeFormat('fa-IR', {
          month: 'numeric',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }).format(r.createdAt),
        notes: r.notes || undefined,
        items: r.items.map((it) => ({
          id: it.id,
          productId: it.productId,
          description: it.productName,
          quantity: it.quantity,
          unit: it.unit,
          unitPrice: Number(it.unitPrice),
          totalPrice: Number(it.unitPrice) * it.quantity,
        })),
      };
    });

    return apiSuccess(formatted);
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/requests - client submits an order request with Zod validation
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = CreateOrderRequestSchema.parse(body);

    // Find link if provided
    let link = null;
    let client = null;
    if (validated.token && validated.token !== 'demo') {
      link = await prisma.clientLink.findUnique({
        where: { token: validated.token },
        include: { client: true },
      });
      if (link?.client) {
        client = link.client;
      }
    }

    // Auto-generate sequential order number
    const count = await prisma.orderRequest.count();
    const orderNumber = `REQ-${1001 + count}`;

    const newOrder = await prisma.orderRequest.create({
      data: {
        orderNumber,
        linkId: link?.id || null,
        clientId: client?.id || null,
        clientName: validated.clientName,
        clientPhone: validated.clientPhone,
        notes: validated.notes ?? null,
        status: 'PENDING',
        items: {
          create: validated.items.map((it) => ({
            productId: it.productId,
            productName: it.name,
            productSku: it.sku ?? null,
            quantity: it.quantity,
            unitPrice: it.unitPrice,
            unit: it.unit,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return apiSuccess(newOrder, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
