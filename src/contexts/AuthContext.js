'use client';

import {
	createContext,
	useContext,
	useState,
	useEffect,
	useCallback,
	useMemo,
} from 'react';

const AuthContext = createContext();

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	// Save user to localStorage whenever user changes
	useEffect(() => {
		if (user) {
			localStorage.setItem('currentUser', JSON.stringify(user));
		} else {
			localStorage.removeItem('currentUser');
		}
	}, [user]);

	const fetchUser = useCallback(async () => {
		try {
			const response = await fetch('/api/auth/me', {
				credentials: 'include', // Include cookies for authentication
			});
			if (response.ok) {
				const userData = await response.json();
				setUser(userData);
			} else {
				// If 401 (unauthorized), clear any invalid tokens
				if (response.status === 401) {
					await fetch('/api/auth/clear', {
						method: 'POST',
						credentials: 'include',
					}).catch(() => {}); // Ignore errors for cleanup
				}
				setUser(null);
			}
		} catch (error) {
			console.error('Error fetching user:', error);
			// Fallback to localStorage
			const savedUser = localStorage.getItem('currentUser');
			if (savedUser) {
				try {
					const userData = JSON.parse(savedUser);
					setUser(userData);
				} catch (parseError) {
					console.error('Error parsing saved user:', parseError);
					localStorage.removeItem('currentUser');
					setUser(null);
				}
			} else {
				setUser(null);
			}
		} finally {
			setLoading(false);
		}
	}, []);

	// Load user from localStorage on mount, then fetch from API
	useEffect(() => {
		const savedUser = localStorage.getItem('currentUser');
		if (savedUser) {
			try {
				const userData = JSON.parse(savedUser);
				setUser(userData);
			} catch (error) {
				console.error('Error parsing saved user:', error);
				localStorage.removeItem('currentUser');
			}
		}
		setLoading(false);
		// Call after definition; don't add as dependency to avoid re-renders
		fetchUser();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const login = useCallback(
		async (email, password) => {
			const response = await fetch('/api/auth/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include', // Include cookies for authentication
				body: JSON.stringify({ email, password }),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Login failed');
			}

			// Refresh user data after successful login
			await fetchUser();
			return data;
		},
		[fetchUser]
	);

	const signup = useCallback(
		async (name, email, password) => {
			const response = await fetch('/api/auth/signup', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include', // Include cookies for authentication
				body: JSON.stringify({ name, email, password }),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Signup failed');
			}

			// Refresh user data after successful signup
			await fetchUser();
			return data;
		},
		[fetchUser]
	);

	const logout = useCallback(async () => {
		try {
			await fetch('/api/auth/logout', {
				method: 'POST',
				credentials: 'include', // Include cookies for authentication
			});
		} catch (error) {
			console.error('Error logging out:', error);
		} finally {
			setUser(null);
		}
	}, []);

	useEffect(() => {
		// This effect is no longer needed as fetchUser is called on mount
	}, []);

	const value = useMemo(
		() => ({
			user,
			loading,
			login,
			signup,
			logout,
			refreshUser: fetchUser,
		}),
		[user, loading, login, signup, logout, fetchUser]
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
