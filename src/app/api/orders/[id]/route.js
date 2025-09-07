import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function GET(request, { params }) {
	try {
		const token = getTokenFromRequest(request);
		const payload = verifyToken(token);

		if (!payload) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const { id } = await params;

		const order = await prisma.order.findFirst({
			where: {
				id: id,
				userId: payload.userId,
			},
			include: {
				orderItems: {
					include: {
						item: {
							include: {
								category: true,
							},
						},
					},
				},
			},
		});

		if (!order) {
			return NextResponse.json({ error: 'Order not found' }, { status: 404 });
		}

		return NextResponse.json(order);
	} catch (error) {
		console.error('Get order error:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
