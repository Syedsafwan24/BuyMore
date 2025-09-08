import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

export async function GET() {
	try {
		const cookieStore = await cookies();
		const token = cookieStore.get('token');

		if (!token) {
			return NextResponse.json({ error: 'No token found', authenticated: false }, { status: 401 });
		}

		if (!process.env.JWT_SECRET) {
			console.error('JWT_SECRET is not configured');
			return NextResponse.json({ error: 'Server configuration error', authenticated: false }, { status: 500 });
		}

		const decoded = jwt.verify(token.value, process.env.JWT_SECRET);
		const user = await prisma.user.findUnique({
			where: { id: decoded.userId },
			select: {
				id: true,
				email: true,
				name: true,
				createdAt: true,
			},
		});

		if (!user) {
			return NextResponse.json({ error: 'User not found', authenticated: false }, { status: 404 });
		}

		// Return customer-focused user data
		return NextResponse.json({
			...user,
			memberSince: user.createdAt,
			role: 'customer', // Always customer for this e-commerce site
			authenticated: true,
		});
	} catch (error) {
		console.error('Error verifying token:', error);
		return NextResponse.json({ error: 'Invalid token', authenticated: false }, { status: 401 });
	}
}
