const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
	// Create categories
	const categories = await Promise.all([
		prisma.category.upsert({
			where: { name: 'Electronics' },
			update: {},
			create: { name: 'Electronics' },
		}),
		prisma.category.upsert({
			where: { name: 'Clothing' },
			update: {},
			create: { name: 'Clothing' },
		}),
		prisma.category.upsert({
			where: { name: 'Books' },
			update: {},
			create: { name: 'Books' },
		}),
		prisma.category.upsert({
			where: { name: 'Home & Garden' },
			update: {},
			create: { name: 'Home & Garden' },
		}),
	]);

	console.log('Categories created:', categories);

	// Create sample items
	const items = [
		{
			name: 'iPhone 15 Pro',
			description: 'Latest iPhone with advanced camera system and A17 Pro chip',
			price: 134900.00,
			image:
				'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500',
			stock: 50,
			categoryId: categories[0].id,
		},
		{
			name: 'MacBook Air M3',
			description: 'Lightweight laptop with M3 chip and all-day battery life',
			price: 114900.00,
			image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500',
			stock: 30,
			categoryId: categories[0].id,
		},
		{
			name: 'AirPods Pro',
			description: 'Wireless earbuds with active noise cancellation',
			price: 24900.00,
			image:
				'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=500',
			stock: 100,
			categoryId: categories[0].id,
		},
		{
			name: 'Cotton T-Shirt',
			description: 'Comfortable cotton t-shirt available in multiple colors',
			price: 1299.00,
			image:
				'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
			stock: 200,
			categoryId: categories[1].id,
		},
		{
			name: 'Denim Jeans',
			description: 'Classic straight-fit denim jeans',
			price: 3999.00,
			image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500',
			stock: 150,
			categoryId: categories[1].id,
		},
		{
			name: 'JavaScript: The Good Parts',
			description: 'Essential guide to JavaScript programming',
			price: 899.00,
			image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500',
			stock: 75,
			categoryId: categories[2].id,
		},
		{
			name: 'Smart Garden Kit',
			description: 'Indoor hydroponic garden for growing herbs and vegetables',
			price: 12999.00,
			image:
				'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500',
			stock: 25,
			categoryId: categories[3].id,
		},
	];

	const createdItems = await Promise.all(
		items.map((item) => prisma.item.create({ data: item }))
	);

	console.log('Items created:', createdItems.length);
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
