import { NextResponse } from 'next/server';
import { categories } from '@/lib/staticData';

export async function GET() {
	try {
		// Return static categories sorted by name
		const sortedCategories = [...categories].sort((a, b) =>
			a.name.localeCompare(b.name)
		);
		return NextResponse.json(sortedCategories);
	} catch (error) {
		console.error('Get categories error:', error);
		// Return empty array on error to prevent frontend crashes
		return NextResponse.json([]);
	}
}

export async function POST(request) {
	try {
		const { name } = await request.json();

		// For static implementation, we'll just return a mock response
		// In a real app, you'd add to the static categories array
		const newCategory = {
			id: (categories.length + 1).toString(),
			name,
			slug: name.toLowerCase().replace(/\s+/g, '-'),
		};

		return NextResponse.json(newCategory, { status: 201 });
	} catch (error) {
		console.error('Create category error:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
