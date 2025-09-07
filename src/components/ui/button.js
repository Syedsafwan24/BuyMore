'use client';

import { cn } from '@/lib/utils';

export function Button({
	children,
	className,
	variant = 'default',
	size = 'default',
	...props
}) {
	const baseStyles =
		'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';

	const variants = {
		default: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
		outline:
			'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500',
		ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-blue-500',
		destructive: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
	};

	const sizes = {
		default: 'h-10 px-4 py-2',
		sm: 'h-8 px-3 text-xs',
		lg: 'h-12 px-6',
		icon: 'h-10 w-10',
	};

	return (
		<button
			className={cn(baseStyles, variants[variant], sizes[size], className)}
			{...props}
		>
			{children}
		</button>
	);
}
