import { NextResponse } from 'next/server';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';
import { findItemById } from '@/lib/staticData';
import { getOrderById } from '@/lib/localData';

export async function GET(request, { params }) {
	try {
		const token = getTokenFromRequest(request);
		const payload = verifyToken(token);

		if (!payload) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const { id } = await params;

		const order = getOrderById(id);

		if (!order) {
			// Fallback for demo purposes when order is not found (Netlify limitation)
			if (id === '1000') {
				const mockOrder = {
					id: '1000',
					userId: payload.userId,
					items: [
						{
							itemId: '1',
							name: 'IKEA Wooden Dining Table',
							price: 12999,
							quantity: 1,
							subtotal: 12999,
						},
					],
					totalAmount: 12999,
					paymentMethod: 'credit_card',
					shippingAddress: {
						name: 'Demo User',
						email: 'demo@example.com',
						address: '123 Demo Street',
						city: 'Demo City',
						state: 'Demo State',
						zipCode: '12345',
						country: 'India',
					},
					status: 'confirmed',
					createdAt: new Date().toISOString(),
				};

				// Enrich with item data
				const enrichedOrder = {
					...mockOrder,
					orderItems: mockOrder.items.map((orderItem) => {
						const item = findItemById(orderItem.itemId);
						return {
							...orderItem,
							item: item
								? {
										...item,
										category: item.category,
								  }
								: null,
						};
					}),
				};

				return NextResponse.json(enrichedOrder);
			}

			return NextResponse.json({ error: 'Order not found' }, { status: 404 });
		}

		// Check if order belongs to the user
		if (order.userId !== payload.userId) {
			return NextResponse.json({ error: 'Order not found' }, { status: 404 });
		}

		// Enrich order items with full item data
		const enrichedOrder = {
			...order,
			orderItems: order.items.map((orderItem) => {
				const item = findItemById(orderItem.itemId);
				return {
					...orderItem,
					item: item
						? {
								...item,
								category: item.category,
						  }
						: null,
				};
			}),
		};

		return NextResponse.json(enrichedOrder);
	} catch (error) {
		console.error('Get order error:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
