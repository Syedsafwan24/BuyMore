import { NextResponse } from 'next/server';
import { getCartByUserId, addItemToCart, clearCart } from '@/lib/localData';
import { findItemById } from '@/lib/staticData';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function GET(request) {
	try {
		const token = getTokenFromRequest(request);
		const payload = verifyToken(token);

		if (!payload) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		const cartItems = getCartByUserId(payload.userId);

		// Populate cart items with item details
		const populatedCartItems = cartItems
			.map((cartItem) => {
				const item = findItemById(cartItem.itemId);
				return {
					...cartItem,
					item: item || null,
				};
			})
			.filter((cartItem) => cartItem.item !== null); // Remove items that no longer exist

		return NextResponse.json(populatedCartItems);
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

		// Check if item exists
		const item = findItemById(itemId);
		if (!item) {
			return NextResponse.json({ error: 'Item not found' }, { status: 404 });
		}

		// Add to cart
		const updatedCart = addItemToCart(
			payload.userId,
			itemId,
			quantity || 1,
			item
		);

		// Get the newly added/updated cart item with item details
		const cartItem = updatedCart.find(
			(cartEntry) => cartEntry.itemId === itemId
		);
		const populatedCartItem = {
			...cartItem,
			item: findItemById(cartItem.itemId),
		};

		return NextResponse.json(populatedCartItem, { status: 201 });
	} catch (error) {
		console.error('Add to cart error:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}

export async function DELETE(request) {
	try {
		const token = getTokenFromRequest(request);
		const payload = verifyToken(token);

		if (!payload) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		// Clear entire cart
		clearCart(payload.userId);

		return NextResponse.json({ message: 'Cart cleared successfully' });
	} catch (error) {
		console.error('Clear cart error:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
