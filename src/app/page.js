'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { formatPriceDisplay } from '@/lib/utils';
import {
	Card,
	CardContent,
	ProductCard,
	ProductCardImage,
	ProductCardContent,
	ProductCardTitle,
	ProductCardDescription,
	ProductCardFooter,
} from '@/components/ui/card';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/components/ui/toast';
import {
	ShoppingBag,
	Star,
	Truck,
	Shield,
	ArrowRight,
	Heart,
	Zap,
	Award,
	Users,
	TrendingUp,
	Check,
	ChevronLeft,
	ChevronRight,
	PlayCircle,
	Globe,
	Clock,
	Sparkles,
	Target,
	Smile,
	Mail,
	Package,
} from 'lucide-react';

export default function HomePage() {
	const [featuredProducts, setFeaturedProducts] = useState([]);
	const [categories, setCategories] = useState([]);
	const [loading, setLoading] = useState(true);
	const [currentSlide, setCurrentSlide] = useState(0);
	const [email, setEmail] = useState('');
	const [addingToCart, setAddingToCart] = useState(new Set());

	const { addToCart, isUpdating } = useCart();
	const { success, error } = useToast();

	useEffect(() => {
		fetchFeaturedProducts();
		fetchCategories();

		// Auto-slide for hero carousel
		const interval = setInterval(() => {
			setCurrentSlide((prev) => (prev + 1) % 3);
		}, 5000);

		return () => clearInterval(interval);
	}, []);

	const fetchFeaturedProducts = async () => {
		try {
			const response = await fetch('/api/items');
			if (response.ok) {
				const data = await response.json();
				// Ensure data is an array and get first 8 products
				const safeData = Array.isArray(data) ? data : [];
				setFeaturedProducts(safeData.slice(0, 8));
			} else {
				setFeaturedProducts([]);
			}
		} catch (error) {
			console.error('Error fetching products:', error);
			setFeaturedProducts([]);
		} finally {
			setLoading(false);
		}
	};

	const fetchCategories = async () => {
		try {
			const response = await fetch('/api/categories');
			if (response.ok) {
				const data = await response.json();
				// Ensure data is an array and get first 4 categories
				const safeData = Array.isArray(data) ? data : [];
				setCategories(safeData.slice(0, 4));
			} else {
				setCategories([]);
			}
		} catch (error) {
			console.error('Error fetching categories:', error);
			setCategories([]);
		}
	};

	const handleAddToCart = async (product) => {
		const productId = product.id;

		if (addingToCart.has(productId)) return;

		setAddingToCart((prev) => new Set([...prev, productId]));

		try {
			const result = await addToCart(productId, 1, {
				id: product.id,
				name: product.name,
				price: product.price,
				image: product.image,
				category: product.category,
				stock: product.stock,
			});

			if (result.success) {
				success('Added to cart! 🛒');
			} else {
				error(result.error || 'Failed to add item to cart');
			}
		} catch (err) {
			error('Please login to add items to cart');
		} finally {
			setAddingToCart((prev) => {
				const newSet = new Set(prev);
				newSet.delete(productId);
				return newSet;
			});
		}
	};

	const handleNewsletterSignup = (e) => {
		e.preventDefault();
		if (email) {
			success('Thanks for subscribing! 📧');
			setEmail('');
		}
	};

	const heroSlides = [
		{
			title: 'Premium Electronics & Gadgets',
			subtitle: 'Latest tech at unbeatable prices',
			image: '/hero-1.jpg',
			cta: 'Shop Electronics',
		},
		{
			title: 'Fashion & Lifestyle',
			subtitle: 'Trendy styles for every occasion',
			image: '/hero-2.jpg',
			cta: 'Explore Fashion',
		},
		{
			title: 'Home & Garden Essentials',
			subtitle: 'Transform your living space',
			image: '/hero-3.jpg',
			cta: 'Shop Home',
		},
	];

	return (
		<div className='min-h-screen bg-gray-50'>
			{/* Clean Hero Banner */}
			<section className='bg-white border-b border-gray-200'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
					<div className='grid lg:grid-cols-2 gap-8 items-center'>
						<div>
							<h1 className='text-4xl font-bold text-gray-900 mb-4'>
								Shop Everything You Need
							</h1>
							<p className='text-lg text-gray-600 mb-6'>
								Quality products at great prices. Fast delivery. Easy returns.
							</p>
							<Link href='/products'>
								<Button
									size='lg'
									className='bg-blue-600 hover:bg-blue-700 text-white px-8'
								>
									<ShoppingBag className='w-5 h-5 mr-2' />
									Start Shopping
								</Button>
							</Link>
						</div>
						<div className='hidden lg:block'>
							<div className='bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 text-center'>
								<ShoppingBag className='w-24 h-24 text-blue-600 mx-auto mb-4' />
								<p className='text-gray-600'>Discover thousands of products</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Quick Categories */}
			<section className='py-8 bg-white'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<h2 className='text-xl font-semibold text-gray-900 mb-6'>
						Shop by Category
					</h2>
					<div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
						{[
							{
								name: 'Electronics',
								href: '/products?category=electronics',
								color: 'bg-blue-50 text-blue-700',
							},
							{
								name: 'Fashion',
								href: '/products?category=fashion',
								color: 'bg-pink-50 text-pink-700',
							},
							{
								name: 'Home & Garden',
								href: '/products?category=home',
								color: 'bg-green-50 text-green-700',
							},
							{
								name: 'All Products',
								href: '/products',
								color: 'bg-gray-50 text-gray-700',
							},
						].map((category) => (
							<Link key={category.name} href={category.href}>
								<div
									className={`${category.color} rounded-lg p-4 text-center hover:shadow-md transition-shadow cursor-pointer`}
								>
									<h3 className='font-medium'>{category.name}</h3>
								</div>
							</Link>
						))}
					</div>
				</div>
			</section>

			{/* Featured Products - Clean Grid */}
			<section className='py-8 bg-gray-50'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='flex items-center justify-between mb-6'>
						<h2 className='text-xl font-semibold text-gray-900'>
							Featured Products
						</h2>
						<Link
							href='/products'
							className='text-blue-600 hover:text-blue-700 font-medium'
						>
							View all →
						</Link>
					</div>

					{loading ? (
						<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
							{[...Array(10)].map((_, i) => (
								<div key={i} className='bg-white rounded-lg p-4 shadow-sm'>
									<div className='animate-pulse'>
										<div className='aspect-square bg-gray-200 rounded-lg mb-3'></div>
										<div className='h-4 bg-gray-200 rounded mb-2'></div>
										<div className='h-3 bg-gray-200 rounded w-2/3'></div>
									</div>
								</div>
							))}
						</div>
					) : (
						<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
							{Array.isArray(featuredProducts) && featuredProducts.map((product) => (
								<div
									key={product.id}
									className='bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow group'
								>
									<Link href='/products'>
										<div className='p-4'>
											<div className='aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden'>
												<img
													src={product.image || '/placeholder-product.jpg'}
													alt={product.name}
													className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-200'
												/>
											</div>
											<h3 className='font-medium text-gray-900 text-sm mb-1 line-clamp-2'>
												{product.name}
											</h3>
											<p className='text-xs text-gray-500 mb-2'>
												{product.category?.name}
											</p>
											<div className='flex items-center justify-between'>
												<span className='text-lg font-semibold text-gray-900'>
													{formatPriceDisplay(product.price)}
												</span>
												<div className='flex items-center'>
													<Star className='w-3 h-3 text-yellow-400 fill-current' />
													<span className='text-xs text-gray-500 ml-1'>
														4.2
													</span>
												</div>
											</div>
										</div>
									</Link>
								</div>
							))}
						</div>
					)}
				</div>
			</section>

			{/* Simple Benefits */}
			<section className='py-8 bg-white border-t border-gray-200'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='grid md:grid-cols-3 gap-6 text-center'>
						<div className='flex flex-col items-center'>
							<Truck className='w-8 h-8 text-blue-600 mb-2' />
							<h3 className='font-medium text-gray-900 mb-1'>Free Delivery</h3>
							<p className='text-sm text-gray-600'>On orders above ₹4,000</p>
						</div>
						<div className='flex flex-col items-center'>
							<Shield className='w-8 h-8 text-green-600 mb-2' />
							<h3 className='font-medium text-gray-900 mb-1'>Secure Payment</h3>
							<p className='text-sm text-gray-600'>100% protected</p>
						</div>
						<div className='flex flex-col items-center'>
							<ArrowRight className='w-8 h-8 text-orange-600 mb-2' />
							<h3 className='font-medium text-gray-900 mb-1'>Easy Returns</h3>
							<p className='text-sm text-gray-600'>30-day return policy</p>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
