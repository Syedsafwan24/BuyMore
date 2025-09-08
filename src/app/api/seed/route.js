import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST() {
	try {
		// Check if categories already exist
		const existingCategories = await prisma.category.findMany();
		
		if (existingCategories.length === 0) {
			// Create sample categories
			const categories = await prisma.category.createMany({
				data: [
					{ name: 'Electronics' },
					{ name: 'Fashion' },
					{ name: 'Home & Garden' },
					{ name: 'Books' },
					{ name: 'Sports' }
				]
			});

			console.log('Created categories:', categories);
		}

		// Check if items exist
		const existingItems = await prisma.item.findMany();
		
		if (existingItems.length === 0) {
			// Get categories to link items
			const cats = await prisma.category.findMany();
			
			if (cats.length > 0) {
				// Create sample items
				const items = await prisma.item.createMany({
					data: [
						{
							name: 'Smartphone',
							description: 'Latest smartphone with amazing features',
							price: 299.99,
							image: '/placeholder-product.jpg',
							stock: 50,
							categoryId: cats[0].id
						},
						{
							name: 'Laptop',
							description: 'High-performance laptop for work and gaming',
							price: 899.99,
							image: '/placeholder-product.jpg',
							stock: 25,
							categoryId: cats[0].id
						},
						{
							name: 'T-Shirt',
							description: 'Comfortable cotton t-shirt',
							price: 19.99,
							image: '/placeholder-product.jpg',
							stock: 100,
							categoryId: cats[1].id
						}
					]
				});

				console.log('Created items:', items);
			}
		}

		const categoryCount = await prisma.category.count();
		const itemCount = await prisma.item.count();

		return NextResponse.json({
			message: 'Database seeded successfully',
			data: {
				categories: categoryCount,
				items: itemCount
			}
		});

	} catch (error) {
		console.error('Seed error:', error);
		return NextResponse.json(
			{ error: 'Failed to seed database', details: error.message },
			{ status: 500 }
		);
	}
}
