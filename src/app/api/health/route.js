import { NextResponse } from 'next/server';
import { getAllUsers, getAllItems, categories } from '@/lib/staticData';

export async function GET() {
	try {
		// Get counts from static data
		const userCount = getAllUsers().length;
		const categoryCount = categories.length;
		const itemCount = getAllItems().length;

		return NextResponse.json({
			status: 'ok',
			message: 'Static data is accessible',
			data: {
				users: userCount,
				categories: categoryCount,
				items: itemCount,
			},
			timestamp: new Date().toISOString(),
		});
	} catch (error) {
		console.error('Health check error:', error);
		return NextResponse.json(
			{
				status: 'error',
				message: error.message,
				timestamp: new Date().toISOString(),
			},
			{ status: 500 }
		);
	}
}
