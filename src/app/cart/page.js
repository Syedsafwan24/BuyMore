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
			<div className='max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8'>
				{/* Header */}
				<div className='mb-8'>
					<div className='flex items-center space-x-3 mb-4'>
						<ShoppingBag className='w-8 h-8 text-blue-600' />
						<h1 className='text-3xl font-bold text-gray-900'>Shopping Cart</h1>
					</div>
					<p className='text-gray-600 text-lg'>
						{cartItems.length === 0
							? 'Your cart is empty'
							: `${getTotalItems()} items in your cart`}
					</p>
				</div>

				{cartItems.length === 0 ? (
					<div className='flex justify-center py-12'>
						<Card className='w-full max-w-md shadow-lg'>
							<CardContent className='p-12 text-center'>
								<div className='mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6'>
									<ShoppingBag className='w-12 h-12 text-gray-400' />
								</div>
								<h3 className='text-2xl font-semibold text-gray-900 mb-4'>
									Your cart is empty
								</h3>
								<p className='text-gray-600 mb-8 text-lg'>
									Looks like you haven&apos;t added any items to your cart yet.
								</p>
								<Link href='/products'>
									<Button
										size='lg'
										className='w-full h-12 text-lg font-semibold bg-blue-600 hover:bg-blue-700'
									>
										<ShoppingBag className='w-5 h-5 mr-2' />
										Start Shopping
									</Button>
								</Link>
							</CardContent>
						</Card>
					</div>
				) : (
					<div className='max-w-7xl mx-auto'>
						<div className='grid lg:grid-cols-3 gap-6 lg:gap-8'>
							{/* Cart Items */}
							<div className='lg:col-span-2 space-y-4'>
								{cartItems.map((cartItem) => (
									<Card
										key={cartItem.id}
										className={`${
											cartItem.isOptimistic ? 'opacity-60' : ''
										} shadow-sm hover:shadow-md transition-shadow`}
									>
										<CardContent className='p-6'>
											<div className='flex items-start space-x-4'>
												{/* Product Image */}
												<div className='flex-shrink-0'>
													<img
														src={
															cartItem.item.image ||
															cartItem.item.imageUrl ||
															'/placeholder-product.svg'
														}
														alt={cartItem.item.name}
														className='w-24 h-24 object-cover rounded-lg border border-gray-200'
													/>
												</div>

												{/* Product Details */}
												<div className='flex-1 min-w-0'>
													<div className='flex justify-between items-start'>
														<div className='flex-1'>
															<h3 className='font-semibold text-lg text-gray-900 mb-1'>
																{cartItem.item.name}
															</h3>
															<p className='text-gray-500 text-sm mb-2'>
																{cartItem.item.category?.name || 'Product'}
															</p>
															<p className='text-blue-600 font-bold text-xl'>
																{formatPriceDisplay(cartItem.item.price)}
															</p>
														</div>
													</div>

													{/* Quantity Controls and Actions */}
													<div className='flex items-center justify-between mt-4'>
														<div className='flex items-center space-x-3'>
															<span className='text-sm font-medium text-gray-700'>
																Quantity:
															</span>
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
																	className='h-8 w-8 p-0 border-gray-300'
																>
																	{updatingItems.has(cartItem.id) ? (
																		<Loader className='w-3 h-3 animate-spin' />
																	) : (
																		<Minus className='w-3 h-3' />
																	)}
																</Button>
																<span className='w-12 text-center font-semibold text-base bg-gray-50 py-1 px-2 rounded border'>
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
																	className='h-8 w-8 p-0 border-gray-300'
																>
																	{updatingItems.has(cartItem.id) ? (
																		<Loader className='w-3 h-3 animate-spin' />
																	) : (
																		<Plus className='w-3 h-3' />
																	)}
																</Button>
															</div>
														</div>

														<Button
															variant='destructive'
															size='sm'
															onClick={() => handleRemoveFromCart(cartItem.id)}
															disabled={
																removingItems.has(cartItem.id) ||
																updatingItems.has(cartItem.id)
															}
															className='px-4 py-2'
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
											</div>

											{/* Subtotal */}
											<div className='mt-6 pt-4 border-t border-gray-200'>
												<div className='flex justify-between items-center'>
													<span className='text-gray-600 font-medium'>
														Subtotal:
													</span>
													<span className='font-bold text-xl text-gray-900'>
														{formatPriceDisplay(
															cartItem.item.price * cartItem.quantity
														)}
													</span>
												</div>
											</div>
										</CardContent>
									</Card>
								))}
							</div>

							{/* Order Summary */}
							<div className='lg:col-span-1'>
								<Card className='sticky top-4 shadow-lg'>
									<CardHeader className='bg-gray-50 rounded-t-lg'>
										<CardTitle className='text-xl font-bold text-gray-900'>
											Order Summary
										</CardTitle>
									</CardHeader>
									<CardContent className='p-6 space-y-6'>
										<div className='space-y-4'>
											<div className='flex justify-between items-center text-base'>
												<span className='text-gray-600'>
													Items ({getTotalItems()}):
												</span>
												<span className='font-semibold'>
													{formatPriceDisplay(getTotalPrice())}
												</span>
											</div>
											<div className='flex justify-between items-center text-base'>
												<span className='text-gray-600'>Shipping:</span>
												<span className='font-semibold text-green-600'>
													Free
												</span>
											</div>
											<div className='flex justify-between items-center text-base'>
												<span className='text-gray-600'>Tax:</span>
												<span className='font-semibold'>Included</span>
											</div>
										</div>

										<div className='border-t border-gray-200 pt-4'>
											<div className='flex justify-between items-center'>
												<span className='text-xl font-bold text-gray-900'>
													Total:
												</span>
												<span className='text-2xl font-bold text-blue-600'>
													{formatPriceDisplay(getTotalPrice())}
												</span>
											</div>
										</div>

										<div className='space-y-3'>
											<Link href='/checkout' className='block'>
												<Button
													className='w-full h-12 text-lg font-semibold bg-blue-600 hover:bg-blue-700'
													size='lg'
													disabled={
														isUpdating ||
														cartItems.some(
															(item) =>
																updatingItems.has(item.id) ||
																removingItems.has(item.id)
														)
													}
												>
													{isUpdating ||
													cartItems.some(
														(item) =>
															updatingItems.has(item.id) ||
															removingItems.has(item.id)
													) ? (
														<>
															<Loader className='w-5 h-5 mr-2 animate-spin' />
															Processing...
														</>
													) : (
														<>
															<ArrowRight className='w-5 h-5 mr-2' />
															Proceed to Checkout
														</>
													)}
												</Button>
											</Link>
											<Link href='/products'>
												<Button
													variant='outline'
													className='w-full h-11 font-medium border-gray-300 hover:bg-gray-50'
												>
													Continue Shopping
												</Button>
											</Link>
										</div>
									</CardContent>
								</Card>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
