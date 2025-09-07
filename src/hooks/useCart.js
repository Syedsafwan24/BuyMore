'use client';

import {
	useState,
	useEffect,
	useCallback,
	createContext,
	useContext,
} from 'react';

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

	// Fetch cart items from server
	const fetchCartItems = useCallback(async () => {
		try {
			setLoading(true);
			const response = await fetch('/api/cart');

			if (!response.ok) {
				if (response.status === 401) {
					setCartItems([]);
					return;
				}
				throw new Error('Failed to fetch cart');
			}

			const data = await response.json();
			setCartItems(data);
		} catch (error) {
			console.error('Error fetching cart:', error);
			setCartItems([]);
		} finally {
			setLoading(false);
		}
	}, []);

	// Add item to cart with optimistic update
	const addToCart = useCallback(
		async (itemId, quantity = 1, itemData = null) => {
			setIsUpdating(true);

			// Optimistic update
			if (itemData) {
				const existingItemIndex = cartItems.findIndex(
					(item) => item.itemId === itemId
				);

				if (existingItemIndex >= 0) {
					// Update existing item
					const optimisticUpdate = [...cartItems];
					optimisticUpdate[existingItemIndex] = {
						...optimisticUpdate[existingItemIndex],
						quantity: optimisticUpdate[existingItemIndex].quantity + quantity,
					};
					setCartItems(optimisticUpdate);
				} else {
					// Add new item
					const newCartItem = {
						id: `temp-${Date.now()}`, // Temporary ID
						itemId,
						quantity,
						item: itemData,
						isOptimistic: true,
					};
					setCartItems((prev) => [...prev, newCartItem]);
				}
			}

			try {
				const response = await fetch('/api/cart', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ itemId, quantity }),
				});

				if (!response.ok) {
					const data = await response.json();
					throw new Error(data.error || 'Failed to add to cart');
				}

				const updatedItem = await response.json();

				// Replace optimistic update with real data
				setCartItems((prev) => {
					const filtered = prev.filter(
						(item) => !item.isOptimistic || item.itemId !== itemId
					);
					const existingIndex = filtered.findIndex(
						(item) => item.itemId === itemId
					);

					if (existingIndex >= 0) {
						filtered[existingIndex] = updatedItem;
						return filtered;
					} else {
						return [...filtered, updatedItem];
					}
				});

				return { success: true, item: updatedItem };
			} catch (error) {
				// Revert optimistic update on error
				if (itemData) {
					setCartItems((prev) =>
						prev.filter((item) => !item.isOptimistic || item.itemId !== itemId)
					);
				}
				return { success: false, error: error.message };
			} finally {
				setIsUpdating(false);
			}
		},
		[cartItems]
	);

	// Update item quantity with optimistic update
	const updateQuantity = useCallback(
		async (cartItemId, newQuantity) => {
			if (newQuantity < 1) return;

			setIsUpdating(true);

			// Optimistic update
			const originalItems = [...cartItems];
			setCartItems((prev) =>
				prev.map((item) =>
					item.id === cartItemId ? { ...item, quantity: newQuantity } : item
				)
			);

			try {
				const response = await fetch(`/api/cart/${cartItemId}`, {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ quantity: newQuantity }),
				});

				if (!response.ok) {
					throw new Error('Failed to update quantity');
				}

				const updatedItem = await response.json();
				setCartItems((prev) =>
					prev.map((item) => (item.id === cartItemId ? updatedItem : item))
				);

				return { success: true };
			} catch (error) {
				// Revert optimistic update
				setCartItems(originalItems);
				return { success: false, error: error.message };
			} finally {
				setIsUpdating(false);
			}
		},
		[cartItems]
	);

	// Remove item from cart with optimistic update
	const removeFromCart = useCallback(
		async (cartItemId) => {
			setIsUpdating(true);

			// Optimistic update
			const originalItems = [...cartItems];
			setCartItems((prev) => prev.filter((item) => item.id !== cartItemId));

			try {
				const response = await fetch(`/api/cart/${cartItemId}`, {
					method: 'DELETE',
				});

				if (!response.ok) {
					throw new Error('Failed to remove item');
				}

				return { success: true };
			} catch (error) {
				// Revert optimistic update
				setCartItems(originalItems);
				return { success: false, error: error.message };
			} finally {
				setIsUpdating(false);
			}
		},
		[cartItems]
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

	// Initialize cart on mount
	useEffect(() => {
		fetchCartItems();
	}, [fetchCartItems]);

	const value = {
		cartItems,
		loading,
		isUpdating,
		addToCart,
		updateQuantity,
		removeFromCart,
		getTotalPrice,
		getTotalItems,
		refreshCart: fetchCartItems,
	};

	return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
