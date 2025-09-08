'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { formatPriceDisplay } from '@/lib/utils';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/toast';
import {
	ShoppingBag,
	Trash2,
	Plus,
	Minus,
	ArrowRight,
	Heart,
	Truck,
	Shield,
	Loader,
} from 'lucide-react';

export default function CartPage() {
	const [updatingItems, setUpdatingItems] = useState(new Set());
	const [removingItems, setRemovingItems] = useState(new Set());
	const router = useRouter();

	const { user, loading: authLoading } = useAuth();
	const {
		cartItems,
		loading,
		isUpdating,
		updateQuantity,
		removeFromCart,
		getTotalPrice,
		getTotalItems,
	} = useCart();
	const { success, error } = useToast();

	// Redirect to login if not authenticated
	useEffect(() => {
		if (!authLoading && !user) {
			router.push('/login?redirect=/cart');
		}
	}, [user, authLoading, router]);

	// Show loading if still checking auth or user not found
	if (authLoading || !user) {
		return (
			<div className='min-h-screen flex items-center justify-center'>
				<div className='text-center'>
					<Loader className='w-8 h-8 animate-spin mx-auto mb-4' />
					<p>Loading...</p>
				</div>
			</div>
		);
	}

	const handleUpdateQuantity = async (cartItemId, newQuantity) => {
		if (newQuantity < 1 || updatingItems.has(cartItemId)) return;

		setUpdatingItems((prev) => new Set([...prev, cartItemId]));

		try {
			const result = await updateQuantity(cartItemId, newQuantity);
			if (!result.success) {
				error(result.error || 'Failed to update quantity');
			}
		} catch (err) {
			error('Failed to update quantity');
		} finally {
			setUpdatingItems((prev) => {
				const newSet = new Set(prev);
				newSet.delete(cartItemId);
				return newSet;
			});
		}
	};

	const handleRemoveFromCart = async (cartItemId) => {
		if (removingItems.has(cartItemId)) return;

		setRemovingItems((prev) => new Set([...prev, cartItemId]));

		try {
			const result = await removeFromCart(cartItemId);
			if (result.success) {
				success('Item removed from cart');
			} else {
				error(result.error || 'Failed to remove item');
			}
		} catch (err) {
			error('Failed to remove item');
		} finally {
			setRemovingItems((prev) => {
				const newSet = new Set(prev);
				newSet.delete(cartItemId);
				return newSet;
			});
		}
	};

	if (loading) {
		return (
			<div className='min-h-screen bg-gray-50 flex items-center justify-center'>
				<div className='text-center'>
					<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
					<p className='mt-4 text-gray-600'>Loading your cart...</p>
				</div>
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-gray-50'>
			<div className='px-6 py-6'>
				<div className='mb-8'>
					<h1 className='text-3xl font-bold text-gray-900'>Shopping Cart</h1>
					<p className='text-gray-600 mt-2'>
						{cartItems.length === 0
							? 'Your cart is empty'
							: `${getTotalItems()} items in your cart`}
					</p>
				</div>

				{cartItems.length === 0 ? (
					<div className='text-center py-12'>
						<Card>
							<CardContent className='p-12'>
								<h3 className='text-xl font-semibold text-gray-900 mb-4'>
									Your cart is empty
								</h3>
								<p className='text-gray-600 mb-6'>
									Looks like you haven&apos;t added any items to your cart yet.
								</p>
								<Link href='/products'>
									<Button size='lg'>Start Shopping</Button>
								</Link>
							</CardContent>
						</Card>
					</div>
				) : (
					<div className='grid lg:grid-cols-3 gap-8'>
						{/* Cart Items */}
						<div className='lg:col-span-2 space-y-4'>
							{cartItems.map((cartItem) => (
								<Card
									key={cartItem.id}
									className={cartItem.isOptimistic ? 'opacity-60' : ''}
								>
									<CardContent className='p-6'>
										<div className='flex items-center space-x-4'>
											<img
												src={
													cartItem.item.image ||
													cartItem.item.imageUrl ||
													'/placeholder-product.svg'
												}
												alt={cartItem.item.name}
												className='w-20 h-20 object-cover rounded-lg'
											/>
											<div className='flex-1'>
												<h3 className='font-semibold text-lg'>
													{cartItem.item.name}
												</h3>
												<p className='text-gray-600 text-sm mb-2'>
													{cartItem.item.category?.name || 'Product'}
												</p>
												<p className='text-blue-600 font-bold text-lg'>
													{formatPriceDisplay(cartItem.item.price)}
												</p>
											</div>
											<div className='flex items-center space-x-3'>
												<div className='flex items-center space-x-2'>
													<Button
														variant='outline'
														size='sm'
														onClick={() =>
															handleUpdateQuantity(
																cartItem.id,
																cartItem.quantity - 1
															)
														}
														disabled={
															cartItem.quantity <= 1 ||
															updatingItems.has(cartItem.id) ||
															removingItems.has(cartItem.id)
														}
													>
														{updatingItems.has(cartItem.id) ? (
															<Loader className='w-3 h-3 animate-spin' />
														) : (
															<Minus className='w-3 h-3' />
														)}
													</Button>
													<span className='w-12 text-center font-semibold'>
														{cartItem.quantity}
													</span>
													<Button
														variant='outline'
														size='sm'
														onClick={() =>
															handleUpdateQuantity(
																cartItem.id,
																cartItem.quantity + 1
															)
														}
														disabled={
															cartItem.quantity >=
																(cartItem.item.stock || 99) ||
															updatingItems.has(cartItem.id) ||
															removingItems.has(cartItem.id)
														}
													>
														{updatingItems.has(cartItem.id) ? (
															<Loader className='w-3 h-3 animate-spin' />
														) : (
															<Plus className='w-3 h-3' />
														)}
													</Button>
												</div>
												<Button
													variant='destructive'
													size='sm'
													onClick={() => handleRemoveFromCart(cartItem.id)}
													disabled={
														removingItems.has(cartItem.id) ||
														updatingItems.has(cartItem.id)
													}
												>
													{removingItems.has(cartItem.id) ? (
														<>
															<Loader className='w-4 h-4 mr-2 animate-spin' />
															Removing...
														</>
													) : (
														<>
															<Trash2 className='w-4 h-4 mr-2' />
															Remove
														</>
													)}
												</Button>
											</div>
										</div>
										<div className='mt-4 pt-4 border-t border-gray-200'>
											<div className='flex justify-between items-center'>
												<span className='text-gray-600'>Subtotal:</span>
												<span className='font-bold text-lg'>
													$
													{(cartItem.item.price * cartItem.quantity).toFixed(2)}
												</span>
											</div>
										</div>
									</CardContent>
								</Card>
							))}
						</div>

						{/* Order Summary */}
						<div className='lg:col-span-1'>
							<Card className='sticky top-4'>
								<CardHeader>
									<CardTitle>Order Summary</CardTitle>
								</CardHeader>
								<CardContent className='space-y-4'>
									<div className='flex justify-between'>
										<span>Items ({getTotalItems()}):</span>
										<span>{formatPriceDisplay(getTotalPrice())}</span>
									</div>
									<div className='flex justify-between'>
										<span>Shipping:</span>
										<span>Free</span>
									</div>
									<div className='border-t border-gray-200 pt-4'>
										<div className='flex justify-between text-lg font-bold'>
											<span>Total:</span>
											<span>{formatPriceDisplay(getTotalPrice())}</span>
										</div>
									</div>
									<Button className='w-full' size='lg'>
										<Link href='/checkout' className='w-full'>
											Proceed to Checkout
										</Link>
									</Button>
									<Link href='/products'>
										<Button variant='outline' className='w-full'>
											Continue Shopping
										</Button>
									</Link>
								</CardContent>
							</Card>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
