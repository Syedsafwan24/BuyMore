import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getUserByEmail } from '@/lib/localData';
import { signToken } from '@/lib/auth';

export async function POST(request) {
	try {
		const { email, password } = await request.json();

		// Find user in local data
		const user = getUserByEmail(email);

		if (!user) {
			return NextResponse.json(
				{ error: 'Invalid credentials' },
				{ status: 401 }
			);
		}

		// Check password
		const isValidPassword = await bcrypt.compare(password, user.password);

		if (!isValidPassword) {
			return NextResponse.json(
				{ error: 'Invalid credentials' },
				{ status: 401 }
			);
		}

		// Generate token
		const token = signToken({ userId: user.id, email: user.email });

		// Create response with token in cookie
		const response = NextResponse.json(
			{
				message: 'Login successful',
				user: { id: user.id, email: user.email, name: user.name },
			},
			{ status: 200 }
		);

		response.cookies.set('token', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			maxAge: 60 * 60 * 24 * 7, // 7 days
		});

		return response;
	} catch (error) {
		console.error('Login error:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
