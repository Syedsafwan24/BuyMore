'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatPriceDisplay } from '@/lib/utils';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/contexts/AuthContext';
import {
	CreditCard,
	Truck,
											{getShippingCost() === 0
											? 'FREE'
											: `₹${getShippingCost().toFixed(2)}`}eld,
	Clock,
	MapPin,
	ArrowLeft,
	CheckCircle,
	Loader,
} from 'lucide-react';

export default function CheckoutPage() {
	const [loading, setLoading] = useState(true);
	const [processing, setProcessing] = useState(false);
	const [error, setError] = useState('');
	const router = useRouter();

	const { user, loading: authLoading } = useAuth();
	const {
		cartItems,
		getTotalPrice: getCartTotalPrice,
		getTotalItems: getCartTotalItems,
		checkout,
		loading: cartLoading,
	} = useCart();

	const [shippingAddress, setShippingAddress] = useState({
		fullName: '',
		address: '',
		city: '',
		state: '',
		zipCode: '',
		country: '',
	});

	const [paymentMethod, setPaymentMethod] = useState('credit_card');
	const [cardDetails, setCardDetails] = useState({
		cardNumber: '',
		expiry: '',
		cvv: '',
		cardName: '',
	});

	// Redirect to login if not authenticated
	useEffect(() => {
		if (!authLoading && !user) {
			router.push('/login?redirect=/checkout');
		}
	}, [user, authLoading, router]);

	// Check if cart is empty and redirect
	useEffect(() => {
		if (!cartLoading && cartItems.length === 0) {
			router.push('/cart');
		}
	}, [cartItems, cartLoading, router]);

	useEffect(() => {
		if (!authLoading && !cartLoading) {
			setLoading(false);
		}
	}, [authLoading, cartLoading]);

	// Show loading if still checking auth/cart or user not found
	if (authLoading || cartLoading || !user || loading) {
		return (
			<div className='min-h-screen flex items-center justify-center'>
				<div className='text-center'>
					<Loader className='w-8 h-8 animate-spin mx-auto mb-4' />
					<p>Loading...</p>
				</div>
			</div>
		);
	}

	const getShippingCost = () => {
		const total = parseFloat(getCartTotalPrice());
		return total > 50 ? 0 : 9.99;
	};

	const getFinalTotal = () => {
		return (parseFloat(getCartTotalPrice()) + getShippingCost()).toFixed(2);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setProcessing(true);
		setError('');

		try {
			// Use the cart's checkout function
			const order = await checkout();

			// Redirect to order confirmation
			router.push(`/order-confirmation?orderId=${order.id}`);
		} catch (error) {
			setError(error.message || 'Something went wrong. Please try again.');
		} finally {
			setProcessing(false);
		}
	};

	const handleInputChange = (field, value) => {
		setShippingAddress((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleCardInputChange = (field, value) => {
		setCardDetails((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	if (loading) {
		return (
			<div className='min-h-screen bg-gray-50 flex items-center justify-center'>
				<div className='text-center'>
					<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
					<p className='mt-4 text-gray-600'>Loading checkout...</p>
				</div>
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-gray-50 py-8'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				{/* Header */}
				<div className='mb-8'>
					<Link
						href='/cart'
						className='inline-flex items-center text-blue-600 hover:text-blue-700 mb-4'
					>
						<ArrowLeft className='w-4 h-4 mr-2' />
						Back to Cart
					</Link>
					<h1 className='text-3xl font-bold text-gray-900'>Secure Checkout</h1>
					<p className='text-gray-600 mt-2'>Complete your order securely</p>
				</div>

				{error && (
					<div className='bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 flex items-center'>
						<div className='w-4 h-4 mr-3'>⚠️</div>
						{error}
					</div>
				)}

				{/* Security Banner */}
				<div className='bg-green-50 border border-green-200 rounded-lg p-4 mb-8'>
					<div className='flex items-center'>
						<Shield className='w-5 h-5 text-green-600 mr-3' />
						<div>
							<h3 className='text-sm font-medium text-green-800'>
								Secure Checkout
							</h3>
							<p className='text-sm text-green-700'>
								Your payment information is encrypted and secure
							</p>
						</div>
					</div>
				</div>

				<div className='grid lg:grid-cols-3 gap-8'>
					{/* Checkout Form */}
					<div className='lg:col-span-2 space-y-6'>
						{/* Shipping Address */}
						<Card className='shadow-lg border-0'>
							<CardHeader>
								<div className='flex items-center'>
									<MapPin className='w-5 h-5 text-blue-600 mr-3' />
									<div>
										<CardTitle>Shipping Address</CardTitle>
										<CardDescription>
											Where should we deliver your order?
										</CardDescription>
									</div>
								</div>
							</CardHeader>
							<CardContent>
								<form onSubmit={handleSubmit} className='space-y-4'>
									<div>
										<Label htmlFor='fullName' className='text-sm font-medium'>
											Full Name *
										</Label>
										<Input
											id='fullName'
											type='text'
											value={shippingAddress.fullName}
											onChange={(e) =>
												handleInputChange('fullName', e.target.value)
											}
											required
											className='mt-1 h-12'
											placeholder='Enter your full name'
										/>
									</div>

									<div>
										<Label htmlFor='address' className='text-sm font-medium'>
											Street Address *
										</Label>
										<Input
											id='address'
											type='text'
											value={shippingAddress.address}
											onChange={(e) =>
												handleInputChange('address', e.target.value)
											}
											required
											className='mt-1 h-12'
											placeholder='Enter your street address'
										/>
									</div>

									<div className='grid grid-cols-2 gap-4'>
										<div>
											<Label htmlFor='city' className='text-sm font-medium'>
												City *
											</Label>
											<Input
												id='city'
												type='text'
												value={shippingAddress.city}
												onChange={(e) =>
													handleInputChange('city', e.target.value)
												}
												required
												className='mt-1 h-12'
												placeholder='City'
											/>
										</div>
										<div>
											<Label htmlFor='state' className='text-sm font-medium'>
												State *
											</Label>
											<Input
												id='state'
												type='text'
												value={shippingAddress.state}
												onChange={(e) =>
													handleInputChange('state', e.target.value)
												}
												required
												className='mt-1 h-12'
												placeholder='State'
											/>
										</div>
									</div>

									<div className='grid grid-cols-2 gap-4'>
										<div>
											<Label htmlFor='zipCode' className='text-sm font-medium'>
												ZIP Code *
											</Label>
											<Input
												id='zipCode'
												type='text'
												value={shippingAddress.zipCode}
												onChange={(e) =>
													handleInputChange('zipCode', e.target.value)
												}
												required
												className='mt-1 h-12'
												placeholder='ZIP Code'
											/>
										</div>
										<div>
											<Label htmlFor='country' className='text-sm font-medium'>
												Country *
											</Label>
											<Input
												id='country'
												type='text'
												value={shippingAddress.country}
												onChange={(e) =>
													handleInputChange('country', e.target.value)
												}
												required
												className='mt-1 h-12'
												placeholder='Country'
											/>
										</div>
									</div>
								</form>
							</CardContent>
						</Card>

						{/* Payment Method */}
						<Card className='shadow-lg border-0'>
							<CardHeader>
								<div className='flex items-center'>
									<CreditCard className='w-5 h-5 text-blue-600 mr-3' />
									<div>
										<CardTitle>Payment Method</CardTitle>
										<CardDescription>
											Choose how you&apos;d like to pay
										</CardDescription>
									</div>
								</div>
							</CardHeader>
							<CardContent>
								<div className='space-y-4'>
									{/* Payment Options */}
									<div className='grid gap-4'>
										<div
											className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
												paymentMethod === 'credit_card'
													? 'border-blue-500 bg-blue-50'
													: 'border-gray-200 hover:border-gray-300'
											}`}
											onClick={() => setPaymentMethod('credit_card')}
										>
											<div className='flex items-center justify-between'>
												<div className='flex items-center'>
													<input
														type='radio'
														id='credit_card'
														name='payment'
														value='credit_card'
														checked={paymentMethod === 'credit_card'}
														onChange={(e) => setPaymentMethod(e.target.value)}
														className='h-4 w-4 text-blue-600 mr-3'
													/>
													<div>
														<Label
															htmlFor='credit_card'
															className='font-medium'
														>
															Credit/Debit Card
														</Label>
														<p className='text-sm text-gray-600'>
															Visa, Mastercard, American Express
														</p>
													</div>
												</div>
												<div className='flex space-x-2'>
													<div className='w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center'>
														VISA
													</div>
													<div className='w-8 h-5 bg-red-600 rounded text-white text-xs flex items-center justify-center'>
														MC
													</div>
												</div>
											</div>
										</div>

										<div
											className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
												paymentMethod === 'paypal'
													? 'border-blue-500 bg-blue-50'
													: 'border-gray-200 hover:border-gray-300'
											}`}
											onClick={() => setPaymentMethod('paypal')}
										>
											<div className='flex items-center'>
												<input
													type='radio'
													id='paypal'
													name='payment'
													value='paypal'
													checked={paymentMethod === 'paypal'}
													onChange={(e) => setPaymentMethod(e.target.value)}
													className='h-4 w-4 text-blue-600 mr-3'
												/>
												<div>
													<Label htmlFor='paypal' className='font-medium'>
														PayPal
													</Label>
													<p className='text-sm text-gray-600'>
														Pay with your PayPal account
													</p>
												</div>
											</div>
										</div>

										<div
											className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
												paymentMethod === 'cash_on_delivery'
													? 'border-blue-500 bg-blue-50'
													: 'border-gray-200 hover:border-gray-300'
											}`}
											onClick={() => setPaymentMethod('cash_on_delivery')}
										>
											<div className='flex items-center'>
												<input
													type='radio'
													id='cash_on_delivery'
													name='payment'
													value='cash_on_delivery'
													checked={paymentMethod === 'cash_on_delivery'}
													onChange={(e) => setPaymentMethod(e.target.value)}
													className='h-4 w-4 text-blue-600 mr-3'
												/>
												<div>
													<Label
														htmlFor='cash_on_delivery'
														className='font-medium'
													>
														Cash on Delivery
													</Label>
													<p className='text-sm text-gray-600'>
														Pay when your order arrives
													</p>
												</div>
											</div>
										</div>
									</div>

									{/* Credit Card Details */}
									{paymentMethod === 'credit_card' && (
										<div className='mt-6 p-4 bg-gray-50 rounded-lg space-y-4'>
											<h4 className='font-medium text-gray-900'>
												Card Details
											</h4>
											<div>
												<Label
													htmlFor='cardName'
													className='text-sm font-medium'
												>
													Cardholder Name *
												</Label>
												<Input
													id='cardName'
													type='text'
													value={cardDetails.cardName}
													onChange={(e) =>
														handleCardInputChange('cardName', e.target.value)
													}
													required={paymentMethod === 'credit_card'}
													className='mt-1 h-12'
													placeholder='Name on card'
												/>
											</div>
											<div>
												<Label
													htmlFor='cardNumber'
													className='text-sm font-medium'
												>
													Card Number *
												</Label>
												<Input
													id='cardNumber'
													type='text'
													value={cardDetails.cardNumber}
													onChange={(e) =>
														handleCardInputChange('cardNumber', e.target.value)
													}
													required={paymentMethod === 'credit_card'}
													className='mt-1 h-12'
													placeholder='1234 5678 9012 3456'
													maxLength={19}
												/>
											</div>
											<div className='grid grid-cols-2 gap-4'>
												<div>
													<Label
														htmlFor='expiry'
														className='text-sm font-medium'
													>
														Expiry Date *
													</Label>
													<Input
														id='expiry'
														type='text'
														value={cardDetails.expiry}
														onChange={(e) =>
															handleCardInputChange('expiry', e.target.value)
														}
														required={paymentMethod === 'credit_card'}
														className='mt-1 h-12'
														placeholder='MM/YY'
														maxLength={5}
													/>
												</div>
												<div>
													<Label htmlFor='cvv' className='text-sm font-medium'>
														CVV *
													</Label>
													<Input
														id='cvv'
														type='text'
														value={cardDetails.cvv}
														onChange={(e) =>
															handleCardInputChange('cvv', e.target.value)
														}
														required={paymentMethod === 'credit_card'}
														className='mt-1 h-12'
														placeholder='123'
														maxLength={4}
													/>
												</div>
											</div>
										</div>
									)}
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Order Summary */}
					<div>
						<Card className='sticky top-4 shadow-lg border-0'>
							<CardHeader>
								<CardTitle className='flex items-center'>
									<CheckCircle className='w-5 h-5 text-green-600 mr-2' />
									Order Summary
								</CardTitle>
							</CardHeader>
							<CardContent className='space-y-4'>
								{/* Items */}
								<div className='space-y-3 max-h-64 overflow-y-auto'>
									{cartItems.map((cartItem) => (
										<div
											key={cartItem.id}
											className='flex items-center space-x-3 p-3 bg-gray-50 rounded-lg'
										>
											<img
												src={cartItem.item.image}
												alt={cartItem.item.name}
												className='w-12 h-12 object-cover rounded'
											/>
											<div className='flex-1'>
												<h4 className='font-medium text-sm line-clamp-1'>
													{cartItem.item.name}
												</h4>
												<p className='text-xs text-gray-600'>
													Qty: {cartItem.quantity}
												</p>
											</div>
											<span className='font-medium text-sm'>
												{formatPriceDisplay(
													cartItem.item.price * cartItem.quantity
												)}
											</span>
										</div>
									))}
								</div>

								{/* Totals */}
								<div className='border-t border-gray-200 pt-4 space-y-3'>
									<div className='flex justify-between text-sm'>
										<span>Subtotal ({getCartTotalItems()} items):</span>
										<span>{formatPriceDisplay(getCartTotalPrice())}</span>
									</div>
									<div className='flex justify-between text-sm'>
										<div className='flex items-center'>
											<Truck className='w-4 h-4 mr-1 text-gray-400' />
											<span>Shipping:</span>
										</div>
										<span
											className={
												getShippingCost() === 0
													? 'text-green-600 font-medium'
													: ''
											}
										>
											{getShippingCost() === 0
												? 'FREE'
												: `$${getShippingCost().toFixed(2)}`}
										</span>
									</div>
									{getShippingCost() === 0 && (
										<p className='text-xs text-green-600'>
											Free shipping on orders over ₹3,000!
										</p>
									)}
									<div className='flex justify-between text-lg font-bold border-t border-gray-200 pt-3'>
										<span>Total:</span>
										<span>₹{getFinalTotal()}</span>
									</div>
								</div>

								{/* Estimated Delivery */}
								<div className='bg-blue-50 p-3 rounded-lg'>
									<div className='flex items-center text-sm text-blue-800'>
										<Clock className='w-4 h-4 mr-2' />
										<span>Estimated delivery: 3-5 business days</span>
									</div>
								</div>

								{/* Technical Note for Hiring Committee */}
								<div className='bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4'>
									<h4 className='font-semibold text-blue-900 text-sm mb-1'>📋 Technical Note for Hiring Committee:</h4>
									<p className='text-xs text-blue-800 leading-relaxed'>
										This demo uses file-based storage. On Netlify's serverless environment, 
										orders cannot persist after checkout due to read-only filesystem limitations. 
										Production would use a database solution.
									</p>
								</div>

								{/* Place Order Button */}
								<Button
									onClick={handleSubmit}
									disabled={processing}
									className='w-full h-12 text-lg font-medium'
									size='lg'
								>
									{processing
										? 'Processing...'
										: `Place Order - ₹${getFinalTotal()}`}
								</Button>

								<div className='text-center'>
									<Link href='/cart'>
										<Button variant='outline' className='w-full'>
											Back to Cart
										</Button>
									</Link>
								</div>

								{/* Security Note */}
								<div className='text-xs text-gray-500 text-center'>
									<Shield className='w-3 h-3 inline mr-1' />
									Your payment is secured with 256-bit SSL encryption
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}
