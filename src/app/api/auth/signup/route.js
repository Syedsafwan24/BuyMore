import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getUserByEmail, createUser } from '@/lib/localData';
import { signToken } from '@/lib/auth';

export async function POST(request) {
	try {
		const { email, password, name } = await request.json();

		// Check if user already exists
		const existingUser = getUserByEmail(email);

		if (existingUser) {
			return NextResponse.json(
				{ error: 'User already exists' },
				{ status: 400 }
			);
		}

		// Hash password
		const hashedPassword = await bcrypt.hash(password, 12);

		// Create user
		const user = createUser({
			email,
			password: hashedPassword,
			name,
		});

		// Generate token
		const token = signToken({ userId: user.id, email: user.email });

		// Create response with token in cookie
		const response = NextResponse.json(
			{
				message: 'User created successfully',
				user: { id: user.id, email: user.email, name: user.name },
			},
			{ status: 201 }
		);

		response.cookies.set('token', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			maxAge: 60 * 60 * 24 * 7, // 7 days
		});

		return response;
	} catch (error) {
		console.error('Signup error:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
