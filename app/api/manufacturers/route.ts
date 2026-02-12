import { NextResponse } from 'next/server';
import { getManufacturers } from '@/lib/mock-data';

export async function GET() {
    const manufacturers = await getManufacturers();
    return NextResponse.json({ success: true, data: manufacturers });
}

export async function POST(request: Request) {
    return NextResponse.json({ success: true, data: { name: "Mock Manufacturer" } }, { status: 201 });
}
