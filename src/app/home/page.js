'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';

export default function HomePage() {
	return (
		<div className='min-h-screen bg-gray-50'>
			{/* Header */}
			<header className='bg-white shadow-sm border-b'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='flex justify-between items-center h-16'>
						<Link href='/' className='text-2xl font-bold text-blue-600'>
							ShopEasy
						</Link>
						<nav className='flex items-center space-x-4'>
							<Link href='/products'>
								<Button variant='ghost'>Products</Button>
							</Link>
							<Link href='/cart'>
								<Button variant='ghost'>Cart</Button>
							</Link>
							<Link href='/login'>
								<Button variant='outline'>Login</Button>
							</Link>
							<Link href='/signup'>
								<Button>Sign Up</Button>
							</Link>
						</nav>
					</div>
				</div>
			</header>

			{/* Hero Section */}
			<section className='bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
					<h1 className='text-4xl md:text-6xl font-bold mb-6'>
						Welcome to ShopEasy
					</h1>
					<p className='text-xl mb-8 max-w-2xl mx-auto'>
						Discover amazing products at unbeatable prices. Shop with confidence
						and enjoy fast, secure delivery.
					</p>
					<Link href='/products'>
						<Button
							size='lg'
							className='bg-white text-blue-600 hover:bg-gray-100'
						>
							Start Shopping
						</Button>
					</Link>
				</div>
			</section>

			{/* Features */}
			<section className='py-16'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<h2 className='text-3xl font-bold text-center mb-12'>
						Why Choose ShopEasy?
					</h2>
					<div className='grid md:grid-cols-3 gap-8'>
						<Card>
							<CardHeader>
								<CardTitle>Fast Delivery</CardTitle>
								<CardDescription>
									Get your orders delivered quickly with our express shipping
									options
								</CardDescription>
							</CardHeader>
						</Card>
						<Card>
							<CardHeader>
								<CardTitle>Secure Payments</CardTitle>
								<CardDescription>
									Shop with confidence using our secure payment processing
								</CardDescription>
							</CardHeader>
						</Card>
						<Card>
							<CardHeader>
								<CardTitle>Quality Products</CardTitle>
								<CardDescription>
									We offer only the highest quality products from trusted brands
								</CardDescription>
							</CardHeader>
						</Card>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className='bg-gray-800 text-white py-8'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
					<p>&copy; 2025 ShopEasy. All rights reserved.</p>
				</div>
			</footer>
		</div>
	);
}
