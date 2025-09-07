'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
	Heart,
	Filter,
	ChevronDown,
	Star,
	ShoppingCart,
	Check,
	Search,
	X,
	SlidersHorizontal,
} from 'lucide-react';

export default function ProductsPage() {
	const [products, setProducts] = useState([]);
	const [allProducts, setAllProducts] = useState([]); // Store all products for client-side filtering
	const [categories, setCategories] = useState([]);
	const [loading, setLoading] = useState(true);
	const [addingToCart, setAddingToCart] = useState(new Set());
	const [showFilters, setShowFilters] = useState(false);
	const [filters, setFilters] = useState({
		category: '',
		minPrice: '',
		maxPrice: '',
		search: '',
	});
	const [activeTab, setActiveTab] = useState('All');
	const [viewMode, setViewMode] = useState('grid'); // grid or list

	const { addToCart, isUpdating } = useCart();
	const { success, error } = useToast();
	const searchParams = useSearchParams();

	// Initialize filters from URL parameters
	useEffect(() => {
		const category = searchParams.get('category') || '';
		const search = searchParams.get('search') || '';
		const minPrice = searchParams.get('minPrice') || '';
		const maxPrice = searchParams.get('maxPrice') || '';

		setFilters({
			category,
			minPrice,
			maxPrice,
			search,
		});

		// Set active tab based on category
		if (category) {
			const tabMap = {
				electronics: 'Electronics',
				fashion: 'Fashion',
				home: 'Home & Garden',
				books: 'Books',
				sports: 'Sports',
			};
			setActiveTab(tabMap[category] || 'All');
		} else {
			setActiveTab('All');
		}
	}, [searchParams]);

	useEffect(() => {
		fetchCategories();
		fetchProducts();
	}, []);

	useEffect(() => {
		fetchProducts();
	}, [filters, activeTab]);

	const fetchCategories = async () => {
		try {
			const response = await fetch('/api/categories');
			const data = await response.json();
			setCategories(data);
		} catch (error) {
			console.error('Error fetching categories:', error);
		}
	};

	const fetchProducts = async () => {
		try {
			setLoading(true);
			const params = new URLSearchParams();

			// Apply filters
			if (filters.category) params.append('category', filters.category);
			if (filters.minPrice) params.append('minPrice', filters.minPrice);
			if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
			if (filters.search) params.append('search', filters.search);

			// Apply tab filtering
			if (activeTab !== 'All') {
				params.append('category', activeTab);
			}

			const response = await fetch(`/api/items?${params}`);
			const data = await response.json();
			setProducts(data);

			// Store all products for filtering
			if (!params.toString()) {
				setAllProducts(data);
			}
		} catch (error) {
			console.error('Error fetching products:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleAddToCart = async (product) => {
		const productId = product.id;

		// Prevent double clicks
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
				success('Item added to cart successfully!');
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

	const handleFilterChange = (key, value) => {
		setFilters((prev) => ({ ...prev, [key]: value }));
	};

	const clearFilters = () => {
		setFilters({
			category: '',
			minPrice: '',
			maxPrice: '',
			search: '',
		});
		setActiveTab('All');
	};

	const hasActiveFilters = () => {
		return (
			filters.category ||
			filters.minPrice ||
			filters.maxPrice ||
			filters.search ||
			activeTab !== 'All'
		);
	};

	const getFilterCount = () => {
		let count = 0;
		if (filters.category) count++;
		if (filters.minPrice) count++;
		if (filters.maxPrice) count++;
		if (filters.search) count++;
		if (activeTab !== 'All') count++;
		return count;
	};

	const handleTabChange = (tab) => {
		setActiveTab(tab);
		// Clear category filter when switching tabs to avoid conflicts
		if (tab !== 'All') {
			setFilters((prev) => ({ ...prev, category: '' }));
		}
	};

	const tabs = ['All', ...categories.map((cat) => cat.name)];

	return (
		<div className='min-h-screen bg-gray-50'>
			{/* Header Section */}
			<div className='bg-white border-b border-gray-200'>
				<div className='px-6 py-4'>
					<div className='flex items-center justify-between mb-4'>
						<h1 className='text-2xl font-bold text-gray-900'>Products</h1>
						<div className='flex items-center space-x-4'>
							{/* Search Bar */}
							<div className='relative'>
								<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
								<Input
									type='text'
									placeholder='Search products...'
									value={filters.search}
									onChange={(e) => handleFilterChange('search', e.target.value)}
									className='pl-10 w-64'
								/>
								{filters.search && (
									<button
										onClick={() => handleFilterChange('search', '')}
										className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
									>
										<X className='h-4 w-4' />
									</button>
								)}
							</div>

							{/* Filter Toggle Button */}
							<Button
								variant='outline'
								size='sm'
								onClick={() => setShowFilters(!showFilters)}
								className={showFilters ? 'bg-blue-50 border-blue-200' : ''}
							>
								<SlidersHorizontal className='h-4 w-4 mr-2' />
								Filters
								{getFilterCount() > 0 && (
									<span className='ml-2 bg-blue-600 text-white rounded-full px-2 py-0.5 text-xs'>
										{getFilterCount()}
									</span>
								)}
							</Button>

							{/* Clear Filters */}
							{hasActiveFilters() && (
								<Button
									variant='ghost'
									size='sm'
									onClick={clearFilters}
									className='text-red-600 hover:text-red-700 hover:bg-red-50'
								>
									Clear All
								</Button>
							)}
						</div>
					</div>

					{/* Advanced Filters Panel */}
					{showFilters && (
						<div className='mb-4 p-4 bg-gray-50 rounded-lg border'>
							<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
								{/* Category Filter */}
								<div>
									<label className='block text-sm font-medium text-gray-700 mb-2'>
										Category
									</label>
									<select
										value={filters.category}
										onChange={(e) =>
											handleFilterChange('category', e.target.value)
										}
										className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
									>
										<option value=''>All Categories</option>
										{categories.map((category) => (
											<option key={category.id} value={category.name}>
												{category.name}
											</option>
										))}
									</select>
								</div>

								{/* Price Range */}
								<div>
									<label className='block text-sm font-medium text-gray-700 mb-2'>
										Min Price
									</label>
									<Input
										type='number'
										placeholder='$0'
										value={filters.minPrice}
										onChange={(e) =>
											handleFilterChange('minPrice', e.target.value)
										}
										className='w-full'
									/>
								</div>

								<div>
									<label className='block text-sm font-medium text-gray-700 mb-2'>
										Max Price
									</label>
									<Input
										type='number'
										placeholder='$999'
										value={filters.maxPrice}
										onChange={(e) =>
											handleFilterChange('maxPrice', e.target.value)
										}
										className='w-full'
									/>
								</div>
							</div>
						</div>
					)}

					{/* Category Tabs */}
					<div className='flex items-center space-x-6 border-b border-gray-200 overflow-x-auto'>
						{tabs.map((tab) => (
							<button
								key={tab}
								onClick={() => handleTabChange(tab)}
								className={`pb-2 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
									activeTab === tab
										? 'border-blue-600 text-blue-600'
										: 'border-transparent text-gray-500 hover:text-gray-700'
								}`}
							>
								{tab}
							</button>
						))}
					</div>

					{/* Results Count */}
					<div className='mt-4 text-sm text-gray-600'>
						{loading ? (
							'Loading products...'
						) : (
							<>
								Showing {products.length} product
								{products.length !== 1 ? 's' : ''}
								{hasActiveFilters() && ' (filtered)'}
							</>
						)}
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className='px-6 py-6'>
				{/* Products Grid */}
				{loading ? (
					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
						{[...Array(8)].map((_, i) => (
							<Card key={i} className='h-80'>
								<div className='animate-pulse h-full'>
									<div className='aspect-square bg-gray-200'></div>
									<div className='p-4 space-y-3'>
										<div className='h-3 bg-gray-200 rounded w-1/2'></div>
										<div className='h-4 bg-gray-200 rounded w-3/4'></div>
										<div className='h-6 bg-gray-200 rounded w-1/3'></div>
									</div>
								</div>
							</Card>
						))}
					</div>
				) : products.length === 0 ? (
					<div className='text-center py-12'>
						<div className='max-w-md mx-auto'>
							<div className='mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 mb-4'>
								<Search className='h-6 w-6 text-gray-400' />
							</div>
							<h3 className='text-lg font-medium text-gray-900 mb-2'>
								No products found
							</h3>
							<p className='text-gray-500 mb-6'>
								{hasActiveFilters()
									? "Try adjusting your filters or search terms to find what you're looking for."
									: 'There are no products available at the moment.'}
							</p>
							{hasActiveFilters() && (
								<Button onClick={clearFilters} variant='outline'>
									Clear All Filters
								</Button>
							)}
						</div>
					</div>
				) : (
					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
						{products.map((product) => (
							<ProductCard key={product.id}>
								<ProductCardImage
									src={product.image || '/placeholder-product.jpg'}
									alt={product.name}
								/>
								<ProductCardContent>
									<div className='flex items-start justify-between mb-2'>
										<div className='flex-1'>
											<p className='text-xs text-blue-600 font-medium mb-1'>
												{product.category?.name || 'Product'}
											</p>
											<ProductCardTitle>{product.name}</ProductCardTitle>
										</div>
										<button className='p-1.5 hover:bg-gray-100 rounded-full transition-colors'>
											<Heart className='w-4 h-4 text-gray-400 hover:text-red-500' />
										</button>
									</div>
									<ProductCardFooter>
										<div className='flex items-center justify-between mb-3'>
											<span className='text-lg font-bold text-gray-900'>
												{formatPriceDisplay(product.price)}
											</span>
											<div className='flex items-center'>
												<Star className='w-3 h-3 text-yellow-400 fill-current' />
												<span className='text-xs text-gray-500 ml-1'>4.5</span>
											</div>
										</div>
										<Button
											size='sm'
											onClick={() => handleAddToCart(product)}
											disabled={addingToCart.has(product.id) || isUpdating}
											className={`w-full transition-all duration-300 ${
												addingToCart.has(product.id)
													? 'bg-green-600 hover:bg-green-700'
													: 'bg-blue-600 hover:bg-blue-700'
											} text-white shadow-sm`}
										>
											{addingToCart.has(product.id) ? (
												<>
													<Check className='w-4 h-4 mr-2' />
													Added!
												</>
											) : (
												<>
													<ShoppingCart className='w-4 h-4 mr-2' />
													Add to Cart
												</>
											)}
										</Button>
									</ProductCardFooter>
								</ProductCardContent>
							</ProductCard>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
