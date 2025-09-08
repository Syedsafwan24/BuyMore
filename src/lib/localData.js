import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
	fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Helper function to read JSON file
export function readDataFile(filename) {
	const filePath = path.join(DATA_DIR, filename);
	try {
		if (fs.existsSync(filePath)) {
			const data = fs.readFileSync(filePath, 'utf8');
			return JSON.parse(data);
		}
		return null;
	} catch (error) {
		console.error(`Error reading ${filename}:`, error);
		return null;
	}
}

// Helper function to write JSON file
export function writeDataFile(filename, data) {
	const filePath = path.join(DATA_DIR, filename);
	try {
		fs.writeFileSync(filePath, JSON.stringify(data, null, '\t'));
		return true;
	} catch (error) {
		console.error(`Error writing ${filename}:`, error);
		return false;
	}
}

// User management functions
export function getUsers() {
	const data = readDataFile('users.json');
	return data ? data.users : [];
}

export function getUserById(id) {
	const users = getUsers();
	return users.find((user) => user.id === id);
}

export function getUserByEmail(email) {
	const users = getUsers();
	return users.find((user) => user.email === email);
}

export function createUser(userData) {
	const data = readDataFile('users.json') || { users: [], nextUserId: 1 };

	// Check if email already exists
	if (data.users.some((user) => user.email === userData.email)) {
		throw new Error('Email already exists');
	}

	const newUser = {
		id: data.nextUserId.toString(),
		email: userData.email,
		password: userData.password,
		name: userData.name,
		createdAt: new Date().toISOString(),
	};

	data.users.push(newUser);
	data.nextUserId++;

	writeDataFile('users.json', data);
	return newUser;
}

// Cart management functions
export function getCartByUserId(userId) {
	const data = readDataFile('carts.json') || { carts: {}, nextCartId: 1 };
	return data.carts[userId] || [];
}

export function saveCartForUser(userId, cartItems) {
	const data = readDataFile('carts.json') || { carts: {}, nextCartId: 1 };
	data.carts[userId] = cartItems;
	writeDataFile('carts.json', data);
}

export function addItemToCart(userId, itemId, quantity, itemData) {
	const cart = getCartByUserId(userId);
	const existingItemIndex = cart.findIndex((item) => item.itemId === itemId);

	if (existingItemIndex >= 0) {
		cart[existingItemIndex].quantity += quantity;
	} else {
		const data = readDataFile('carts.json') || { carts: {}, nextCartId: 1 };
		cart.push({
			id: data.nextCartId.toString(),
			itemId,
			quantity,
			item: itemData,
			addedAt: new Date().toISOString(),
		});
		data.nextCartId++;
		writeDataFile('carts.json', data);
	}

	saveCartForUser(userId, cart);
	return cart;
}

export function updateCartItem(userId, cartItemId, quantity) {
	const cart = getCartByUserId(userId);
	const itemIndex = cart.findIndex((item) => item.id === cartItemId);

	if (itemIndex >= 0) {
		cart[itemIndex].quantity = quantity;
		saveCartForUser(userId, cart);
	}

	return cart;
}

export function removeCartItem(userId, cartItemId) {
	const cart = getCartByUserId(userId);
	const updatedCart = cart.filter((item) => item.id !== cartItemId);
	saveCartForUser(userId, updatedCart);
	return updatedCart;
}

export function clearCart(userId) {
	saveCartForUser(userId, []);
}

// Order management functions
export function getOrders() {
	const data = readDataFile('orders.json');
	return data ? data.orders : [];
}

export function getOrdersByUserId(userId) {
	const orders = getOrders();
	return orders.filter((order) => order.userId === userId);
}

export function createOrder(
	userId,
	cartItems,
	totalAmount,
	paymentMethod = 'credit_card',
	shippingAddress = null
) {
	const data = readDataFile('orders.json') || { orders: [], nextOrderId: 1000 };

	const newOrder = {
		id: data.nextOrderId.toString(),
		userId,
		items: cartItems.map((item) => ({
			itemId: item.itemId,
			name: item.item?.name,
			price: item.item?.price,
			quantity: item.quantity,
			subtotal: (item.item?.price || 0) * item.quantity,
		})),
		totalAmount,
		paymentMethod,
		shippingAddress,
		status: 'pending',
		createdAt: new Date().toISOString(),
	};

	data.orders.push(newOrder);
	data.nextOrderId++;

	writeDataFile('orders.json', data);

	// Clear the user's cart after order creation
	clearCart(userId);

	return newOrder;
}

export function getOrderById(orderId) {
	const orders = getOrders();
	return orders.find((order) => order.id === orderId);
}
