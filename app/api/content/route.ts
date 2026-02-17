import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import dbConnect from '@/lib/db';
import SiteContent from '@/models/SiteContent';
import { DEFAULT_SITE_CONTENT } from '@/lib/dataStore';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await dbConnect();
        const content = await SiteContent.findOne().sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: content || DEFAULT_SITE_CONTENT });
    } catch (error: any) {
        console.error('Error fetching site content:', error);
        return NextResponse.json({ success: true, data: DEFAULT_SITE_CONTENT });
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();

        // Remove DB-managed fields to prevent modification errors
        delete body._id;
        delete body.createdAt;
        delete body.updatedAt;
        delete body.__v;

        // Use findOneAndUpdate to ensure all fields are updated regardless of nesting
        const content = await SiteContent.findOneAndUpdate(
            {},
            { $set: body },
            { new: true, upsert: true, runValidators: true }
        );

        // Revalidate frontend to show changes immediately
        revalidatePath('/', 'layout');
        revalidatePath('/');
        revalidatePath('/products');
        revalidatePath('/about');
        revalidatePath('/checkout');

        return NextResponse.json({ success: true, data: content });
    } catch (error: any) {
        console.error('Error saving site content:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
