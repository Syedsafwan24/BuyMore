import { NextResponse } from 'next/server';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';
import { getCartByUserId, clearCart } from '@/lib/localData';
import { findItemById } from '@/lib/staticData';
import { createOrder } from '@/lib/localData';

export async function POST(request) {
	try {
		const token = getTokenFromRequest(request);
		const payload = verifyToken(token);

		// Require authentication for checkout
		if (!payload) {
			return NextResponse.json(
				{ error: 'Authentication required' },
				{ status: 401 }
			);
		}

		const {
			shippingAddress,
			paymentMethod,
			cartItems: clientCartItems,
			totalAmount,
		} = await request.json();

		let cartItems = [];

		// Get cart from server (local data)
		cartItems = getCartByUserId(payload.userId);

		// If client sent cart items and server cart is empty, use client cart
		if (
			cartItems.length === 0 &&
			clientCartItems &&
			clientCartItems.length > 0
		) {
			cartItems = clientCartItems;
		}

		if (cartItems.length === 0) {
			return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
		}

		// Enrich cart items with full item data and calculate total
		const orderItems = [];
		let total = 0;

		for (const cartItem of cartItems) {
			// Handle different cart item structures
			let itemId, quantity;
			if (cartItem.itemId) {
				// Server cart format
				itemId = cartItem.itemId;
				quantity = cartItem.quantity;
			} else if (cartItem.item && cartItem.item.id) {
				// Client cart format with nested item
				itemId = cartItem.item.id;
				quantity = cartItem.quantity;
			} else {
				console.error('Invalid cart item format:', cartItem);
				continue;
			}

			const item = findItemById(itemId);
			if (!item) {
				return NextResponse.json(
					{ error: `Item ${itemId} not found` },
					{ status: 400 }
				);
			}

			const orderItem = {
				itemId: item.id,
				name: item.name,
				price: item.price,
				quantity: quantity,
				total: item.price * quantity,
			};

			orderItems.push(orderItem);
			total += orderItem.total;
		}

		// Use provided total amount or calculated total
		const finalTotal = totalAmount || total;

		// Create order using local data storage
		const order = createOrder(
			payload.userId,
			cartItems,
			finalTotal,
			paymentMethod,
			shippingAddress
		);

		// Simulate payment processing (in real app, integrate with Stripe/PayPal)
		await new Promise((resolve) => setTimeout(resolve, 1000));

		return NextResponse.json(
			{
				message: 'Order placed successfully',
				order: {
					id: order.id,
					total: order.totalAmount,
					totalAmount: order.totalAmount,
					paymentMethod: order.paymentMethod,
					shippingAddress: order.shippingAddress,
					status: order.status,
					items: order.items,
					createdAt: order.createdAt,
				},
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
