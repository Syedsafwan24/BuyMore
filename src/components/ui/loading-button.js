'use client';

import { cn } from '@/lib/utils';
import { Loader } from 'lucide-react';

export function LoadingButton({
	children,
	loading,
	disabled,
	className,
	loadingText,
	...props
}) {
	return (
		<button
			disabled={disabled || loading}
			className={cn(
				'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
				'bg-primary text-primary-foreground hover:bg-primary/90',
				'h-10 px-4 py-2',
				className
			)}
			{...props}
		>
			{loading && <Loader className='mr-2 h-4 w-4 animate-spin' />}
			{loading && loadingText ? loadingText : children}
		</button>
	);
}
