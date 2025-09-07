import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
	try {
		const categories = await prisma.category.findMany({
			orderBy: { name: 'asc' },
		});

		return NextResponse.json(categories);
	} catch (error) {
		console.error('Get categories error:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
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
