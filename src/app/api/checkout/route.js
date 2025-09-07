import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function POST(request) {
	try {
		const token = getTokenFromRequest(request);
		const payload = verifyToken(token);

		if (!payload) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const { shippingAddress, paymentMethod } = await request.json();

		// Get user's cart items
		const cartItems = await prisma.cartItem.findMany({
			where: { userId: payload.userId },
			include: {
				item: true,
			},
		});

		if (cartItems.length === 0) {
			return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
		}

		// Calculate total
		const total = cartItems.reduce((sum, cartItem) => {
			return sum + cartItem.item.price * cartItem.quantity;
		}, 0);

		// Create order in a transaction
		const result = await prisma.$transaction(async (tx) => {
			// Create order
			const order = await tx.order.create({
				data: {
					userId: payload.userId,
					total: total,
					status: 'pending',
					shippingAddress: JSON.stringify(shippingAddress),
					paymentMethod,
				},
			});

			// Create order items
			const orderItems = await Promise.all(
				cartItems.map((cartItem) =>
					tx.orderItem.create({
						data: {
							orderId: order.id,
							itemId: cartItem.itemId,
							quantity: cartItem.quantity,
							price: cartItem.item.price,
						},
					})
				)
			);

			// Update item stock
			await Promise.all(
				cartItems.map((cartItem) =>
					tx.item.update({
						where: { id: cartItem.itemId },
						data: {
							stock: {
								decrement: cartItem.quantity,
							},
						},
					})
				)
			);

			// Clear cart
			await tx.cartItem.deleteMany({
				where: { userId: payload.userId },
			});

			return { order, orderItems };
		});

		// Simulate payment processing (in real app, integrate with Stripe/PayPal)
		await new Promise((resolve) => setTimeout(resolve, 1000));

		// Update order status to completed
		const completedOrder = await prisma.order.update({
			where: { id: result.order.id },
			data: { status: 'completed' },
			include: {
				orderItems: {
					include: {
						item: true,
					},
				},
			},
		});

		return NextResponse.json(
			{
				message: 'Order placed successfully',
				order: completedOrder,
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error('Checkout error:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
