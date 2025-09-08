import { NextResponse } from 'next/server';
import { getAllItems, createItem, categories } from '@/lib/staticData';

export async function GET(request) {
	try {
		const { searchParams } = new URL(request.url);
		const category = searchParams.get('category');
		const minPrice = searchParams.get('minPrice');
		const maxPrice = searchParams.get('maxPrice');
		const search = searchParams.get('search');

		// Get all items from static data
		let items = getAllItems();

		// Apply filters
		if (category) {
			items = items.filter(
				(item) => item.category.name.toLowerCase() === category.toLowerCase()
			);
		}

		if (minPrice) {
			const min = parseFloat(minPrice);
			if (!isNaN(min)) {
				items = items.filter((item) => item.price >= min);
			}
		}

		if (maxPrice) {
			const max = parseFloat(maxPrice);
			if (!isNaN(max)) {
				items = items.filter((item) => item.price <= max);
			}
		}

		if (search) {
			const searchLower = search.toLowerCase();
			items = items.filter(
				(item) =>
					item.name.toLowerCase().includes(searchLower) ||
					item.description.toLowerCase().includes(searchLower)
			);
		}

		// Sort by creation date (newest first)
		items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

		// Always return an array, even if empty
		return NextResponse.json(items || []);
	} catch (error) {
		console.error('Get items error:', error);
		// Return empty array on error to prevent frontend crashes
		return NextResponse.json([]);
	}
}

export async function POST(request) {
	try {
		const { name, description, price, imageUrl, stock, categoryId } =
			await request.json();

		// Find category
		const category = categories.find((cat) => cat.id === categoryId);
		if (!category) {
			return NextResponse.json(
				{ error: 'Category not found' },
				{ status: 400 }
			);
		}

		const item = createItem({
			name,
			description,
			price: parseFloat(price),
			imageUrl,
			stock: parseInt(stock),
			categoryId,
			category,
		});

		return NextResponse.json(item, { status: 201 });
	} catch (error) {
		console.error('Create item error:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
