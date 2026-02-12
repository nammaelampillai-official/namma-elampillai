import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import { getProducts } from '@/lib/dataStore';

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

        // Fallback to mock products
        const { searchParams } = new URL(request.url);
        const manufacturerId = searchParams.get('manufacturerId');

        let products = getProducts();
        if (manufacturerId) {
            products = products.filter(p => p.manufacturerId === manufacturerId);
        } else {
            products = products.filter(p => p.isVerified);
        }

        return NextResponse.json({ success: true, data: products });
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        const product = await Product.create(body);
        return NextResponse.json({ success: true, data: product }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
