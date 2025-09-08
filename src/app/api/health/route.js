import { NextResponse } from 'next/server';
import { prisma, testDatabaseConnection } from '@/lib/prisma';

export async function GET() {
	try {
		const isConnected = await testDatabaseConnection();
		
		if (!isConnected) {
			return NextResponse.json({
				status: 'error',
				message: 'Database connection failed',
				timestamp: new Date().toISOString()
			}, { status: 500 });
		}

		// Try a simple query
		const userCount = await prisma.user.count();
		const categoryCount = await prisma.category.count();
		const itemCount = await prisma.item.count();

		return NextResponse.json({
			status: 'ok',
			message: 'Database is accessible',
			data: {
				users: userCount,
				categories: categoryCount,
				items: itemCount
			},
			timestamp: new Date().toISOString()
		});

	} catch (error) {
		console.error('Health check error:', error);
		return NextResponse.json({
			status: 'error',
			message: error.message,
			timestamp: new Date().toISOString()
		}, { status: 500 });
	}
}
