import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { getUserById } from '@/lib/localData';

export async function GET() {
	try {
		const cookieStore = await cookies();
		const token = cookieStore.get('token');

		if (!token) {
			return NextResponse.json(
				{ error: 'No token found', authenticated: false },
				{ status: 401 }
			);
		}

		if (!process.env.NEXTAUTH_SECRET) {
			console.error('NEXTAUTH_SECRET is not configured');
			return NextResponse.json(
				{ error: 'Server configuration error', authenticated: false },
				{ status: 500 }
			);
		}

		const decoded = jwt.verify(token.value, process.env.NEXTAUTH_SECRET);
		const user = getUserById(decoded.userId);

		if (!user) {
			// Clear invalid token cookie
			const response = NextResponse.json(
				{ error: 'User not found', authenticated: false },
				{ status: 404 }
			);
			response.cookies.set('token', '', {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'lax',
				maxAge: 0, // Expire immediately
			});
			return response;
		}

		// Return customer-focused user data
		return NextResponse.json({
			id: user.id,
			email: user.email,
			name: user.name,
			createdAt: user.createdAt,
			memberSince: user.createdAt,
			role: 'customer', // Always customer for this e-commerce site
			authenticated: true,
		});
	} catch (error) {
		console.error('Error verifying token:', error);

		// Clear invalid token cookie
		const response = NextResponse.json(
			{ error: 'Invalid token', authenticated: false },
			{ status: 401 }
		);
		response.cookies.set('token', '', {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			maxAge: 0, // Expire immediately
		});
		return response;
	}
}
