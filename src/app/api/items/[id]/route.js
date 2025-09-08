import { NextResponse } from 'next/server';
import { findItemById, updateItem, deleteItem } from '@/lib/staticData';

export async function GET(request, { params }) {
	try {
		const { id } = await params;

		const item = findItemById(id);

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

		const updatedItem = updateItem(id, {
			name,
			description,
			price: parseFloat(price),
			image,
			stock: parseInt(stock),
			categoryId,
		});

		if (!updatedItem) {
			return NextResponse.json({ error: 'Item not found' }, { status: 404 });
		}

		return NextResponse.json(updatedItem);
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

		const deletedItem = deleteItem(id);

		if (!deletedItem) {
			return NextResponse.json({ error: 'Item not found' }, { status: 404 });
		}

		return NextResponse.json({ message: 'Item deleted successfully' });
	} catch (error) {
		console.error('Delete item error:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
