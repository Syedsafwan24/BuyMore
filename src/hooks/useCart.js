'use client';

import {
	useState,
	useEffect,
	useCallback,
	createContext,
	useContext,
} from 'react';
import { useAuth } from '@/contexts/AuthContext';

// Cart Context
const CartContext = createContext();

export const useCart = () => {
	const context = useContext(CartContext);
	if (!context) {
		throw new Error('useCart must be used within a CartProvider');
	}
	return context;
};

export const CartProvider = ({ children }) => {
	const [cartItems, setCartItems] = useState([]);
	const [loading, setLoading] = useState(true);
	const [isUpdating, setIsUpdating] = useState(false);
	const { user } = useAuth();

	// Load cart from localStorage on mount and when user changes
	useEffect(() => {
		if (user) {
			// If user is logged in, load their specific cart
			const userCartKey = `cart_${user.id}`;
			const savedCart = localStorage.getItem(userCartKey);
			if (savedCart) {
				try {
					setCartItems(JSON.parse(savedCart));
				} catch (error) {
					console.error('Error parsing saved cart:', error);
					setCartItems([]);
				}
			} else {
				setCartItems([]);
			}
		} else {
			// If no user, clear cart
			setCartItems([]);
		}
		setLoading(false);
	}, [user]);

	// Save cart to localStorage whenever cart changes (only if user is logged in)
	useEffect(() => {
		if (!loading && user) {
			const userCartKey = `cart_${user.id}`;
			localStorage.setItem(userCartKey, JSON.stringify(cartItems));
		}
	}, [cartItems, loading, user]);

	// Fetch cart items from server
	const fetchCartItems = useCallback(async () => {
		if (!user) return;

		try {
			setLoading(true);
			const response = await fetch('/api/cart', {
				credentials: 'include', // Include cookies for authentication
			});

			if (!response.ok) {
				if (response.status === 401) {
					// If unauthorized, load from localStorage
					const userCartKey = `cart_${user.id}`;
					const savedCart = localStorage.getItem(userCartKey);
					if (savedCart) {
						setCartItems(JSON.parse(savedCart));
					} else {
						setCartItems([]);
					}
					return;
				}
				throw new Error('Failed to fetch cart');
			}

			const data = await response.json();
			setCartItems(data);

			// Sync with localStorage
			const userCartKey = `cart_${user.id}`;
			localStorage.setItem(userCartKey, JSON.stringify(data));
		} catch (error) {
			console.error('Error fetching cart:', error);
			// Fallback to localStorage
			const userCartKey = `cart_${user.id}`;
			const savedCart = localStorage.getItem(userCartKey);
			if (savedCart) {
				setCartItems(JSON.parse(savedCart));
			} else {
				setCartItems([]);
			}
		} finally {
			setLoading(false);
		}
	}, [user]);

	// Don't automatically sync with server to avoid infinite loops
	// fetchCartItems will be called manually when needed

	// Add item to cart (requires authentication)
	const addToCart = useCallback(
		async (itemId, quantity = 1, itemData = null) => {
			// Check if user is authenticated
			if (!user) {
				throw new Error('You must be logged in to add items to cart');
			}

			setIsUpdating(true);

			// Always update local state immediately for better UX
			const existingItemIndex = cartItems.findIndex(
				(item) => item.itemId === itemId
			);

			let updatedCartItems;
			if (existingItemIndex >= 0) {
				// Update existing item
				updatedCartItems = [...cartItems];
				updatedCartItems[existingItemIndex] = {
					...updatedCartItems[existingItemIndex],
					quantity: updatedCartItems[existingItemIndex].quantity + quantity,
				};
			} else {
				// Add new item
				const newCartItem = {
					id: `local-${Date.now()}`,
					itemId,
					quantity,
					item: itemData,
					addedAt: new Date(),
				};
				updatedCartItems = [...cartItems, newCartItem];
			}

			setCartItems(updatedCartItems);

			try {
				// Try to sync with server
				const response = await fetch('/api/cart', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					credentials: 'include', // Include cookies for authentication
					body: JSON.stringify({ itemId, quantity }),
				});

				if (response.ok) {
					const serverData = await response.json();
					// Update with server response if available
					setCartItems((prev) =>
						prev.map((item) =>
							item.itemId === itemId
								? { ...item, id: serverData.id || item.id }
								: item
						)
					);
				}
				// If server fails, keep local data

				return { success: true };
			} catch (error) {
				console.log('API unavailable, using local storage only');
				// Keep the local update even if server fails
				return { success: true };
			} finally {
				setIsUpdating(false);
			}
		},
		[cartItems, user]
	);

	// Update item quantity (requires authentication)
	const updateQuantity = useCallback(
		async (cartItemId, newQuantity) => {
			// Check if user is authenticated
			if (!user) {
				throw new Error('You must be logged in to update cart items');
			}

			if (newQuantity < 1) return;

			setIsUpdating(true);

			// Update local state immediately
			setCartItems((prev) =>
				prev.map((item) =>
					item.id === cartItemId ? { ...item, quantity: newQuantity } : item
				)
			);

			try {
				// Try to sync with server
				const cartItem = cartItems.find((item) => item.id === cartItemId);
				if (cartItem) {
					const response = await fetch(`/api/cart/${cartItem.id}`, {
						method: 'PUT',
						headers: {
							'Content-Type': 'application/json',
						},
						credentials: 'include', // Include cookies for authentication
						body: JSON.stringify({ quantity: newQuantity }),
					});
					// Don't revert on server error, keep local state
				}

				return { success: true };
			} catch (error) {
				console.log('API unavailable, using local storage only');
				// Keep the local update
				return { success: true };
			} finally {
				setIsUpdating(false);
			}
		},
		[cartItems, user] // updateQuantity dependencies
	);
	const removeFromCart = useCallback(
		async (cartItemId) => {
			// Check if user is authenticated
			if (!user) {
				throw new Error('You must be logged in to remove cart items');
			}

			setIsUpdating(true);

			// Update local state immediately
			setCartItems((prev) => prev.filter((item) => item.id !== cartItemId));

			try {
				// Try to sync with server
				const cartItem = cartItems.find((item) => item.id === cartItemId);
				if (cartItem) {
					await fetch(`/api/cart/${cartItem.id}`, {
						method: 'DELETE',
						credentials: 'include', // Include cookies for authentication
					});
				}

				return { success: true };
			} catch (error) {
				console.log('API unavailable, using local storage only');
				// Keep the local update
				return { success: true };
			} finally {
				setIsUpdating(false);
			}
		},
		[cartItems, user] // removeFromCart dependencies
	);

	// Get cart statistics
	const getTotalPrice = useCallback(() => {
		return cartItems
			.reduce(
				(total, item) => total + (item.item?.price || 0) * item.quantity,
				0
			)
			.toFixed(2);
	}, [cartItems]);

	const getTotalItems = useCallback(() => {
		return cartItems.reduce((total, item) => total + item.quantity, 0);
	}, [cartItems]);

	// Clear cart
	const clearCart = useCallback(async () => {
		if (!user) {
			throw new Error('You must be logged in to clear cart');
		}

		setCartItems([]);

		// Clear from localStorage
		const userCartKey = `cart_${user.id}`;
		localStorage.removeItem(userCartKey);

		try {
			// Try to clear on server as well
			await fetch('/api/cart', {
				method: 'DELETE',
				credentials: 'include',
			});
		} catch (error) {
			console.log('API unavailable, cart cleared locally only');
		}
	}, [user]);

	// Checkout function to create order
	const checkout = useCallback(
		async (checkoutData = {}) => {
			if (!user) {
				throw new Error('You must be logged in to checkout');
			}

			if (cartItems.length === 0) {
				throw new Error('Cart is empty');
			}

			const totalAmount =
				checkoutData.totalAmount || parseFloat(getTotalPrice());

			try {
				const response = await fetch('/api/checkout', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					credentials: 'include',
					body: JSON.stringify({
						cartItems,
						totalAmount,
						shippingAddress: checkoutData.shippingAddress,
						paymentMethod: checkoutData.paymentMethod,
					}),
				});

				if (!response.ok) {
					throw new Error('Checkout failed');
				}

				const result = await response.json();

				// Clear cart after successful checkout
				await clearCart();

				return result.order;
			} catch (error) {
				console.error('Checkout error:', error);
				throw error;
			}
		},
		[user, cartItems, getTotalPrice, clearCart]
	);

	const value = {
		cartItems,
		loading,
		isUpdating,
		addToCart,
		updateQuantity,
		removeFromCart,
		getTotalPrice,
		getTotalItems,
		clearCart,
		checkout,
		refreshCart: fetchCartItems,
	};

	return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
