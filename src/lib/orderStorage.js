import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

// In-memory storage fallback for serverless environments
let memoryStore = {
	orders: [
		{
			id: '1000',
			userId: '1',
			items: [
				{
					itemId: '1',
					name: 'IKEA Wooden Dining Table',
					price: 12999,
					quantity: 1,
					subtotal: 12999,
				},
			],
			totalAmount: 12999,
			paymentMethod: 'credit_card',
			shippingAddress: {
				name: 'Demo User',
				email: 'demo@example.com',
				address: '123 Demo Street',
				city: 'Demo City',
				state: 'Demo State',
				zipCode: '12345',
				country: 'India',
			},
			status: 'confirmed',
			createdAt: new Date().toISOString(),
		},
	],
	nextOrderId: 1001,
};

// Check if we're in a serverless environment (Netlify/Vercel)
const isServerless =
	process.env.NETLIFY || process.env.VERCEL || !fs.existsSync;

// Ensure data directory exists (only if not serverless)
if (!isServerless) {
	try {
		if (!fs.existsSync(DATA_DIR)) {
			fs.mkdirSync(DATA_DIR, { recursive: true });
		}
	} catch (error) {
		console.log('File system not writable, using memory storage');
	}
}

// Initialize orders file if it doesn't exist
if (!fs.existsSync(ORDERS_FILE)) {
	const initialData = {
		orders: [],
		nextOrderId: 1000,
	};
	fs.writeFileSync(ORDERS_FILE, JSON.stringify(initialData, null, 2));
}

export function readOrdersData() {
	try {
		const data = fs.readFileSync(ORDERS_FILE, 'utf8');
		return JSON.parse(data);
	} catch (error) {
		console.error('Error reading orders data:', error);
		return { orders: [], nextOrderId: 1000 };
	}
}

export function writeOrdersData(data) {
	try {
		fs.writeFileSync(ORDERS_FILE, JSON.stringify(data, null, 2));
		return true;
	} catch (error) {
		console.error('Error writing orders data:', error);
		return false;
	}
}

export function createOrder(userId, orderData) {
	const data = readOrdersData();

	const orderId = data.nextOrderId.toString();
	const order = {
		id: orderId,
		userId,
		items: orderData.items,
		total: orderData.total,
		shippingAddress: orderData.shippingAddress,
		paymentMethod: orderData.paymentMethod,
		status: 'pending',
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	};

	data.orders.push(order);
	data.nextOrderId++;

	if (writeOrdersData(data)) {
		return order;
	}

	throw new Error('Failed to save order');
}

export function getOrderById(userId, orderId) {
	const data = readOrdersData();
	return data.orders.find(
		(order) => order.id === orderId && order.userId === userId
	);
}

export function getUserOrders(userId) {
	const data = readOrdersData();
	return data.orders.filter((order) => order.userId === userId);
}

export function updateOrderStatus(userId, orderId, status) {
	const data = readOrdersData();
	const orderIndex = data.orders.findIndex(
		(order) => order.id === orderId && order.userId === userId
	);

	if (orderIndex !== -1) {
		data.orders[orderIndex].status = status;
		data.orders[orderIndex].updatedAt = new Date().toISOString();

		if (writeOrdersData(data)) {
			return data.orders[orderIndex];
		}
	}

	return null;
}
