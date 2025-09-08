// Static data to replace database
export const users = [
	{
		id: '1',
		email: 'admin@example.com',
		password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // "password"
		name: 'Admin User',
		createdAt: new Date('2024-01-01'),
	},
	{
		id: '2',
		email: 'user@example.com',
		password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // "password"
		name: 'John Doe',
		createdAt: new Date('2024-01-02'),
	},
];

export const categories = [
	{ id: '1', name: 'Electronics', slug: 'electronics' },
	{ id: '2', name: 'Clothing', slug: 'clothing' },
	{ id: '3', name: 'Books', slug: 'books' },
	{ id: '4', name: 'Home & Garden', slug: 'home-garden' },
	{ id: '5', name: 'Sports', slug: 'sports' },
];

export const items = [
	{
		id: '1',
		name: 'iPhone 15 Pro',
		description: 'Latest iPhone with advanced camera system and A17 Pro chip',
		price: 134900,
		imageUrl:
			'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=300&fit=crop&auto=format',
		categoryId: '1',
		category: { id: '1', name: 'Electronics', slug: 'electronics' },
		stock: 50,
		createdAt: new Date('2024-01-01'),
	},
	{
		id: '2',
		name: 'MacBook Air M3',
		description: 'Lightweight laptop with M3 chip and all-day battery life',
		price: 114900,
		imageUrl:
			'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop&auto=format',
		categoryId: '1',
		category: { id: '1', name: 'Electronics', slug: 'electronics' },
		stock: 30,
		createdAt: new Date('2024-01-02'),
	},
	{
		id: '3',
		name: 'Nike Air Max 270',
		description: 'Comfortable running shoes with Max Air unit',
		price: 12495,
		imageUrl:
			'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop&auto=format',
		categoryId: '5',
		category: { id: '5', name: 'Sports', slug: 'sports' },
		stock: 100,
		createdAt: new Date('2024-01-03'),
	},
	{
		id: '4',
		name: 'Adidas Ultraboost 22',
		description: 'Premium running shoes with Boost technology',
		price: 15799,
		imageUrl:
			'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop&auto=format',
		categoryId: '5',
		category: { id: '5', name: 'Sports', slug: 'sports' },
		stock: 75,
		createdAt: new Date('2024-01-04'),
	},
	{
		id: '5',
		name: "Levi's 501 Jeans",
		description: 'Classic straight leg jeans in premium denim',
		price: 4999,
		imageUrl:
			'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=300&fit=crop&auto=format',
		categoryId: '2',
		category: { id: '2', name: 'Clothing', slug: 'clothing' },
		stock: 200,
		createdAt: new Date('2024-01-05'),
	},
	{
		id: '6',
		name: 'Patagonia Fleece Jacket',
		description: 'Warm and comfortable fleece jacket for outdoor activities',
		price: 8999,
		imageUrl:
			'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=300&fit=crop&auto=format',
		categoryId: '2',
		category: { id: '2', name: 'Clothing', slug: 'clothing' },
		stock: 60,
		createdAt: new Date('2024-01-06'),
	},
	{
		id: '7',
		name: 'The Great Gatsby',
		description: 'Classic American novel by F. Scott Fitzgerald',
		price: 399,
		imageUrl:
			'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=300&fit=crop&auto=format',
		categoryId: '3',
		category: { id: '3', name: 'Books', slug: 'books' },
		stock: 150,
		createdAt: new Date('2024-01-07'),
	},
	{
		id: '8',
		name: 'JavaScript: The Good Parts',
		description: 'Essential guide to JavaScript programming',
		price: 799,
		imageUrl:
			'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=300&fit=crop&auto=format',
		categoryId: '3',
		category: { id: '3', name: 'Books', slug: 'books' },
		stock: 80,
		createdAt: new Date('2024-01-08'),
	},
	{
		id: '9',
		name: 'Ceramic Plant Pot Set',
		description: 'Set of 3 modern ceramic pots for indoor plants',
		price: 2499,
		imageUrl:
			'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=300&fit=crop&auto=format',
		categoryId: '4',
		category: { id: '4', name: 'Home & Garden', slug: 'home-garden' },
		stock: 90,
		createdAt: new Date('2024-01-09'),
	},
	{
		id: '10',
		name: 'LED Desk Lamp',
		description: 'Adjustable LED desk lamp with USB charging port',
		price: 3499,
		imageUrl:
			'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&auto=format',
		categoryId: '4',
		category: { id: '4', name: 'Home & Garden', slug: 'home-garden' },
		stock: 45,
		createdAt: new Date('2024-01-10'),
	},
	{
		id: '11',
		name: 'Wireless Bluetooth Headphones',
		description: 'High-quality wireless headphones with noise cancellation',
		price: 16999,
		imageUrl:
			'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop&auto=format',
		categoryId: '1',
		category: { id: '1', name: 'Electronics', slug: 'electronics' },
		stock: 85,
		createdAt: new Date('2024-01-11'),
	},
	{
		id: '12',
		name: 'Smart Watch Series 9',
		description: 'Advanced smartwatch with health monitoring features',
		price: 35999,
		imageUrl:
			'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop&auto=format',
		categoryId: '1',
		category: { id: '1', name: 'Electronics', slug: 'electronics' },
		stock: 40,
		createdAt: new Date('2024-01-12'),
	},
	{
		id: '13',
		name: 'Samsung Galaxy S24 Ultra',
		description: 'Premium Android smartphone with S Pen and 200MP camera',
		price: 124999,
		imageUrl:
			'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop&auto=format',
		categoryId: '1',
		category: { id: '1', name: 'Electronics', slug: 'electronics' },
		stock: 35,
		createdAt: new Date('2024-01-13'),
	},
	{
		id: '14',
		name: 'Sony WH-1000XM5 Headphones',
		description:
			'Industry-leading noise canceling with exceptional sound quality',
		price: 29990,
		imageUrl:
			'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=300&fit=crop&auto=format',
		categoryId: '1',
		category: { id: '1', name: 'Electronics', slug: 'electronics' },
		stock: 60,
		createdAt: new Date('2024-01-14'),
	},
	{
		id: '15',
		name: 'Adidas Originals Hoodie',
		description: 'Classic trefoil logo hoodie in premium cotton blend',
		price: 3999,
		imageUrl:
			'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=300&fit=crop&auto=format',
		categoryId: '2',
		category: { id: '2', name: 'Clothing', slug: 'clothing' },
		stock: 120,
		createdAt: new Date('2024-01-15'),
	},
	{
		id: '16',
		name: 'IKEA Wooden Dining Table',
		description: 'Solid pine dining table for 4 people, natural finish',
		price: 12999,
		imageUrl:
			'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&auto=format',
		categoryId: '4',
		category: { id: '4', name: 'Home & Garden', slug: 'home-garden' },
		stock: 25,
		createdAt: new Date('2024-01-16'),
	},
];

// In-memory storage for runtime data
let runtimeUsers = [...users];
let runtimeItems = [...items];
let userCarts = {}; // userId -> cartItems[]
let nextUserId = 3;
let nextItemId = 17;

// Helper functions
export function getAllUsers() {
	return runtimeUsers;
}

export function createUser(userData) {
	const newUser = {
		id: nextUserId.toString(),
		...userData,
		createdAt: new Date(),
	};
	runtimeUsers.push(newUser);
	nextUserId++;
	return newUser;
}

export function findUserByEmail(email) {
	return runtimeUsers.find((user) => user.email === email);
}

export function findUserById(id) {
	return runtimeUsers.find((user) => user.id === id);
}

export function getAllItems() {
	return runtimeItems;
}

export function findItemById(id) {
	return runtimeItems.find((item) => item.id === id);
}

export function createItem(itemData) {
	const newItem = {
		id: nextItemId.toString(),
		...itemData,
		createdAt: new Date(),
	};
	runtimeItems.push(newItem);
	nextItemId++;
	return newItem;
}

export function updateItem(id, updates) {
	const index = runtimeItems.findIndex((item) => item.id === id);
	if (index !== -1) {
		runtimeItems[index] = { ...runtimeItems[index], ...updates };
		return runtimeItems[index];
	}
	return null;
}

export function deleteItem(id) {
	const index = runtimeItems.findIndex((item) => item.id === id);
	if (index !== -1) {
		return runtimeItems.splice(index, 1)[0];
	}
	return null;
}

export function getUserCart(userId) {
	if (!userCarts[userId]) {
		userCarts[userId] = [];
	}
	return userCarts[userId];
}

export function addToCart(userId, itemId, quantity = 1) {
	if (!userCarts[userId]) {
		userCarts[userId] = [];
	}

	const existingItem = userCarts[userId].find((item) => item.itemId === itemId);
	if (existingItem) {
		existingItem.quantity += quantity;
	} else {
		userCarts[userId].push({
			id: Date.now().toString(),
			itemId,
			quantity,
			addedAt: new Date(),
		});
	}

	return userCarts[userId];
}

export function removeFromCart(userId, itemId) {
	if (!userCarts[userId]) {
		return [];
	}

	userCarts[userId] = userCarts[userId].filter(
		(item) => item.itemId !== itemId
	);
	return userCarts[userId];
}

export function updateCartItemQuantity(userId, itemId, quantity) {
	if (!userCarts[userId]) {
		return [];
	}

	const item = userCarts[userId].find((item) => item.itemId === itemId);
	if (item) {
		if (quantity <= 0) {
			return removeFromCart(userId, itemId);
		}
		item.quantity = quantity;
	}

	return userCarts[userId];
}

export function clearCart(userId) {
	userCarts[userId] = [];
	return [];
}

// Order management
let userOrders = {}; // userId -> orders[]
let orderIdCounter = 1000; // Start order IDs from 1000

export function createOrder(userId, orderData) {
	if (!userOrders[userId]) {
		userOrders[userId] = [];
	}

	const orderId = (orderIdCounter++).toString();
	const order = {
		id: orderId,
		userId,
		items: orderData.items,
		total: orderData.total,
		shippingAddress: orderData.shippingAddress,
		paymentMethod: orderData.paymentMethod,
		status: 'pending',
		createdAt: new Date(),
		updatedAt: new Date(),
	};

	userOrders[userId].push(order);

	// Clear user's cart after successful order
	clearCart(userId);

	return order;
}

export function getUserOrders(userId) {
	if (!userOrders[userId]) {
		userOrders[userId] = [];
	}
	return userOrders[userId];
}

export function getOrderById(userId, orderId) {
	if (!userOrders[userId]) {
		return null;
	}
	return userOrders[userId].find((order) => order.id === orderId);
}

export function updateOrderStatus(userId, orderId, status) {
	const order = getOrderById(userId, orderId);
	if (order) {
		order.status = status;
		order.updatedAt = new Date();
		return order;
	}
	return null;
}
