import { NextResponse } from 'next/server';
import {
	updateCartItem,
	removeCartItem,
	getCartByUserId,
} from '@/lib/localData';
import { findItemById } from '@/lib/staticData';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function PUT(request, { params }) {
	try {
		const token = getTokenFromRequest(request);
		const payload = verifyToken(token);

		if (!payload) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const { id } = params || {};
		const { quantity } = await request.json();

		// The id here is the cart item ID
		const updatedCart = updateCartItem(payload.userId, id, quantity);

		// Find the updated cart item
		const cartItem = updatedCart.find((item) => item.id === id);
		if (!cartItem) {
			return NextResponse.json(
				{ error: 'Cart item not found' },
				{ status: 404 }
			);
		}

		// Populate with item details
		const populatedCartItem = {
			...cartItem,
			item: findItemById(cartItem.itemId),
		};

		return NextResponse.json(populatedCartItem);
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

		const { id } = params || {};

		// Remove item from cart (id is cart item ID)
		removeCartItem(payload.userId, id);

		return NextResponse.json({ message: 'Item removed from cart' });
	} catch (error) {
		console.error('Remove from cart error:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
