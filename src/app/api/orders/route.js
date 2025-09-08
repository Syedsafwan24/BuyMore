import { NextResponse } from 'next/server';
import { getOrders, getOrdersByUserId } from '@/lib/localData';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function GET(request) {
	try {
		const token = getTokenFromRequest(request);
		const payload = verifyToken(token);

		if (payload) {
			// If authenticated, return user's orders
			const userOrders = getOrdersByUserId(payload.userId);
			return NextResponse.json(userOrders);
		} else {
			// If not authenticated, return empty array
			return NextResponse.json([]);
		}
	} catch (error) {
		console.error('Error reading orders:', error);
		return NextResponse.json(
			{ error: 'Failed to read orders' },
			{ status: 500 }
		);
	}
}
