import { NextResponse } from 'next/server';

// Protected routes that require authentication
const protectedRoutes = [
	'/cart',
	'/checkout',
	'/order-confirmation',
	'/api/cart',
	'/api/checkout',
	'/api/orders',
];

// Routes that should redirect to home if user is already authenticated
const authRoutes = ['/login', '/signup'];

export function middleware(request) {
	const { pathname } = request.nextUrl;

	// Get token from cookies
	const token = request.cookies.get('token');

	// Check if current path is protected
	const isProtectedRoute = protectedRoutes.some((route) =>
		pathname.startsWith(route)
	);

	// Check if current path is an auth route
	const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

	// Simple token check - just verify token exists (detailed verification happens in API routes)
	const isAuthenticated = !!token && token.value.length > 0;

	// For API routes, let them handle authentication themselves and return proper JSON errors
	if (pathname.startsWith('/api/')) {
		return NextResponse.next();
	}

	// Redirect unauthenticated users away from protected routes
	if (isProtectedRoute && !isAuthenticated) {
		const loginUrl = new URL('/login', request.url);
		loginUrl.searchParams.set('redirect', pathname);
		return NextResponse.redirect(loginUrl);
	}

	// Redirect authenticated users away from auth routes
	if (isAuthRoute && isAuthenticated) {
		return NextResponse.redirect(new URL('/', request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		// Skip all internal paths (_next, api/health)
		'/((?!_next/static|_next/image|favicon.ico|api/health).*)',
	],
};
