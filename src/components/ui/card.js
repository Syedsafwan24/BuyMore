'use client';

import { cn } from '@/lib/utils';

export function Card({ children, className, ...props }) {
	return (
		<div
			className={cn(
				'rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group',
				className
			)}
			{...props}
		>
			{children}
		</div>
	);
}

export function CardHeader({ children, className, ...props }) {
	return (
		<div
			className={cn('flex flex-col space-y-1.5 p-6 pb-4', className)}
			{...props}
		>
			{children}
		</div>
	);
}

export function CardTitle({ children, className, ...props }) {
	return (
		<h3
			className={cn(
				'text-xl font-semibold leading-tight tracking-tight text-gray-900',
				className
			)}
			{...props}
		>
			{children}
		</h3>
	);
}

export function CardDescription({ children, className, ...props }) {
	return (
		<p
			className={cn('text-sm text-gray-500 leading-relaxed', className)}
			{...props}
		>
			{children}
		</p>
	);
}

export function CardContent({ children, className, ...props }) {
	return (
		<div className={cn('p-6 pt-0', className)} {...props}>
			{children}
		</div>
	);
}

export function CardFooter({ children, className, ...props }) {
	return (
		<div className={cn('flex items-center p-6 pt-0', className)} {...props}>
			{children}
		</div>
	);
}

// New specialized product card components for consistent product display
export function ProductCard({ children, className, ...props }) {
	return (
		<Card
			className={cn(
				'h-full flex flex-col hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer',
				className
			)}
			{...props}
		>
			{children}
		</Card>
	);
}

export function ProductCardImage({ src, alt, className, ...props }) {
	return (
		<div className='relative aspect-square overflow-hidden'>
			<img
				src={src}
				alt={alt}
				className={cn(
					'w-full h-full object-cover group-hover:scale-105 transition-transform duration-500',
					className
				)}
				{...props}
			/>
		</div>
	);
}

export function ProductCardContent({ children, className, ...props }) {
	return (
		<div className={cn('p-4 flex-1 flex flex-col', className)} {...props}>
			{children}
		</div>
	);
}

export function ProductCardTitle({ children, className, ...props }) {
	return (
		<h3
			className={cn(
				'font-semibold text-gray-900 line-clamp-2 text-sm leading-tight mb-2',
				className
			)}
			{...props}
		>
			{children}
		</h3>
	);
}

export function ProductCardDescription({ children, className, ...props }) {
	return (
		<p
			className={cn(
				'text-xs text-gray-500 line-clamp-2 mb-3 flex-1',
				className
			)}
			{...props}
		>
			{children}
		</p>
	);
}

export function ProductCardFooter({ children, className, ...props }) {
	return (
		<div className={cn('mt-auto', className)} {...props}>
			{children}
		</div>
	);
}
