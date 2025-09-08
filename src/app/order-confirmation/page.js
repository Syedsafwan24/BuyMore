'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
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
import {
	CheckCircle,
	Package,
	Truck,
	Mail,
	Calendar,
	ShoppingBag,
	ArrowRight,
	Download,
	Star,
} from 'lucide-react';

export default function OrderConfirmationPage() {
	const [order, setOrder] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const searchParams = useSearchParams();
	const orderId = searchParams.get('orderId');

	useEffect(() => {
		if (orderId) {
			fetchOrder();
		} else {
			setError('No order ID provided');
			setLoading(false);
		}
	}, [orderId]);

	const fetchOrder = async () => {
		try {
			const response = await fetch(`/api/orders/${orderId}`);

			if (response.ok) {
				const data = await response.json();
				setOrder(data);
			} else {
				setError('Order not found');
			}
		} catch (error) {
			console.error('Error fetching order:', error);
			setError('Failed to load order details');
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<div className='min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center'>
				<div className='text-center'>
					<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto'></div>
					<p className='mt-4 text-gray-700 font-medium'>
						Loading your order details...
					</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className='min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center'>
				<div className='text-center max-w-md mx-auto p-8'>
					<div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6'>
						<Package className='w-8 h-8 text-red-600' />
					</div>
					<h2 className='text-2xl font-bold text-gray-900 mb-4'>{error}</h2>
					<p className='text-gray-600 mb-6'>
						We couldn&apos;t find your order. Please check your order ID or contact
						support.
					</p>
					<div className='space-y-3'>
						<Link href='/products'>
							<Button className='w-full bg-blue-600 hover:bg-blue-700'>
								<ShoppingBag className='w-4 h-4 mr-2' />
								Continue Shopping
							</Button>
						</Link>
						<Link href='/cart'>
							<Button variant='outline' className='w-full'>
								View Cart
							</Button>
						</Link>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50'>
			<div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
				{/* Success Animation & Header */}
				<div className='text-center mb-12'>
					<div className='relative'>
						<div className='w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse'>
							<CheckCircle className='w-12 h-12 text-green-600' />
						</div>
						<div className='absolute inset-0 w-20 h-20 bg-green-200 rounded-full mx-auto animate-ping opacity-25'></div>
					</div>
					<h1 className='text-4xl font-bold text-gray-900 mb-4'>
						Order Confirmed! 🎉
					</h1>
					<p className='text-xl text-gray-700 mb-2'>
						Thank you for your purchase!
					</p>
					<p className='text-gray-600'>
						Your order has been successfully placed and is being processed.
					</p>
				</div>

				{order && (
					<div className='space-y-8'>
						{/* Order Status Timeline */}
						<Card className='shadow-xl border-0 bg-white/70 backdrop-blur-sm'>
							<CardHeader>
								<CardTitle className='flex items-center text-gray-900'>
									<Package className='w-6 h-6 text-blue-600 mr-3' />
									Order Status
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className='flex items-center justify-between'>
									<div className='flex flex-col items-center text-center'>
										<div className='w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mb-2'>
											<CheckCircle className='w-6 h-6 text-white' />
										</div>
										<span className='text-sm font-medium text-gray-900'>
											Order Placed
										</span>
										<span className='text-xs text-gray-600'>Just now</span>
									</div>
									<div className='flex-1 h-1 bg-gray-200 mx-4'>
										<div className='h-1 bg-blue-500 w-1/3 animate-pulse'></div>
									</div>
									<div className='flex flex-col items-center text-center'>
										<div className='w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-2'>
											<Package className='w-6 h-6 text-blue-600' />
										</div>
										<span className='text-sm font-medium text-gray-700'>
											Processing
										</span>
										<span className='text-xs text-gray-500'>1-2 days</span>
									</div>
									<div className='flex-1 h-1 bg-gray-200 mx-4'></div>
									<div className='flex flex-col items-center text-center'>
										<div className='w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-2'>
											<Truck className='w-6 h-6 text-gray-400' />
										</div>
										<span className='text-sm font-medium text-gray-500'>
											Shipping
										</span>
										<span className='text-xs text-gray-400'>3-5 days</span>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Order Details */}
						<div className='grid md:grid-cols-2 gap-8'>
							<Card className='shadow-xl border-0 bg-white/70 backdrop-blur-sm'>
								<CardHeader>
									<CardTitle className='text-gray-900'>
										Order Information
									</CardTitle>
									<CardDescription className='text-gray-600'>
										Order #{order.id}
									</CardDescription>
								</CardHeader>
								<CardContent className='space-y-4'>
									<div className='grid grid-cols-2 gap-4 text-sm'>
										<div>
											<span className='text-gray-600 flex items-center'>
												<Calendar className='w-4 h-4 mr-2' />
												Order Date
											</span>
											<p className='font-medium text-gray-900 mt-1'>
												{new Date(order.createdAt).toLocaleDateString('en-US', {
													weekday: 'long',
													year: 'numeric',
													month: 'long',
													day: 'numeric',
												})}
											</p>
										</div>
										<div>
											<span className='text-gray-600'>Status</span>
											<div className='mt-1'>
												<span className='px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium'>
													{order.status.charAt(0).toUpperCase() +
														order.status.slice(1)}
												</span>
											</div>
										</div>
										<div>
											<span className='text-gray-600'>Payment Method</span>
											<p className='font-medium text-gray-900 mt-1'>
												{order.paymentMethod
													.replace('_', ' ')
													.replace(/\b\w/g, (l) => l.toUpperCase())}
											</p>
										</div>
										<div>
											<span className='text-gray-600'>Order Total</span>
											<p className='font-bold text-2xl text-green-600 mt-1'>
												${order.total.toFixed(2)}
											</p>
										</div>
									</div>

									<div className='pt-4 border-t border-gray-200'>
										<span className='text-gray-600 flex items-center mb-3'>
											<Mail className='w-4 h-4 mr-2' />
											Shipping Address
										</span>
										<div className='text-sm text-gray-800 bg-gray-50 p-3 rounded-lg'>
											{(() => {
												try {
													const address = JSON.parse(order.shippingAddress);
													return (
														<div className='space-y-1'>
															<p className='font-medium'>{address.fullName}</p>
															<p>{address.address}</p>
															<p>
																{address.city}, {address.state}{' '}
																{address.zipCode}
															</p>
															<p>{address.country}</p>
														</div>
													);
												} catch {
													return <p>{order.shippingAddress}</p>;
												}
											})()}
										</div>
									</div>
								</CardContent>
							</Card>

							{/* Delivery Information */}
							<Card className='shadow-xl border-0 bg-white/70 backdrop-blur-sm'>
								<CardHeader>
									<CardTitle className='text-gray-900 flex items-center'>
										<Truck className='w-5 h-5 text-blue-600 mr-2' />
										Delivery Information
									</CardTitle>
								</CardHeader>
								<CardContent className='space-y-4'>
									<div className='bg-blue-50 p-4 rounded-lg'>
										<h4 className='font-medium text-blue-900 mb-2'>
											Estimated Delivery
										</h4>
										<p className='text-blue-800'>3-5 business days</p>
										<p className='text-sm text-blue-700 mt-1'>
											{new Date(
												Date.now() + 5 * 24 * 60 * 60 * 1000
											).toLocaleDateString('en-US', {
												weekday: 'long',
												month: 'long',
												day: 'numeric',
											})}
										</p>
									</div>

									<div className='space-y-3 text-sm'>
										<div className='flex items-center text-gray-700'>
											<Mail className='w-4 h-4 mr-3 text-green-500' />
											<span>Confirmation email sent</span>
										</div>
										<div className='flex items-center text-gray-700'>
											<Package className='w-4 h-4 mr-3 text-blue-500' />
											<span>We&apos;ll notify you when your order ships</span>
										</div>
										<div className='flex items-center text-gray-700'>
											<Truck className='w-4 h-4 mr-3 text-purple-500' />
											<span>Track your package with order ID</span>
										</div>
									</div>

									<div className='bg-amber-50 p-4 rounded-lg mt-4'>
										<h4 className='font-medium text-amber-900 mb-1'>
											Track Your Order
										</h4>
										<p className='text-sm text-amber-800 mb-3'>
											Use this order ID to track your package:
										</p>
										<div className='flex items-center space-x-2'>
											<code className='bg-white px-3 py-2 rounded border text-amber-900 font-mono text-sm flex-1'>
												{order.id}
											</code>
											<Button variant='outline' size='sm'>
												<Download className='w-4 h-4' />
											</Button>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>

						{/* Order Items */}
						<Card className='shadow-xl border-0 bg-white/70 backdrop-blur-sm'>
							<CardHeader>
								<CardTitle className='text-gray-900'>Items Ordered</CardTitle>
								<CardDescription className='text-gray-600'>
									{order.orderItems?.length || 0} item
									{(order.orderItems?.length || 0) !== 1 ? 's' : ''}
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className='space-y-4'>
									{order.orderItems?.map((orderItem) => (
										<div
											key={orderItem.id}
											className='flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors'
										>
											<img
												src={orderItem.item.image}
												alt={orderItem.item.name}
												className='w-20 h-20 object-cover rounded-lg shadow-md'
											/>
											<div className='flex-1'>
												<h4 className='font-semibold text-gray-900 text-lg'>
													{orderItem.item.name}
												</h4>
												<p className='text-gray-600'>
													{orderItem.item.category?.name}
												</p>
												<div className='flex items-center mt-2'>
													<span className='text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded'>
														Qty: {orderItem.quantity}
													</span>
												</div>
											</div>
											<div className='text-right'>
												<p className='font-bold text-xl text-gray-900'>
													{formatPriceDisplay((orderItem.price * orderItem.quantity))}
												</p>
												<p className='text-sm text-gray-600'>
													{formatPriceDisplay(orderItem.price)} each
												</p>
											</div>
										</div>
									))}

									<div className='border-t border-gray-200 pt-4'>
										<div className='flex justify-between items-center text-2xl font-bold text-gray-900'>
											<span>Order Total:</span>
											<span className='text-green-600'>
												${order.total.toFixed(2)}
											</span>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Action Buttons */}
						<div className='flex flex-col sm:flex-row gap-4 justify-center pt-8'>
							<Link href='/products'>
								<Button
									size='lg'
									className='w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white'
								>
									<ShoppingBag className='w-5 h-5 mr-2' />
									Continue Shopping
									<ArrowRight className='w-5 h-5 ml-2' />
								</Button>
							</Link>
							<Button
								variant='outline'
								size='lg'
								className='w-full sm:w-auto border-gray-300 text-gray-700 hover:bg-gray-50'
							>
								<Download className='w-5 h-5 mr-2' />
								Download Receipt
							</Button>
						</div>

						{/* Review Invitation */}
						<Card className='shadow-xl border-0 bg-gradient-to-r from-yellow-50 to-orange-50'>
							<CardContent className='text-center py-8'>
								<Star className='w-12 h-12 text-yellow-500 mx-auto mb-4' />
								<h3 className='text-xl font-semibold text-gray-900 mb-2'>
									Enjoyed your shopping experience?
								</h3>
								<p className='text-gray-600 mb-4'>
									We&apos;d love to hear your feedback! Your review helps other
									customers.
								</p>
								<Button
									variant='outline'
									className='border-yellow-400 text-yellow-700 hover:bg-yellow-50'
								>
									<Star className='w-4 h-4 mr-2' />
									Leave a Review
								</Button>
							</CardContent>
						</Card>
					</div>
				)}
			</div>
		</div>
	);
}

// Disable static generation for this page
export const dynamic = 'force-dynamic';
