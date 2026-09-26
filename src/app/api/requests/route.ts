import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

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

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Error fetching order requests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order requests from database' },
      { status: 500 }
    );
  }
}

// POST /api/requests - client submits an order request via catalog magic link
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, clientName, clientPhone, items, notes } = body;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'At least one item is required' },
        { status: 400 }
      );
    }

    // Find link if provided
    let link = null;
    let client = null;
    if (token && token !== 'demo') {
      link = await prisma.clientLink.findUnique({
        where: { token },
        include: { client: true },
      });
      if (link?.client) {
        client = link.client;
      }
    }

    // Auto-generate order number (e.g. REQ-1043)
    const count = await prisma.orderRequest.count();
    const orderNumber = `REQ-${1001 + count}`;

    const newOrder = await prisma.orderRequest.create({
      data: {
        orderNumber,
        linkId: link?.id || null,
        clientId: client?.id || null,
        clientName: clientName?.trim() || client?.name || 'مشتری مهمان',
        clientPhone: clientPhone?.trim() || client?.phone || null,
        notes: notes?.trim() || null,
        status: 'PENDING',
        items: {
          create: items.map((it: any) => ({
            productId: it.productId || it.id,
            productName: it.name || it.description,
            productSku: it.sku || null,
            quantity: it.quantity,
            unitPrice: Number(it.unitPrice),
            unit: it.unit || 'عدد',
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error('Error submitting order request:', error);
    return NextResponse.json(
      { error: 'Failed to submit order request in database' },
      { status: 500 }
    );
  }
}
