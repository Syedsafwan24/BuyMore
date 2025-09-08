'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/contexts/AuthContext';
import {
	ShoppingBag,
	Heart,
	User,
	Search,
	Filter,
	Home,
	Package,
	ShoppingCart,
	LogOut,
	Menu,
	X,
	Bell,
	Settings,
} from 'lucide-react';

export default function SidebarLayout({ children }) {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const [categories, setCategories] = useState([]);
	const [currentCategory, setCurrentCategory] = useState('');
	const pathname = usePathname();
	const router = useRouter();
	const { user, logout } = useAuth();

	// Safely use searchParams with error boundary
	let searchParams;
	try {
		searchParams = useSearchParams();
	} catch {
		searchParams = null;
	}

	// Safely get cart data with fallback
	let getTotalItems;
	try {
		const cartContext = useCart();
		getTotalItems = cartContext.getTotalItems;
	} catch {
		getTotalItems = () => 0; // Fallback if cart context is not available
	}

	// Get current category from URL params safely
	useEffect(() => {
		if (searchParams) {
			setCurrentCategory(searchParams.get('category') || '');
		}
	}, [searchParams]);

	const handleSearch = (e) => {
		e.preventDefault();
		if (searchQuery.trim()) {
			router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
		}
	};

	const handleLogout = async () => {
		try {
			await logout();
			router.push('/');
		} catch (error) {
			console.error('Error logging out:', error);
		}
	};

	// Ensure protected navigation to /cart works reliably by avoiding prefetch + handling auth explicitly
	const handleCartClick = (e) => {
		e?.preventDefault?.();
		if (user) {
			router.push('/cart');
		} else {
			router.push('/login?redirect=/cart');
		}
		setIsSidebarOpen(false);
	};

	const sidebarItems = [
		{
			name: 'Home',
			href: '/',
			icon: Home,
			active: pathname === '/',
		},
		{
			name: 'All Products',
			href: '/products',
			icon: Package,
			active: pathname === '/products' && !currentCategory,
		},
		{
			name: 'Electronics',
			href: '/products?category=electronics',
			icon: Search,
			active: pathname === '/products' && currentCategory === 'electronics',
		},
		{
			name: 'Fashion',
			href: '/products?category=fashion',
			icon: Heart,
			active: pathname === '/products' && currentCategory === 'fashion',
		},
		{
			name: 'Home & Garden',
			href: '/products?category=home',
			icon: Package,
			active: pathname === '/products' && currentCategory === 'home',
		},
		{
			name: 'Shopping Cart',
			href: '/cart',
			icon: ShoppingCart,
			active: pathname === '/cart',
			badge: getTotalItems() > 0 ? getTotalItems() : null,
		},
	];

	return (
		<div className='flex h-screen bg-gray-50'>
			{/* Sidebar */}
			<div
				className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
					isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
				} lg:translate-x-0 lg:static lg:inset-0 border-r border-gray-200`}
			>
				<div className='flex flex-col h-full'>
					{/* Logo */}
					<div className='flex items-center justify-between p-4 border-b border-gray-200'>
						<Link href='/' className='flex items-center space-x-2'>
							<ShoppingBag className='h-6 w-6 text-blue-600' />
							<span className='text-lg font-bold text-gray-900'>BuyMore</span>
						</Link>
						<button
							onClick={() => setIsSidebarOpen(false)}
							className='lg:hidden p-1 rounded-md hover:bg-gray-100'
						>
							<X className='h-4 w-4 text-gray-500' />
						</button>
					</div>

					{/* Navigation */}
					<nav className='flex-1 px-4 py-4'>
						<div className='space-y-1'>
							{sidebarItems.map((item) => {
								const Icon = item.icon;
								return (
									<Link
										key={item.name}
										href={item.href}
										prefetch={false}
										onClick={
											item.href === '/cart' ? handleCartClick : undefined
										}
										className={`flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors ${
											item.active
												? 'bg-blue-50 text-blue-700'
												: 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
										}`}
									>
										<div className='flex items-center space-x-2'>
											<Icon className='h-4 w-4' />
											<span>{item.name}</span>
										</div>
										{item.badge && (
											<span className='bg-blue-600 text-white text-xs rounded-full px-2 py-1'>
												{item.badge}
											</span>
										)}
									</Link>
								);
							})}
						</div>
					</nav>

					{/* User Profile */}
					<div className='p-4 border-t border-gray-200'>
						{user ? (
							<div className='flex items-center space-x-3'>
								<div className='w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center'>
									<span className='text-white text-sm font-semibold'>
										{user.name?.charAt(0) || 'U'}
									</span>
								</div>
								<div className='flex-1 min-w-0'>
									<p className='text-sm font-medium text-gray-900 truncate'>
										{user.name || 'User'}
									</p>
									<p className='text-xs text-gray-500 truncate'>{user.email}</p>
								</div>
								<button
									onClick={handleLogout}
									className='p-1 text-gray-400 hover:text-red-500'
									title='Logout'
								>
									<LogOut className='h-4 w-4' />
								</button>
							</div>
						) : (
							<div className='space-y-2'>
								<Link href='/login'>
									<Button className='w-full bg-blue-600 hover:bg-blue-700 text-white'>
										Login
									</Button>
								</Link>
								<Link href='/signup'>
									<Button
										variant='outline'
										className='w-full border-gray-300 text-gray-700'
									>
										Sign Up
									</Button>
								</Link>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Main content */}
			<div className='flex-1 flex flex-col overflow-hidden'>
				{/* Top Header */}
				<header className='bg-white shadow-sm border-b border-gray-200'>
					<div className='flex items-center justify-between px-2 sm:px-4 py-3'>
						{/* Mobile menu button */}
						<button
							onClick={() => setIsSidebarOpen(true)}
							className='lg:hidden p-2 rounded-md hover:bg-gray-100'
						>
							<Menu className='h-5 w-5 text-gray-600' />
						</button>

						{/* Search */}
						<form
							onSubmit={handleSearch}
							className='flex-1 max-w-xs sm:max-w-md mx-2 sm:mx-4'
						>
							<div className='relative'>
								<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
								<Input
									type='search'
									placeholder='Search...'
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className='pl-10 pr-4 py-2 w-full text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500'
								/>
							</div>
						</form>

						{/* Right side actions */}
						<div className='flex items-center space-x-1 sm:space-x-3'>
							{/* Cart */}
							<Link
								href='/cart'
								prefetch={false}
								onClick={handleCartClick}
								className='relative p-2 text-gray-600 hover:text-blue-600 rounded-md'
								title='Shopping Cart'
							>
								<ShoppingCart className='h-5 w-5' />
								{getTotalItems() > 0 && (
									<span className='absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center'>
										{getTotalItems()}
									</span>
								)}
							</Link>

							{/* User Profile */}
							{user ? (
								<div className='flex items-center space-x-1 sm:space-x-2'>
									<div className='w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center'>
										<span className='text-white text-sm font-semibold'>
											{user.name?.charAt(0) || 'U'}
										</span>
									</div>
									<button
										onClick={handleLogout}
										className='text-gray-500 hover:text-red-500 p-1'
										title='Logout'
									>
										<LogOut className='h-4 w-4' />
									</button>
								</div>
							) : (
								<div className='flex items-center space-x-1 sm:space-x-2'>
									<Link href='/login'>
										<Button
											variant='outline'
											size='sm'
											className='text-xs sm:text-sm px-2 sm:px-3'
										>
											Login
										</Button>
									</Link>
									<Link href='/signup'>
										<Button
											size='sm'
											className='text-xs sm:text-sm px-2 sm:px-3'
										>
											Sign Up
										</Button>
									</Link>
								</div>
							)}
						</div>
					</div>
				</header>

				{/* Page content */}
				<main className='flex-1 overflow-auto'>{children}</main>
			</div>

			{/* Mobile sidebar overlay */}
			{isSidebarOpen && (
				<div
					className='fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden'
					onClick={() => setIsSidebarOpen(false)}
				/>
			)}
		</div>
	);
}
