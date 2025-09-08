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
