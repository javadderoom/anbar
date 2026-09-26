import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/links - list all client links with order counts
export async function GET() {
  try {
    const links = await prisma.clientLink.findMany({
      include: {
        client: true,
        _count: {
          select: { orders: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = links.map((l) => ({
      id: l.id,
      token: l.token,
      clientName: l.client?.name || l.label || 'لینک عمومی خریداران',
      phone: l.client?.phone || (l.client?.isGuest ? 'عمومی / مهمان' : '—'),
      createdDate: new Intl.DateTimeFormat('fa-IR').format(l.createdAt),
      requestCount: l._count.orders,
      isActive: l.isActive,
      expiresAt: l.expiresAt?.toISOString(),
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Error fetching links:', error);
    return NextResponse.json(
      { error: 'Failed to fetch client links from database' },
      { status: 500 }
    );
  }
}

// POST /api/links - create a new client link
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { clientName, phone, customToken } = body;

    if (!clientName?.trim()) {
      return NextResponse.json(
        { error: 'Client name is required' },
        { status: 400 }
      );
    }

    // Generate unique token slug
    const cleanSlug = customToken?.trim()
      ? customToken.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-')
      : `c-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;

    // Check if client exists by phone or create new client
    let client = null;
    if (phone?.trim()) {
      client = await prisma.client.findFirst({
        where: { phone: phone.trim() },
      });
    }

    if (!client) {
      client = await prisma.client.create({
        data: {
          name: clientName.trim(),
          phone: phone?.trim() || null,
          isGuest: false,
        },
      });
    }

    const link = await prisma.clientLink.create({
      data: {
        token: cleanSlug,
        clientId: client.id,
        label: clientName.trim(),
        isActive: true,
      },
      include: {
        client: true,
      },
    });

    return NextResponse.json(
      {
        id: link.id,
        token: link.token,
        clientName: link.client?.name || link.label,
        phone: link.client?.phone || '—',
        createdDate: new Intl.DateTimeFormat('fa-IR').format(link.createdAt),
        requestCount: 0,
        isActive: link.isActive,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating client link:', error);
    return NextResponse.json(
      { error: 'Failed to create client link in database' },
      { status: 500 }
    );
  }
}
