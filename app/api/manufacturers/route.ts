import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import dbConnect from '@/lib/db';
import Manufacturer from '@/models/Manufacturer';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await dbConnect();
        const manufacturers = await Manufacturer.find().sort({ name: 1 });
        return NextResponse.json({ success: true, data: manufacturers });
    } catch (error: any) {
        console.error('Error fetching manufacturers:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();

        // Strip DB fields
        delete body._id;
        delete body.__v;

        const manufacturer = await Manufacturer.create(body);

        // Revalidate frontend
        revalidatePath('/', 'layout');

        return NextResponse.json({ success: true, data: manufacturer }, { status: 201 });
    } catch (error: any) {
        console.error('Error creating manufacturer:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
