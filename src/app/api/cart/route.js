import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function GET(request) {
	try {
		const token = getTokenFromRequest(request);
		const payload = verifyToken(token);

		if (!payload) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const cartItems = await prisma.cartItem.findMany({
			where: { userId: payload.userId },
			include: {
				item: {
					include: {
						category: true,
					},
				},
			},
		});

		return NextResponse.json(cartItems);
	} catch (error) {
		console.error('Get cart error:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}

export async function POST(request) {
	try {
		const token = getTokenFromRequest(request);
		const payload = verifyToken(token);

		if (!payload) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const { itemId, quantity } = await request.json();

		// Check if item exists in cart
		const existingCartItem = await prisma.cartItem.findUnique({
			where: {
				userId_itemId: {
					userId: payload.userId,
					itemId,
				},
			},
		});

		let cartItem;

		if (existingCartItem) {
			// Update quantity
			cartItem = await prisma.cartItem.update({
				where: { id: existingCartItem.id },
				data: { quantity: existingCartItem.quantity + quantity },
				include: {
					item: {
						include: {
							category: true,
						},
					},
				},
			});
		} else {
			// Create new cart item
			cartItem = await prisma.cartItem.create({
				data: {
					userId: payload.userId,
					itemId,
					quantity,
				},
				include: {
					item: {
						include: {
							category: true,
						},
					},
				},
			});
		}

		return NextResponse.json(cartItem, { status: 201 });
	} catch (error) {
		console.error('Add to cart error:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
