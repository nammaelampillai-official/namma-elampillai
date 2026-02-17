import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';

export const dynamic = 'force-dynamic';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        await dbConnect();
        const product = await Product.findById(id);
        if (!product) {
            return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: product });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        await dbConnect();
        const body = await request.json();

        // Strip DB-managed fields
        delete body._id;
        delete body.createdAt;
        delete body.updatedAt;
        delete body.__v;

        const product = await Product.findByIdAndUpdate(id, body, { new: true });
        if (!product) {
            return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
        }

        // Revalidate frontend to show updated product
        revalidatePath('/', 'layout');
        revalidatePath('/products');

        return NextResponse.json({ success: true, data: product });
    } catch (error: any) {
        console.error('Error updating product:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        await dbConnect();
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
        }

        // Revalidate frontend
        revalidatePath('/', 'layout');
        revalidatePath('/products');

        return NextResponse.json({ success: true, message: 'Product deleted successfully' });
    } catch (error: any) {
        console.error('Error deleting product:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
