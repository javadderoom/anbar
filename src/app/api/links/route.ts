import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { CreateClientLinkSchema } from '@/lib/validations';
import { handleApiError, apiSuccess } from '@/lib/api-response';
import { getCurrentUser } from '@/lib/auth';
import { hasPermission, Permission } from '@/lib/permissions';

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

    return apiSuccess(formatted);
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/links - create a new client link with Zod validation
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || !hasPermission(user.role, Permission.MANAGE_LINKS)) {
      return NextResponse.json(
        { success: false, code: 'FORBIDDEN', message: 'شما دسترسی ایجاد لینک اختصاصی کاتالوگ را ندارید' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validated = CreateClientLinkSchema.parse(body);

    // Generate unique token slug
    const cleanSlug = validated.customToken?.trim()
      ? validated.customToken.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-')
      : `c-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;

    // Check if token is already taken
    const existingLink = await prisma.clientLink.findUnique({
      where: { token: cleanSlug },
    });
    if (existingLink) {
      return NextResponse.json(
        {
          success: false,
          code: 'DUPLICATE_TOKEN',
          message: 'این شناسه لینک قبلاً انتخاب شده است. لطفاً شناسه دیگری انتخاب کنید',
        },
        { status: 409 }
      );
    }

    // Check if client exists by phone or create new client
    let client = null;
    if (validated.phone) {
      client = await prisma.client.findFirst({
        where: { phone: validated.phone },
      });
    }

    if (!client) {
      client = await prisma.client.create({
        data: {
          name: validated.clientName,
          phone: validated.phone || null,
          isGuest: false,
        },
      });
    }

    const link = await prisma.clientLink.create({
      data: {
        token: cleanSlug,
        clientId: client.id,
        label: validated.clientName,
        isActive: true,
        expiresAt: validated.expiresAt ? new Date(validated.expiresAt) : null,
      },
      include: {
        client: true,
      },
    });

    return apiSuccess(
      {
        id: link.id,
        token: link.token,
        clientName: link.client?.name || link.label,
        phone: link.client?.phone || '—',
        createdDate: new Intl.DateTimeFormat('fa-IR').format(link.createdAt),
        requestCount: 0,
        isActive: link.isActive,
      },
      201
    );
  } catch (error) {
    return handleApiError(error);
  }
}
