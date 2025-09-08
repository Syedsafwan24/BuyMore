import { NextResponse } from 'next/server';
import { prisma, testDatabaseConnection } from '@/lib/prisma';

export async function GET(request) {
	try {
		// Test database connection first
		const isConnected = await testDatabaseConnection();
		if (!isConnected) {
			console.error('Database connection failed for items');
			return NextResponse.json([], { status: 200 }); // Return empty array instead of error
		}

		const { searchParams } = new URL(request.url);
		const category = searchParams.get('category');
		const minPrice = searchParams.get('minPrice');
		const maxPrice = searchParams.get('maxPrice');
		const search = searchParams.get('search');

		// Build where clause for filtering
		const where = {};

		if (category) {
			where.category = {
				name: {
					equals: category,
					mode: 'insensitive',
				},
			};
		}

		if (minPrice || maxPrice) {
			where.price = {};
			if (minPrice) where.price.gte = parseFloat(minPrice);
			if (maxPrice) where.price.lte = parseFloat(maxPrice);
		}

		if (search) {
			where.OR = [
				{
					name: {
						contains: search,
						mode: 'insensitive',
					},
				},
				{
					description: {
						contains: search,
						mode: 'insensitive',
					},
				},
			];
		}

		const items = await prisma.item.findMany({
			where,
			include: {
				category: true,
			},
			orderBy: {
				createdAt: 'desc',
			},
		});

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
		const { name, description, price, image, stock, categoryId } =
			await request.json();

		const item = await prisma.item.create({
			data: {
				name,
				description,
				price: parseFloat(price),
				image,
				stock: parseInt(stock),
				categoryId,
			},
			include: {
				category: true,
			},
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
