import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request, { params }) {
	try {
		const { id } = await params;

		const item = await prisma.item.findUnique({
			where: { id: id },
			include: {
				category: true,
			},
		});

		if (!item) {
			return NextResponse.json({ error: 'Item not found' }, { status: 404 });
		}

		return NextResponse.json(item);
	} catch (error) {
		console.error('Get item error:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}

export async function PUT(request, { params }) {
	try {
		const { id } = await params;
		const { name, description, price, image, stock, categoryId } =
			await request.json();

		const item = await prisma.item.update({
			where: { id: id },
			data: {
				name,
				description,
				price: parseFloat(price),
				image,
				stock: parseInt(stock),
				categoryId,
			},
			include: {
				category: true,
			},
		});

		return NextResponse.json(item);
	} catch (error) {
		console.error('Update item error:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}

export async function DELETE(request, { params }) {
	try {
		const { id } = await params;

		await prisma.item.delete({
			where: { id: id },
		});

		return NextResponse.json({ message: 'Item deleted successfully' });
	} catch (error) {
		console.error('Delete item error:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
