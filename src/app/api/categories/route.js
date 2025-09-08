import { NextResponse } from 'next/server';
import { prisma, testDatabaseConnection } from '@/lib/prisma';

export async function GET() {
	try {
		// Test database connection first
		const isConnected = await testDatabaseConnection();
		if (!isConnected) {
			console.error('Database connection failed for categories');
			return NextResponse.json([], { status: 200 }); // Return empty array instead of error
		}

		const categories = await prisma.category.findMany({
			orderBy: { name: 'asc' },
		});

		// Always return an array, even if empty
		return NextResponse.json(categories || []);
	} catch (error) {
		console.error('Get categories error:', error);
		// Return empty array on error to prevent frontend crashes
		return NextResponse.json([]);
	}
}

export async function POST(request) {
	try {
		const { name } = await request.json();

		const category = await prisma.category.create({
			data: { name },
		});

		return NextResponse.json(category, { status: 201 });
	} catch (error) {
		console.error('Create category error:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
