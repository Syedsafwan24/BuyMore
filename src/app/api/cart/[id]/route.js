import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function PUT(request, { params }) {
	try {
		const token = getTokenFromRequest(request);
		const payload = verifyToken(token);

		if (!payload) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const { id } = await params;
		const { quantity } = await request.json();

		const cartItem = await prisma.cartItem.update({
			where: {
				id: id,
				userId: payload.userId,
			},
			data: { quantity },
			include: {
				item: {
					include: {
						category: true,
					},
				},
			},
		});

		return NextResponse.json(cartItem);
	} catch (error) {
		console.error('Update cart item error:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}

export async function DELETE(request, { params }) {
	try {
		const token = getTokenFromRequest(request);
		const payload = verifyToken(token);

		if (!payload) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const { id } = await params;

		await prisma.cartItem.delete({
			where: {
				id: id,
				userId: payload.userId,
			},
		});

		return NextResponse.json({ message: 'Item removed from cart' });
	} catch (error) {
		console.error('Remove from cart error:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
