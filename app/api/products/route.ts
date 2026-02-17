import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);

        const filter: any = {};

        // Add filters based on query params
        const manufacturerId = searchParams.get('manufacturerId');
        if (manufacturerId) {
            filter.manufacturerId = manufacturerId;
        } else {
            // By default only show verified products to public
            filter.isVerified = true;
        }

        const material = searchParams.get('material');
        if (material) filter.material = material;

        const minPrice = searchParams.get('min');
        const maxPrice = searchParams.get('max');
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        const products = await Product.find(filter).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: products });
    } catch (error: any) {
        console.error('Error fetching products:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch products from database' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();

        // Strip DB-managed fields
        delete body._id;
        delete body.createdAt;
        delete body.__v;

        const product = await Product.create(body);

        // Revalidate frontend to show new product
        revalidatePath('/', 'layout');
        revalidatePath('/products');

        return NextResponse.json({ success: true, data: product }, { status: 201 });
    } catch (error: any) {
        console.error('Error creating product:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
