import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
	return twMerge(clsx(inputs));
}

// Format price in Indian Rupees
export function formatPrice(price) {
	return new Intl.NumberFormat('en-IN', {
		style: 'currency',
		currency: 'INR',
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(price);
}

// Alternative format for display without currency symbol
export function formatPriceDisplay(price) {
	return `₹${new Intl.NumberFormat('en-IN').format(price)}`;
}
